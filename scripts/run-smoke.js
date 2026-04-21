/**
 * Self-contained smoke test runner.
 * Starts vite on a fixed port, runs smoke-test.js, then stops vite.
 * Always the same command → "always allow" in Claude Code works reliably.
 */
import { spawn, execSync } from 'child_process';
import { createServer } from 'net';

const PORT = 4444;
const URL = `http://localhost:${PORT}/dualuna/`;

const log = (msg) => process.stdout.write(msg + '\n');

function isPortInUse(port) {
  return new Promise(resolve => {
    const s = createServer();
    s.once('error', () => resolve(true));
    s.once('listening', () => { s.close(); resolve(false); });
    s.listen(port);
  });
}

function waitForPort(port, maxMs = 20000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      isPortInUse(port).then(inUse => {
        if (inUse) return resolve();
        if (Date.now() - start > maxMs) return reject(new Error(`Timeout waiting for port ${port}`));
        setTimeout(check, 300);
      });
    };
    check();
  });
}

async function run() {
  const alreadyRunning = await isPortInUse(PORT);
  let viteProc = null;

  if (!alreadyRunning) {
    log(`Starting vite on port ${PORT}...`);
    viteProc = spawn('npx', ['vite', '--port', String(PORT), '--host'], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    viteProc.stdout.on('data', d => process.stdout.write(d));
    viteProc.stderr.on('data', d => process.stderr.write(d));
    await waitForPort(PORT);
    log(`Server ready at ${URL}\n`);
  } else {
    log(`Using existing server on port ${PORT}\n`);
  }

  // Run smoke test
  const smokeProc = spawn('node', ['scripts/smoke-test.js'], {
    env: { ...process.env, SMOKE_URL: URL },
    stdio: 'inherit',
  });

  const code = await new Promise(resolve => smokeProc.on('close', resolve));

  if (viteProc) {
    viteProc.kill('SIGTERM');
  }

  process.exit(code);
}

run().catch(e => {
  log(`Fatal: ${e.message}`);
  process.exit(1);
});
