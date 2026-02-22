/**
 * Generates a user/employee number with structure SP-XXXXX (5 alphanumeric chars after SP-).
 * Character set: 0-9, a-z (lowercase) for readability.
 */
const CHARS = '0123456789abcdefghijklmnopqrstuvwxyz';

export function generateSpNumber(): string {
  let suffix = '';
  for (let i = 0; i < 5; i++) {
    suffix += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return `SP-${suffix}`;
}
