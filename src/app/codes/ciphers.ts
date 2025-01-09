import crypto, { enc } from "crypto-js";

// Caesar Cipher: Encrypts and decrypts text using a simple letter shift
export const caesarCipher = {
	// Encrypts the given text using the Caesar Cipher with a specified shift
	encrypt: (text: string, shift: number) => {
		return text
			.split("") // Split the text into characters
			.map(
				(char) =>
					char.match(/[a-z]/i) // If the character is a letter
						? String.fromCharCode(
								((char.charCodeAt(0) - (char <= "Z" ? 65 : 97) + shift) % 26) +
									(char <= "Z" ? 65 : 97)
						  ) // Shift and wrap within 'A-Z' or 'a-z'
						: char // If not a letter, leave the character unchanged
			)
			.join(""); // Join the characters back into a string
	},

	// Decrypts the given text using the Caesar Cipher by reversing the shift
	decrypt: (text: string, shift: number) => {
		return caesarCipher.encrypt(text, 26 - (shift % 26)); // Reverse the shift
	},
};

// Vigenère Cipher: Encrypts and decrypts text using a keyword-based shift
export const vigenereCipher = {
	// Encrypts text using the Vigenère Cipher with the given key
	encrypt: (text: string, key: string) => {
		const cleanMessage = text.toUpperCase().replace(/[^A-Z]/g, ""); // Clean the input text
		const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, ""); // Clean the key

		if (!cleanKey) {
			throw new Error("Key must contain at least one letter");
		}

		let result = "";
		const extendedKey = cleanKey
			.repeat(Math.ceil(cleanMessage.length / cleanKey.length))
			.slice(0, cleanMessage.length); // Extend the key to match the message length

		for (let i = 0; i < cleanMessage.length; i++) {
			const messageChar = cleanMessage.charCodeAt(i) - 65; // Shift to 0-based index (A = 0, B = 1, ...)
			const keyChar = extendedKey.charCodeAt(i) - 65;
			const encryptedChar = (messageChar + keyChar) % 26; // Apply Vigenère shift
			result += String.fromCharCode(encryptedChar + 65); // Convert back to character
		}

		return result;
	},

	// Decrypts text using the Vigenère Cipher with the given key
	decrypt: (text: string, key: string) => {
		const cleanCiphertext = text.toUpperCase().replace(/[^A-Z]/g, ""); // Clean the input ciphertext
		const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, ""); // Clean the key

		if (!cleanKey) {
			throw new Error("Key must contain at least one letter");
		}

		let result = "";
		const extendedKey = cleanKey
			.repeat(Math.ceil(cleanCiphertext.length / cleanKey.length))
			.slice(0, cleanCiphertext.length); // Extend the key to match the ciphertext length

		for (let i = 0; i < cleanCiphertext.length; i++) {
			const cipherChar = cleanCiphertext.charCodeAt(i) - 65; // Shift to 0-based index (A = 0, B = 1, ...)
			const keyChar = extendedKey.charCodeAt(i) - 65;
			const decryptedChar = (cipherChar - keyChar + 26) % 26; // Reverse the Vigenère shift
			result += String.fromCharCode(decryptedChar + 65); // Convert back to character
		}

		return result;
	},
};

