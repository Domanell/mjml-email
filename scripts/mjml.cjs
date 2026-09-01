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

const flagsWithValue = ['--input', '-i', '--output', '-o', '--port'];
const booleanFlags = ['--watch', '--dev', '--minify'];
const positional = [];
for (let i = 0; i < args.length; i++) {
  if (flagsWithValue.includes(args[i])) { i++; continue; }
  if (booleanFlags.includes(args[i])) continue;
  positional.push(args[i]);
}
const templateArgument = positional[0];
const envFile = path.resolve('.env');

function readEnvFile() {
  try {
    return fs.readFileSync(envFile, 'utf8');
  } catch {
    return '';
  }
}

function readEnvVar(key) {
  const match = readEnvFile().match(new RegExp(`^${key}=(.*)$`, 'm'));
  return match ? match[1].trim() : undefined;
}

function writeEnvVar(key, value) {
  const content = readEnvFile();
  const pattern = new RegExp(`^${key}=.*$`, 'm');
  const line = `${key}=${value}`;
  const next = pattern.test(content)
    ? content.replace(pattern, line)
    : `${content}${content && !content.endsWith('\n') ? '\n' : ''}${line}\n`;
  fs.writeFileSync(envFile, next);
}

function listTemplates() {
  try {
    return fs.readdirSync('emails', { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
  } catch {
    return [];
  }
}

function usageError(message) {
  console.error(message);
  console.error('Usage: node scripts/mjml.cjs [<template-name>] [--watch | --dev] [--minify]');
  console.error('   or: node scripts/mjml.cjs --input <source.mjml> --output <output.html> [--watch | --dev] [--minify]');
  const available = listTemplates();
  if (available.length > 0) console.error(`Available templates: ${available.join(', ')}`);
  process.exit(1);
}

let input = readOption('--input', '-i');
let output = readOption('--output', '-o');

if (!input && !output) {
  const name = templateArgument || readEnvVar('TEMPLATE');

  if (!name) usageError('No template given and no TEMPLATE set in .env yet.');

  input = `emails/${name}/${name}.mjml`;
  output = `emails/${name}/${name}.html`;

  if (!fs.existsSync(input)) usageError(`Template "${name}" not found (expected ${input}).`);
  if (templateArgument) writeEnvVar('TEMPLATE', name);
} else if (!input || !output) {
  usageError('Both --input and --output are required when overriding the convention paths.');
}

const sourcePath = path.resolve(input);
const outputPath = path.resolve(output);
const outputDirectory = path.dirname(outputPath);
const assetsPath = path.dirname(sourcePath);
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
