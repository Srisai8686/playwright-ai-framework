// utils/dataGenerator.js

export function randomString(len = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let out = '';
  for (let i = 0; i < len; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export function randomEmail() {
  return `user_${randomString(6)}@test.com`;
}

export function randomName() {
  return `User ${randomString(5)}`;
}

export function randomPhone() {
  let num = '';
  for (let i = 0; i < 10; i++) {
    num += Math.floor(Math.random() * 10);
  }
  return num;
}