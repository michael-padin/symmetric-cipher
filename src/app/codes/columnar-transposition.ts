import React, { useState } from "react";

const columnarTranspositionEncrypt = (
  plaintext: string,
  key: string
): { encrypted: string; grid: string[][] } => {
  const columns = key.length;
  const rows = Math.ceil(plaintext.length / columns);
  const grid: string[][] = Array.from({ length: rows }, () => Array(columns).fill('_'));

  // Fill the grid with plaintext
  for (let i = 0; i < plaintext.length; i++) {
    grid[Math.floor(i / columns)][i % columns] = plaintext[i];
  }

  // Sort columns by key
  const sortedKey = key
    .split('')
    .map((char, index) => ({ char, index }))
    .sort((a, b) => a.char.localeCompare(b.char));
  const columnOrder = sortedKey.map(({ index }) => index);

  // Read columns in sorted order
  let encrypted = '';
  for (const col of columnOrder) {
    for (let row = 0; row < rows; row++) {
      encrypted += grid[row][col];
    }
  }

  return { encrypted, grid };
};

const columnarTranspositionDecrypt = (
  ciphertext: string,
  key: string
): { decrypted: string; grid: string[][] } => {
  const columns = key.length;
  const rows = Math.ceil(ciphertext.length / columns);
  const grid: string[][] = Array.from({ length: rows }, () => Array(columns).fill('_'));

  // Sort columns by key
  const sortedKey = key
    .split('')
    .map((char, index) => ({ char, index }))
    .sort((a, b) => a.char.localeCompare(b.char));
  const columnOrder = sortedKey.map(({ index }) => index);

  // Fill the grid column by column
  let idx = 0;
  for (const col of columnOrder) {
    for (let row = 0; row < rows; row++) {
      if (idx < ciphertext.length) {
        grid[row][col] = ciphertext[idx++];
      }
    }
  }

  // Read the grid row by row
  let decrypted = '';
  for (let row = 0; row < rows; row++) {
    decrypted += grid[row].join('');
  }

  return { decrypted, grid };
};

