const { execSync } = require('child_process');
const path = require('path');

const patterns = [
  "AKIA[0-9A-Z]{16}", // AWS
  "sk_live_",         // Stripe
  "ghp_[a-zA-Z0-9]{36}", // GitHub
  "-----BEGIN.*PRIVATE KEY-----" // SSH/PEM
];

console.log('🔍 Scanning for secrets...');

let found = false;
patterns.forEach(pattern => {
  try {
    // Search in ts, tsx, js, json, md, excluding node_modules, .next, .git
    const cmd = `grep -rnE "${pattern}" . --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git --include="*.ts" --include="*.tsx" --include="*.js" --include="*.json" --include="*.md" 2>/dev/null`;
    const output = execSync(cmd).toString();
    if (output) {
      console.error(`❌ Potential secret found with pattern ${pattern}:`);
      console.error(output);
      found = true;
    }
  } catch (e) {
    // grep returns exit code 1 if no match found
  }
});

if (found) {
  console.error('🛑 Secrets scan failed. Please remove secrets before pushing.');
  process.exit(1);
} else {
  console.log('✅ No secrets found.');
}