// Playfair Cipher: Encrypts and decrypts text using a digraph-based substitution system
export const playfairCipher = {
	// Creates the Playfair table based on a given key
	createTable: (key: string) => {
		const table: string[] = [];
		const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ"; // Alphabet excluding 'J' (replaced by 'I')
		key = key
			.toUpperCase()
			.replace(/[^A-Z]/g, "")
			.replace(/J/g, "I")
			.split("")
			.join(""); // Clean the key and replace 'J' with 'I'
		const used = new Set();

		// Add characters from the key to the table, ensuring no duplicates
		for (const char of key) {
			if (!used.has(char)) {
				used.add(char);
				table.push(char);
			}
		}

		// Fill in the rest of the table with unused alphabet letters
		for (const char of alphabet) {
			if (!used.has(char)) {
				used.add(char);
				table.push(char);
			}
		}

		return table;
	},

	// Encrypts text using the Playfair Cipher with the given key
	encrypt: (text: string, key: string) => {
		const table = playfairCipher.createTable(key); // Generate the Playfair table
		text = text
			.toUpperCase()
			.replace(/[^A-Z]/g, "")
			.replace(/J/g, "I"); // Clean the text
		const splitText: string[] = text.match(/.{1,2}/g) || []; // Split text into digraphs

		// Handle cases where there are repeated letters or an odd-length final digraph
		if (splitText[splitText.length - 1].length === 1) {
			splitText[splitText.length - 1] += "X";
		}

		// Fix repeated letters within a digraph (replace with 'X')
		for (let i = 0; i < splitText.length; i++) {
			if (splitText[i][0] === splitText[i][1]) {
				splitText[i] = splitText[i][0] + "X";
				if (i === splitText.length - 1) {
					splitText.push(text[text.length - 1] + "X");
				} else {
					splitText.splice(
						i + 1,
						0,
						text[i * 2 + 1] + (i * 2 + 2 < text.length ? text[i * 2 + 2] : "X")
					);
				}
			}
		}

		let result = "";
		// Encrypt each pair of characters based on their positions in the Playfair table
		for (const pair of splitText) {
			const a = pair[0];
			const b = pair[1];
			const rowA = Math.floor(table.indexOf(a) / 5);
			const colA = table.indexOf(a) % 5;
			const rowB = Math.floor(table.indexOf(b) / 5);
			const colB = table.indexOf(b) % 5;

			if (rowA === rowB) {
				result += table[rowA * 5 + ((colA + 1) % 5)];
				result += table[rowB * 5 + ((colB + 1) % 5)];
			} else if (colA === colB) {
				result += table[((rowA + 1) % 5) * 5 + colA];
				result += table[((rowB + 1) % 5) * 5 + colB];
			} else {
				result += table[rowA * 5 + colB];
				result += table[rowB * 5 + colA];
			}
		}

		return { encrypted: result, matrix: table, splitPlaintext: splitText };
	},

	// Decrypts text using the Playfair Cipher with the given key
	decrypt: (text: string, key: string) => {
		const table = playfairCipher.createTable(key); // Generate the Playfair table
		text = text.toUpperCase().replace(/[^A-Z]/g, ""); // Clean the text
		const splitText = text.match(/.{1,2}/g) || [];
		let result = "";

		// Decrypt each pair of characters based on their positions in the Playfair table
		for (const pair of splitText) {
			const a = pair[0];
			const b = pair[1];
			const rowA = Math.floor(table.indexOf(a) / 5);
			const colA = table.indexOf(a) % 5;
			const rowB = Math.floor(table.indexOf(b) / 5);
			const colB = table.indexOf(b) % 5;

			if (rowA === rowB) {
				result += table[rowA * 5 + ((colA - 1 + 5) % 5)];
				result += table[rowB * 5 + ((colB - 1 + 5) % 5)];
			} else if (colA === colB) {
				result += table[((rowA - 1 + 5) % 5) * 5 + colA];
				result += table[((rowB - 1 + 5) % 5) * 5 + colB];
			} else {
				result += table[rowA * 5 + colB];
				result += table[rowB * 5 + colA];
			}
		}

		return { decrypted: result, matrix: table };
	},
};

// AES Cipher (Using CryptoJS): Encrypts and decrypts text using AES algorithm
export const aesCipher = {
	// Encrypts text using AES encryption with the given key
	encrypt: (text: string, key: string) => {
		return crypto.AES.encrypt(text, key).toString(); // Return encrypted text as a string
	},

	// Decrypts text using AES encryption with the given key
	decrypt: (text: string, key: string) => {
		return crypto.AES.decrypt(text, key).toString(crypto.enc.Utf8); // Return decrypted text as a string
	},
};

