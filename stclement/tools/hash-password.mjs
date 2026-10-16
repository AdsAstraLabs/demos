#!/usr/bin/env node
// Prints a hashed password to use in ADMIN_USERS instead of the plain password:
//   node tools/hash-password.mjs            (asks for the password)
//   ADMIN_USERS=office@example.org:scrypt$16384$…$…
import crypto from 'node:crypto';
import readline from 'node:readline';

const rl = readline.createInterface({ input: process.stdin, output: process.stderr });
rl.question('Password: ', pw => {
  rl.close();
  if (!pw) { console.error('No password given.'); process.exit(1); }
  const salt = crypto.randomBytes(16), N = 16384;
  const hash = crypto.scryptSync(pw, salt, 32, { N, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  console.log('scrypt$' + N + '$' + salt.toString('base64') + '$' + hash.toString('base64'));
});
