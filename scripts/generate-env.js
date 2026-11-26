const fs = require('fs');
const path = require('path');

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf8');
  const vars = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eqIndex = line.indexOf('=');
    if (eqIndex === -1) continue;
    const key = line.slice(0, eqIndex).trim();
    let val = line.slice(eqIndex + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    vars[key] = val;
  }
  return vars;
}

const rootDir = path.resolve(__dirname, '..');
const localEnv = readEnvFile(path.join(rootDir, '.env'));
const kakaoKey = (
  process.env.EXPO_PUBLIC_KAKAO_MAP_KEY ||
  localEnv.EXPO_PUBLIC_KAKAO_MAP_KEY ||
  ''
).trim();

const output = [
  'window.__ENV__ = window.__ENV__ || {};',
  `window.__ENV__.KAKAO_MAP_KEY = ${JSON.stringify(kakaoKey)};`,
  `window.EXPO_PUBLIC_KAKAO_MAP_KEY = ${JSON.stringify(kakaoKey)};`,
  '',
].join('\n');

fs.writeFileSync(path.join(rootDir, 'env.js'), output, 'utf8');
console.log(
  `[generate-env] env.js generated (EXPO_PUBLIC_KAKAO_MAP_KEY: ${
    kakaoKey ? 'configured' : 'empty'
  })`
);
