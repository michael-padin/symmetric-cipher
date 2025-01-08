
Here's a comprehensive README documentation based on the provided code for the cipher functions:

---

# Symmetric Cipher

This repository contains various cipher algorithms used for text encryption and decryption. The ciphers include Caesar Cipher, Vigenère Cipher, Playfair Cipher, AES (Advanced Encryption Standard) Cipher, Columnar Transposition Cipher, and Double Columnar Transposition Cipher. Each cipher is implemented as an object with `encrypt` and `decrypt` methods.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Ciphers Overview](#ciphers-overview)
   - [Caesar Cipher](#caesar-cipher)
   - [Vigenère Cipher](#vigenère-cipher)
   - [Playfair Cipher](#playfair-cipher)
   - [AES Cipher](#aes-cipher)
   - [Columnar Transposition Cipher](#columnar-transposition-cipher)
   - [Double Columnar Transposition Cipher](#double-columnar-transposition-cipher)
3. [Usage](#usage)
4. [Installation](#installation)
5. [License](#license)

---

## Introduction

This repository provides simple cipher functions that can be used to encrypt and decrypt text. These ciphers are widely used in cryptography and are excellent tools for understanding the basics of encryption. The ciphers in this repository include:

- Caesar Cipher
- Vigenère Cipher
- Playfair Cipher
- AES (Advanced Encryption Standard) Cipher
- Columnar Transposition Cipher
- Double Columnar Transposition Cipher

Each cipher is implemented using JavaScript (with CryptoJS library for AES encryption), and the algorithms are implemented as reusable utility functions.

---

## Ciphers Overview

### Caesar Cipher

The **Caesar Cipher** is one of the simplest encryption techniques. It shifts the letters of the plaintext by a fixed number of positions. The cipher is a substitution cipher, where each letter is substituted by another letter a certain number of positions away.

#### Methods:
- `encrypt(text: string, shift: number): string` — Encrypts the given text using a Caesar shift.
- `decrypt(text: string, shift: number): string` — Decrypts the given text by reversing the Caesar shift.

#### Example:
```typescript
const cipher = caesarCipher.encrypt("HELLO", 3);  // "KHOOR"
```

---

### Vigenère Cipher

The **Vigenère Cipher** is a method of encrypting alphabetic text through the use of a keyword. Each letter of the plaintext is shifted based on the corresponding letter of the key.

#### Methods:
- `encrypt(text: string, key: string): string` — Encrypts the given text using the Vigenère cipher and the provided key.
- `decrypt(text: string, key: string): string` — Decrypts the given text using the Vigenère cipher and the provided key.

#### Example:
```typescript
const cipher = vigenereCipher.encrypt("HELLO", "KEY");  // "RIJVS"
```

---

### Playfair Cipher

The **Playfair Cipher** encrypts digraphs (pairs of letters) using a table of letters. It is based on a 5x5 matrix filled with letters of the alphabet (with 'I' and 'J' sharing a position).

#### Methods:
- `createTable(key: string): string[]` — Creates a Playfair table based on the provided key.
- `encrypt(text: string, key: string): { encrypted: string, matrix: string[], splitPlaintext: string[] }` — Encrypts the given text using the Playfair cipher.
- `decrypt(text: string, key: string): { decrypted: string, matrix: string[] }` — Decrypts the given text using the Playfair cipher.

#### Example:
```typescript
const cipher = playfairCipher.encrypt("HELLO", "KEY"); // { encrypted: "RIJVS", matrix: [ ... ], splitPlaintext: ["HE", "LL", "O"] }
```

---

### AES Cipher (Using CryptoJS)

**AES (Advanced Encryption Standard)** is a symmetric encryption algorithm widely used across industries. This cipher uses a secret key to encrypt and decrypt data.

#### Methods:
- `encrypt(text: string, key: string): string` — Encrypts the given text using AES encryption.
- `decrypt(text: string, key: string): string` — Decrypts the given text using AES encryption.

#### Example:
```typescript
const encrypted = aesCipher.encrypt("HELLO", "my-secret-key"); // "U2FsdGVkX1+T9..."
const decrypted = aesCipher.decrypt(encrypted, "my-secret-key"); // "HELLO"
```

---

### Columnar Transposition Cipher

The **Columnar Transposition Cipher** arranges the text into a grid, and then the text is read column-by-column based on a key's order.

#### Methods:
- `encrypt(text: string, key: string): { encrypted: string, grid: string[][], keyOrder: number[] }` — Encrypts the text based on the columnar transposition cipher.
- `decrypt(text: string, key: string): { decrypted: string, grid: string[][], keyOrder: number[] }` — Decrypts the text based on the columnar transposition cipher.

#### Example:
```typescript
const cipher = columnarCipher.encrypt("HELLO", "KEY"); // { encrypted: "HELO", grid: [ ... ], keyOrder: [1, 2, 3] }
```

---

### Double Columnar Transposition Cipher

The **Double Columnar Transposition Cipher** encrypts the text using two rounds of columnar transposition with two different keys.

#### Methods:
- `encrypt(text: string, key1: string, key2: string): { encrypted: string, firstGrid: string[][], secondGrid: string[][] }` — Encrypts the text using two rounds of columnar transposition.
- `decrypt(text: string, key1: string, key2: string): { decrypted: string, firstGrid: string[][], secondGrid: string[][] }` — Decrypts the text using two rounds of columnar transposition.

#### Example:
```typescript
const cipher = doubleColumnarCipher.encrypt("HELLO", "KEY1", "KEY2"); // { encrypted: "HELO", firstGrid: [ ... ], secondGrid: [ ... ] }
```

---

## Usage

The ciphers can be imported and used as follows:

```typescript
import { caesarCipher, vigenereCipher, playfairCipher, aesCipher, columnarCipher, doubleColumnarCipher } from "./ciphers";

// Example usage:
const caesarEncrypted = caesarCipher.encrypt("HELLO", 3);
const vigenereEncrypted = vigenereCipher.encrypt("HELLO", "KEY");
const aesEncrypted = aesCipher.encrypt("HELLO", "my-secret-key");
```

---

## Installation

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Feel free to customize this documentation further based on any other requirements you might have!


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