// Columnar Transposition Cipher: Encrypts and decrypts text using a grid-based transposition
export const columnarCipher = {
	// Encrypts text using a columnar transposition cipher with the given key
	encrypt: (text: string, key: string) => {
		const columns = key.length;

		text = text.replace(/ /g, "_"); // Replace spaces with underscores
		const rows = Math.ceil(text.length / columns); // Calculate rows required for the grid
		const grid: string[][] = Array.from({ length: rows }, () =>
			Array(columns).fill("_")
		);
		const keyOrder = key
			.split("")
			.map((k, i) => ({ k, i }))
			.sort((a, b) => a.k.localeCompare(b.k))
			.map(({ i }) => i);

		const orderNumber = text.split("").map((char) => {
			return text.split("").slice().sort().indexOf(char) + 1;
		});

    console.log('keyOrder :>> ', keyOrder);


		// Fill the grid with text
		for (let i = 0; i < text.length; i++) {
			grid[Math.floor(i / columns)][i % columns] = text[i];
		}

		// Encrypt by reading column-wise based on sorted key
		const encrypted = keyOrder
			.map((i) => grid.map((row) => row[i]).join(""))
			.join("");

		return { encrypted, grid, keyOrder: orderNumber, key };
	},

	// Decrypts text using a columnar transposition cipher with the given key
	decrypt: (encrypted: string, key: string) => {
		let newEncrypted = encrypted;
		const columns = key.length;

		if (encrypted.replace(/_+$/, "").length % key.length === 0) {
			newEncrypted = encrypted.slice(0, encrypted.replace(/_+$/, "").length);
		}
		const rows = Math.ceil(newEncrypted.length / columns);
		const grid: string[][] = Array.from({ length: rows }, () =>
			Array(columns).fill("_")
		);
		const keyOrder = key
			.split("")
			.map((k, i) => ({ k, i }))
			.sort((a, b) => a.k.localeCompare(b.k))
			.map(({ i }) => i);

      console.log('keyOrder :>> ', keyOrder);

		// Fill the grid column-wise based on sorted key
		let index = 0;
		for (const i of keyOrder) {
			for (let row = 0; row < rows; row++) {
				if (index < newEncrypted.length) {
					grid[row][i] = newEncrypted[index++];
				}
			}
		}

		// Decrypt by reading row-wise
		const decrypted = grid.map((row) => row.join("")).join("");
		const plainText = decrypted.replace(/_+$/, "").replace(/_/g, " "); // Restore spaces

		return { decrypted, grid, keyOrder, key, plainText };
	},
};

// Double Columnar Transposition Cipher: Encrypts and decrypts text using two columnar transpositions
export const doubleColumnarCipher = {
	// Encrypts text using two columnar transpositions with the given keys
	encrypt: (text: string, key1: string, key2: string) => {
		const firstEncryption = columnarCipher.encrypt(text, key1);
		const secondEncryption = columnarCipher.encrypt(
			firstEncryption.encrypted,
			key2
		);
		return {
			encrypted: secondEncryption.encrypted,
			firstGrid: firstEncryption.grid,
			secondGrid: secondEncryption.grid,
			firstKey: firstEncryption.key,
			secondKey: secondEncryption.key,
			firstKeyOrder: firstEncryption.keyOrder,
			secondKeyOrder: secondEncryption.keyOrder,
			intermediateText: firstEncryption.encrypted,
		};
	},

	// Decrypts text using two columnar transpositions with the given keys
	decrypt: (encrypted: string, key1: string, key2: string) => {
		const firstDecryption = columnarCipher.decrypt(encrypted, key2);
		// const secondDecryption = columnarCipher.decrypt("HAEE__ILY_K_DLS_", key1);
		const secondDecryption = columnarCipher.decrypt(
			firstDecryption.decrypted,
			key1
		);
		return {
			plainText: secondDecryption.plainText,
			decrypted: secondDecryption.decrypted,
			firstGrid: firstDecryption.grid,
			secondGrid: secondDecryption.grid,
			firstKey: firstDecryption.key,
			secondKey: secondDecryption.key,
			firstKeyOrder: firstDecryption.keyOrder,
			secondKeyOrder: secondDecryption.keyOrder,
			intermediateText: firstDecryption.decrypted,
		};
	},
};
