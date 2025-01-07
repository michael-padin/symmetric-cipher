import crypto from "crypto-js"

// Caesar Cipher
export const caesarCipher = {
  encrypt: (text: string, shift: number) => {
    return text
      .split("")
      .map((char) =>
        char.match(/[a-z]/i)
          ? String.fromCharCode(
              ((char.charCodeAt(0) - (char <= "Z" ? 65 : 97) + shift) % 26) +
                (char <= "Z" ? 65 : 97)
            )
          : char
      )
      .join("")
  },
  decrypt: (text: string, shift: number) => {
    return caesarCipher.encrypt(text, 26 - (shift % 26))
  },
}



// Vigenère Cipher
export const vigenereCipher = {
  encrypt: (text: string, key: string) => {
    const cleanMessage = text.toUpperCase().replace(/[^A-Z]/g, '');
    const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
    
    if (!cleanKey) {
        throw new Error("Key must contain at least one letter");
    }
    
    let result = '';
    const extendedKey = cleanKey.repeat(Math.ceil(cleanMessage.length / cleanKey.length))
                                .slice(0, cleanMessage.length);
    
    for (let i = 0; i < cleanMessage.length; i++) {
        const messageChar = cleanMessage.charCodeAt(i) - 65;
        const keyChar = extendedKey.charCodeAt(i) - 65;
        const encryptedChar = (messageChar + keyChar) % 26;
        result += String.fromCharCode(encryptedChar + 65);
    }
    
    return result;
  },
  decrypt: (text: string, key: string) => {
    const cleanCiphertext = text.toUpperCase().replace(/[^A-Z]/g, '');
    const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
    
    if (!cleanKey) {
        throw new Error("Key must contain at least one letter");
    }
    
    let result = '';
    const extendedKey = cleanKey.repeat(Math.ceil(cleanCiphertext.length / cleanKey.length))
                                .slice(0, cleanCiphertext.length);
    
    for (let i = 0; i < cleanCiphertext.length; i++) {
        const cipherChar = cleanCiphertext.charCodeAt(i) - 65;
        const keyChar = extendedKey.charCodeAt(i) - 65;
        const decryptedChar = ((cipherChar - keyChar + 26) % 26);
        result += String.fromCharCode(decryptedChar + 65);
    }
    
    return result;
  },
}

// Playfair Cipher
export const playfairCipher = {
  createTable: (key: string) => {
    const table: string[] = []
    const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ"
    key = key.toUpperCase().replace(/[^A-Z]/g, "").replace(/J/g, "I").split("").join("")
    const used = new Set()
    for (let char of key) {
      if (!used.has(char)) {
        used.add(char)
        table.push(char)
      }
    }
    for (let char of alphabet) {
      if (!used.has(char)) {
        used.add(char)
        table.push(char)
      }
    }
    return table
  },
  encrypt: (text: string, key: string) => {
    const table = playfairCipher.createTable(key)
    text = text.toUpperCase().replace(/[^A-Z]/g, "").replace(/J/g, "I")
    const splitText: string[] = text.match(/.{1,2}/g) || []
    if (splitText[splitText.length - 1].length === 1) {
      splitText[splitText.length - 1] += "X"
    }
    for (let i = 0; i < splitText.length; i++) {
      if (splitText[i][0] === splitText[i][1]) {
        splitText[i] = splitText[i][0] + "X"
        if (i === splitText.length - 1) {
          splitText.push(text[text.length - 1] + "X")
        } else {
          splitText.splice(i + 1, 0, text[i * 2 + 1] + (i * 2 + 2 < text.length ? text[i * 2 + 2] : "X"))
        }
      }
    }
    let result = ""
    for (let pair of splitText) {
      const a = pair[0]
      const b = pair[1]
      const rowA = Math.floor(table.indexOf(a) / 5)
      const colA = table.indexOf(a) % 5
      const rowB = Math.floor(table.indexOf(b) / 5)
      const colB = table.indexOf(b) % 5

      if (rowA === rowB) {
        result += table[rowA * 5 + (colA + 1) % 5]
        result += table[rowB * 5 + (colB + 1) % 5]
      } else if (colA === colB) {
        result += table[((rowA + 1) % 5) * 5 + colA]
        result += table[((rowB + 1) % 5) * 5 + colB]
      } else {
        result += table[rowA * 5 + colB]
        result += table[rowB * 5 + colA]
      }
    }
    return { encrypted: result, matrix: table, splitPlaintext: splitText }
  },
  decrypt: (text: string, key: string) => {
    const table = playfairCipher.createTable(key)
    text = text.toUpperCase().replace(/[^A-Z]/g, "")
    const splitText = text.match(/.{1,2}/g) || []
    let result = ""
    for (let pair of splitText) {
      const a = pair[0]
      const b = pair[1]
      const rowA = Math.floor(table.indexOf(a) / 5)
      const colA = table.indexOf(a) % 5
      const rowB = Math.floor(table.indexOf(b) / 5)
      const colB = table.indexOf(b) % 5

      if (rowA === rowB) {
        result += table[rowA * 5 + (colA - 1 + 5) % 5]
        result += table[rowB * 5 + (colB - 1 + 5) % 5]
      } else if (colA === colB) {
        result += table[((rowA - 1 + 5) % 5) * 5 + colA]
        result += table[((rowB - 1 + 5) % 5) * 5 + colB]
      } else {
        result += table[rowA * 5 + colB]
        result += table[rowB * 5 + colA]
      }
    }
    return { decrypted: result, matrix: table }
  },
}

