const { readFile, writeFile, copyFile, access } = require('fs').promises;

function log(...args) {
  console.log('[react-native-maps]', ...args);
}

async function reactNativeMaps() {
  const modulePath = 'node_modules/react-native-maps';
  try {
    await access(modulePath);
  } catch {
    log('react-native-maps not found in node_modules, skipping patch.');
    return;
  }

  try {
    log(
      '📦 Creating web compatibility of react-native-maps using an empty module loaded on web builds'
    );
    await writeFile(`${modulePath}/lib/index.web.js`, 'module.exports = {}', 'utf-8');
    await copyFile(`${modulePath}/lib/index.d.ts`, `${modulePath}/lib/index.web.d.ts`);
    const pkg = JSON.parse(await readFile(`${modulePath}/package.json`, 'utf-8'));
    pkg['react-native'] = 'lib/index.js';
    pkg['main'] = 'lib/index.web.js';
    await writeFile(`${modulePath}/package.json`, JSON.stringify(pkg, null, 2), 'utf-8');
    log('✅ script ran successfully');
  } catch (err) {
    log('⚠️ Failed to patch react-native-maps:', err.message);
  }
}

reactNativeMaps();
