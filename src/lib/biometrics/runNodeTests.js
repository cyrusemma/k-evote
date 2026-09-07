// src/lib/biometrics/runNodeTests.js
import { runBiometricSecurityTestSuite } from './biometricSecurityTest.js';

async function main() {
  console.log('🚀 Running KNUST Biometric Security & Liveness Test Suite...\n');
  const results = await runBiometricSecurityTestSuite();

  results.tests.forEach((t) => {
    const symbol = t.status === 'PASS' ? '✅' : '❌';
    console.log(`${symbol} [${t.status}] ${t.name} -> ${t.details}`);
  });

  console.log(`\n========================================`);
  console.log(`Total: ${results.total} | Passed: ${results.passed} | Failed: ${results.failed}`);
  console.log(`========================================\n`);

  if (results.failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Test Suite Error:', err);
  process.exit(1);
});
