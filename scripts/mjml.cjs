const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const mjml = require('mjml');

const args = process.argv.slice(2);
const watchMode = args.includes('--watch') || args.includes('--dev');
const devMode = args.includes('--dev');
const minify = args.includes('--minify');

function readOption(longName, shortName) {
  const index = args.findIndex((argument) => argument === longName || argument === shortName);
  return index === -1 ? undefined : args[index + 1];
}

const input = readOption('--input', '-i');
const output = readOption('--output', '-o');

if (!input || !output) {
  console.error('Usage: node scripts/mjml.cjs --input <source.mjml> --output <output.html> [--watch | --dev] [--minify]');
  process.exit(1);
}

const sourcePath = path.resolve(input);
const outputPath = path.resolve(output);
const outputDirectory = path.dirname(outputPath);
const assetsPath = path.resolve('assets');
const previewPath = `/${path.basename(outputPath)}`;
const port = Number(readOption('--port') || process.env.PREVIEW_PORT || 3000);
const clients = new Set();

const contentTypes = {
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

const reloadClient = `<script>
  new EventSource('/__preview_events').addEventListener('reload', () => location.reload());
</script>`;

function displayPath(filePath) {
  return path.relative(process.cwd(), filePath) || path.basename(filePath);
}

function log(message) {
  console.log(`[${new Date().toLocaleTimeString()}] ${message}`);
}

async function compile() {
  const source = await fs.promises.readFile(sourcePath, 'utf8');
  const { html, errors } = await mjml(source, {
    filePath: sourcePath,
    minify,
    validationLevel: 'strict',
  });

  if (errors.length > 0) {
    throw new Error(errors.map(({ formattedMessage }) => formattedMessage).join('\n'));
  }

  await fs.promises.mkdir(outputDirectory, { recursive: true });
  await fs.promises.writeFile(outputPath, html);
  log(`Compiled ${displayPath(sourcePath)} -> ${displayPath(outputPath)}${minify ? ' (minified)' : ''}`);
}

async function compileAndReport() {
  try {
    await compile();
    return true;
  } catch (error) {
    console.error(`[${new Date().toLocaleTimeString()}] Compilation failed; watching for the next save.\n${error.message}`);
    return false;
  }
}

function startWatcher() {
  let timer;
  let compiling = false;
  let compileAgain = false;

  const queueCompile = () => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      if (compiling) {
        compileAgain = true;
        return;
      }

      compiling = true;
      await compileAndReport();
      compiling = false;

      if (compileAgain) {
        compileAgain = false;
        queueCompile();
      }
    }, 250);
  };

  fs.watchFile(sourcePath, { interval: 300, persistent: true }, (current, previous) => {
    if (previous.mtimeMs !== 0) {
      queueCompile(current, previous);
    }
  });
}

function resolveFile(rootPath, relativePath) {
  const filePath = path.resolve(rootPath, relativePath);
  return path.relative(rootPath, filePath).startsWith('..') ? null : filePath;
}

function sendFile(requestPath, response) {
  const pathname = requestPath === '/' ? previewPath : requestPath;
  const isAsset = pathname.startsWith('/assets/');
  const rootPath = isAsset ? assetsPath : outputDirectory;
  const relativePath = isAsset ? pathname.slice('/assets/'.length) : pathname.replace(/^\/+/, '');
  const filePath = resolveFile(rootPath, relativePath);

  if (!filePath) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  fs.promises.readFile(filePath)
    .then((contents) => {
      const isHtml = path.extname(filePath).toLowerCase() === '.html';
      response.writeHead(200, {
        'Cache-Control': 'no-store',
        'Content-Type': contentTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      });
      response.end(isHtml ? contents.toString('utf8').replace(/<\/body>/i, `${reloadClient}</body>`) : contents);
    })
    .catch(() => response.writeHead(404).end('Preview file not found.'));
}

function startPreview() {
  const server = http.createServer((request, response) => {
    const { pathname } = new URL(request.url, 'http://127.0.0.1');

    if (pathname === '/__preview_events') {
      response.writeHead(200, {
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Content-Type': 'text/event-stream',
      });
      response.write('\n');
      clients.add(response);
      request.on('close', () => clients.delete(response));
      return;
    }

    sendFile(decodeURIComponent(pathname), response);
  });

  fs.watchFile(outputPath, { interval: 300, persistent: true }, (current, previous) => {
    if (previous.mtimeMs === 0) return;

    for (const client of clients) {
      client.write('event: reload\ndata: template rebuilt\n\n');
    }
  });

  server.listen(port, '127.0.0.1', () => {
    console.log(`Preview: http://127.0.0.1:${port}${previewPath}`);
  });

  server.on('error', (error) => {
    console.error(`Preview server failed: ${error.message}`);
    process.exitCode = 1;
  });
}

async function main() {
  if (!watchMode) {
    const succeeded = await compileAndReport();
    process.exitCode = succeeded ? 0 : 1;
    return;
  }

  await compileAndReport();
  startWatcher();
  log(`Watching ${displayPath(sourcePath)}. Press Ctrl+C to stop.`);

  if (devMode) {
    startPreview();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