// AES Cipher (Using CryptoJS)
export const aesCipher = {
  encrypt: (text: string, key: string) => {
    return crypto.AES.encrypt(text, key).toString()
  },
  decrypt: (text: string, key: string) => {
    return crypto.AES.decrypt(text, key).toString(crypto.enc.Utf8)
  },
}

// Columnar Transposition Cipher
export const columnarCipher = {
  encrypt: (text: string, key: string) => {
    const columns = key.length
    const rows = Math.ceil(text.length / columns)
    const grid: string[][] = Array.from({ length: rows }, () => Array(columns).fill("_"))
    const sortedKey = key.split("").map((k, i) => ({ k, i })).sort((a, b) => a.k.localeCompare(b.k))

    // Fill the grid
    for (let i = 0; i < text.length; i++) {
      grid[Math.floor(i / columns)][i % columns] = text[i]
    }

    // Encrypt by reading column-wise based on sorted key
    const encrypted = sortedKey
      .map(({ i }) => grid.map((row) => row[i]).join(""))
      .join("")

    return { encrypted, grid, sortedKey }
  },
  decrypt: (encrypted: string, key: string) => {
    const columns = key.length
    const rows = Math.ceil(encrypted.length / columns)
    const grid: string[][] = Array.from({ length: rows }, () => Array(columns).fill("_"))
    const sortedKey = key.split("").map((k, i) => ({ k, i })).sort((a, b) => a.k.localeCompare(b.k))

    // Fill the grid column-wise based on sorted key
    let index = 0
    for (let { i } of sortedKey) {
      for (let row = 0; row < rows; row++) {
        if (index < encrypted.length) {
          grid[row][i] = encrypted[index++]
        }
      }
    }

    // Decrypt by reading row-wise
    const decrypted = grid.map((row) => row.join("")).join("")

    return { decrypted, grid, sortedKey }
  },
}

// Double Columnar Transposition Cipher
export const doubleColumnarCipher = {
  encrypt: (text: string, key1: string, key2: string) => {
    const firstEncryption = columnarCipher.encrypt(text, key1);
    const secondEncryption = columnarCipher.encrypt(firstEncryption.encrypted, key2);
    return {
      encrypted: secondEncryption.encrypted,
      firstGrid: firstEncryption.grid,
      secondGrid: secondEncryption.grid,
      firstSortedKey: firstEncryption.sortedKey,
      secondSortedKey: secondEncryption.sortedKey,
      intermediateText: firstEncryption.encrypted,
    };
  },
  decrypt: (encrypted: string, key1: string, key2: string) => {
    const firstDecryption = columnarCipher.decrypt(encrypted, key2);
    const secondDecryption = columnarCipher.decrypt(firstDecryption.decrypted, key1);
    return {
      decrypted: secondDecryption.decrypted,
      firstGrid: firstDecryption.grid,
      secondGrid: secondDecryption.grid,
      firstSortedKey: firstDecryption.sortedKey,
      secondSortedKey: secondDecryption.sortedKey,
      intermediateText: firstDecryption.decrypted,
    };
  },
};

