import { execSync } from 'child_process';
import path from 'path';

const patterns = [
  "AKIA[0-9A-Z]{16}", // AWS
  "sk_live_[a-zA-Z0-9]{32,}", // Stripe (plus spécifique)
  "ghp_[a-zA-Z0-9]{36}", // GitHub
  "-----BEGIN.*PRIVATE KEY-----" // SSH/PEM
];

console.log('🔍 Scanning for secrets...');

let found = false;
patterns.forEach(pattern => {
  try {
    // Search only git-tracked files, excluding the script itself
    const cmd = `git grep -nE "${pattern}" -- '*.ts' '*.tsx' '*.js' '*.json' '*.md' ':!check-secrets.js' 2>/dev/null`;
    const output = execSync(cmd).toString();
    if (output) {
      console.error(`❌ Potential secret found with pattern ${pattern}:`);
      console.error(output);
      found = true;
    }
  } catch (e) {
    // git grep returns exit code 1 if no match found
  }
});

if (found) {
  console.error('🛑 Secrets scan failed. Please remove secrets before pushing.');
  process.exit(1);
} else {
  console.log('✅ No secrets found.');
}
