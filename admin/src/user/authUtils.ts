import * as CryptoJS from 'crypto-js';

export function generatePasswordHash(password: string, salt: string) {
  return CryptoJS.SHA256(password + salt).toString();
}

export function generateSalt() {
  return CryptoJS.lib.WordArray.random(128 / 8).toString();
}
