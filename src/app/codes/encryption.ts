import crypto from "crypto";

// Caesar Cipher
export function caesarCipher(
	text: string,
	shift: number,
): string {
	 return text
        .split('')
        .map((char) => {
            if (!char.match(/[a-zA-Z]/)) return char; // Keep non-alphabet characters as is
            const base = char === char.toUpperCase() ? 'A'.charCodeAt(0) : 'a'.charCodeAt(0);
            return String.fromCharCode(
                ((char.charCodeAt(0) - base + shift + 26) % 26) + base // Adjust for negative shifts
            );
        })
        .join('');
}

export function vigenereCipher(
	text: string,
	key: string,
	mode: "encrypt" | "decrypt"
): string {
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let result = "";
	let keyIndex = 0;

	for (let i = 0; i < text.length; i++) {
		const char = text[i].toUpperCase();
		if (alphabet.includes(char)) {
			const charIndex = alphabet.indexOf(char);
			const keyChar = key[keyIndex % key.length].toUpperCase();
			const keyCharIndex = alphabet.indexOf(keyChar);

			let newIndex;
			if (mode === "encrypt") {
				newIndex = (charIndex + keyCharIndex) % 26;
			} else {
				newIndex = (charIndex - keyCharIndex + 26) % 26;
			}

			result += alphabet[newIndex];
			keyIndex++;
		} else {
			result += char;
		}
	}

	return result;
}

export function playfairCipher(
	text: string,
	key: string,
	mode: "encrypt" | "decrypt"
): string {
	const generatePlayfairMatrix = (key: string) => {
		const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
		const matrix: string[] = [];
		const usedChars = new Set();

		for (const char of key.toUpperCase().replace(/J/g, "I")) {
			if (!usedChars.has(char) && alphabet.includes(char)) {
				matrix.push(char);
				usedChars.add(char);
			}
		}

		for (const char of alphabet) {
			if (!usedChars.has(char)) {
				matrix.push(char);
				usedChars.add(char);
			}
		}

		return matrix;
	};

	const findPosition = (matrix: string[], char: string): [number, number] => {
		const index = matrix.indexOf(char);
		return [Math.floor(index / 5), index % 5];
	};

	const matrix = generatePlayfairMatrix(key);
	const pairs: string[][] = [];
	let result = "";

	text = text
		.toUpperCase()
		.replace(/J/g, "I")
		.replace(/[^A-Z]/g, "");
	for (let i = 0; i < text.length; i += 2) {
		if (i === text.length - 1 || text[i] === text[i + 1]) {
			pairs.push([text[i], "X"]);
		} else {
			pairs.push([text[i], text[i + 1]]);
		}
	}

	for (const [a, b] of pairs) {
		let [row1, col1] = findPosition(matrix, a);
		let [row2, col2] = findPosition(matrix, b);

		if (row1 === row2) {
			col1 = mode === "encrypt" ? (col1 + 1) % 5 : (col1 + 4) % 5;
			col2 = mode === "encrypt" ? (col2 + 1) % 5 : (col2 + 4) % 5;
		} else if (col1 === col2) {
			row1 = mode === "encrypt" ? (row1 + 1) % 5 : (row1 + 4) % 5;
			row2 = mode === "encrypt" ? (row2 + 1) % 5 : (row2 + 4) % 5;
		} else {
			[col1, col2] = [col2, col1];
		}

		result += matrix[row1 * 5 + col1] + matrix[row2 * 5 + col2];
	}

	return result;
}

export function singleColumnarTransposition(
	text: string,
	key: string,
	mode: "encrypt" | "decrypt"
): string {
	if (mode === "encrypt") {
		let cipher = "";

		// track key indices
		let k_indx = 0;

		const msg_len = text.length;
		const msg_lst = Array.from(text);
		const key_lst = Array.from(key).sort();

		// calculate column of the matrix
		const col = key.length;

		// calculate maximum row of the matrix
		const row = Math.ceil(msg_len / col);

		// add the padding character '_' in empty
		// the empty cell of the matrix
		const fill_null = row * col - msg_len;
		for (let i = 0; i < fill_null; i++) {
			msg_lst.push("_");
		}

		// create Matrix and insert message and
		// padding characters row-wise
		const matrix = [];
		for (let i = 0; i < msg_lst.length; i += col) {
			matrix.push(msg_lst.slice(i, i + col));
		}

		// read matrix column-wise using key
		for (let _ = 0; _ < col; _++) {
			const curr_idx = key.indexOf(key_lst[k_indx]);
			for (const row of matrix) {
				cipher += row[curr_idx];
			}
			k_indx++;
		}

		return cipher;
	} else {
		// track key indices
		let msg = "";

		// track key indices
		let k_indx = 0;

		// track msg indices
		let msg_indx = 0;
		const msg_len = text.length;
		const msg_lst = Array.from(text);

		// calculate column of the matrix
		const col = key.length;

		// calculate maximum row of the matrix
		const row = Math.ceil(msg_len / col);

		// convert key into list and sort
		// alphabetically so we can access
		// each character by its alphabetical position.
		const key_lst = Array.from(key).sort();

		// create an empty matrix to
		// store deciphered message
		const dec_cipher = [];
		for (let i = 0; i < row; i++) {
			dec_cipher.push(Array(col).fill(null));
		}

		// Arrange the matrix column wise according
		// to permutation order by adding into a new matrix
		for (let _ = 0; _ < col; _++) {
			const curr_idx = key.indexOf(key_lst[k_indx]);

			for (let j = 0; j < row; j++) {
				dec_cipher[j][curr_idx] = msg_lst[msg_indx];
				msg_indx++;
			}
			k_indx++;
		}

		// convert decrypted msg matrix into a string
		try {
			msg = dec_cipher.flat().join("");
		} catch (error) {
			console.log("error :>> ", error);
			throw new Error("This program cannot handle repeating words.");
		}

		const null_count = (msg.match(/_/g) || []).length;

		if (null_count > 0) {
			return msg.slice(0, -null_count);
		}

		return msg;
	}
}

export function doubleColumnarTransposition(
	text: string,
	key1: string,
	key2: string,
	mode: "encrypt" | "decrypt"
): string {
	if (mode === "encrypt") {
		const firstPass = singleColumnarTransposition(text, key1, "encrypt");
		return singleColumnarTransposition(firstPass, key2, "encrypt");
	} else {
		const firstPass = singleColumnarTransposition(text, key2, "decrypt");
		return singleColumnarTransposition(firstPass, key1, "decrypt");
	}
}

export function aes(text: string, key: string, mode: "encrypt" | "decrypt") {
	if (mode === "encrypt") {
		const iv = crypto.randomBytes(16);
		const cipher = crypto.createCipheriv(
			"aes-256-cbc",
			Buffer.from(key.padEnd(32, "0")),
			iv
		);
		let encrypted = cipher.update(text, "utf8", "hex");
		encrypted += cipher.final("hex");
		return iv.toString("hex") + ":" + encrypted;
	} else {
		const textParts = text.split(":");
		const iv = Buffer.from(textParts.shift()!, "hex");
		const encryptedText = Buffer.from(textParts.join(":"), "hex");
		const decipher = crypto.createDecipheriv(
			"aes-256-cbc",
			Buffer.from(key.padEnd(32, "0")),
			iv
		);
		let decrypted = decipher.update(encryptedText);
		decrypted = Buffer.concat([decrypted, decipher.final()]);
		return decrypted.toString();
	}
}
