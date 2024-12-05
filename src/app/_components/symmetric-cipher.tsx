"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	aes,
	caesarCipher,
	doubleColumnarTransposition,
	playfairCipher,
	singleColumnarTransposition,
	vigenereCipher,
} from "../codes/encryption";
import { Textarea } from "@/components/ui/textarea";
import confetti from "canvas-confetti";
import { AlertTriangle, Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function SymmetricCipher() {
	const [cipherType, setCipherType] = useState("caesar");
	const [inputText, setInputText] = useState("");
	const [key, setKey] = useState("");
	const [key2, setKey2] = useState("");
	const [shift, setShift] = useState(3);
	const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
	const [result, setResult] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleCipher = async () => {
		setLoading(true);
		setError("");
		setResult("");

		try {
			if (!inputText) throw new Error("Input text is required");
			if (cipherType !== "caesar" && !key) throw new Error("Key is required");
			if (cipherType === "doubleColumnar" && !key2)
				throw new Error("Second key is required");

			let cipherResult = "";
			switch (cipherType) {
				case "caesar":
					if (mode === "encrypt") {
						cipherResult = caesarCipher(inputText, shift);
					} else {
						cipherResult = caesarCipher(result, shift);

					}
					break;
				case "vigenere":
					cipherResult = vigenereCipher(inputText, key, mode);
					break;
				case "playfair":
					cipherResult = playfairCipher(inputText, key, mode);
					break;
				case "singleColumnar":
					cipherResult = singleColumnarTransposition(inputText, key, mode);
					break;
				case "doubleColumnar":
					cipherResult = doubleColumnarTransposition(
						inputText,
						key,
						key2,
						mode
					);
					break;
				case "aes":
					cipherResult = await aes(inputText, key, mode);
					break;
			}
			setResult(cipherResult);
			confetti({
				particleCount: 100,
				spread: 70,
				origin: { y: 0.6 },
			});
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "An unexpected error occurred"
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card className="w-full max-w-2xl mx-auto ">
			<CardHeader>
				<CardTitle className="text-3xl font-bold text-primary">
					Symmetric Cipher
				</CardTitle>
				<CardDescription>
					Encrypt or decrypt your secret messages
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div>
					<Label htmlFor="method">Encryption Method</Label>
					<Select onValueChange={setCipherType} value={cipherType}>
						<SelectTrigger id="method">
							<SelectValue placeholder="Select encryption method" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="caesar">Caesar Cipher</SelectItem>
							<SelectItem value="vigenere">Vigenère Cipher</SelectItem>
							<SelectItem value="playfair">Playfair Cipher</SelectItem>
							<SelectItem value="singleColumnar">
								Single Columnar Transposition
							</SelectItem>
							<SelectItem value="doubleColumnar">
								Double Columnar Transposition
							</SelectItem>
							<SelectItem value="aes">AES</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div>
					<Label htmlFor="inputText">Your Message</Label>
					<Textarea
						id="inputText"
						value={inputText}
						onChange={(e) => setInputText(e.target.value)}
						placeholder="Enter your secret message here..."
						className="mt-1"
						rows={4}
					/>
				</div>

				{cipherType === "caesar" ? (
					<div>
						<Label htmlFor="shift">Shift (1-25)</Label>
						<Input
							id="shift"
							type="number"
							value={shift}
							onChange={(e) => setShift(parseInt(e.target.value))}
							className="mt-1"
							min={1}
							max={25}
						/>
					</div>
				) : (
					<div>
						<Label htmlFor="key">Secret Key</Label>
						<Input
							id="key"
							value={key}
							onChange={(e) => setKey(e.target.value)}
							placeholder="Enter your secret key"
							className="mt-1"
						/>
					</div>
				)}

				{cipherType === "doubleColumnar" && (
					<div>
						<Label htmlFor="key2">Second Secret Key</Label>
						<Input
							id="key2"
							value={key2}
							onChange={(e) => setKey2(e.target.value)}
							placeholder="Enter your second secret key"
							className="mt-1"
						/>
					</div>
				)}

				<div>
					<Label>What do you want to do?</Label>
					<RadioGroup
						value={mode}
						onValueChange={(value: "encrypt" | "decrypt") => setMode(value)}
						className="flex space-x-4 mt-1"
					>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="encrypt" id="encrypt" />
							<Label htmlFor="encrypt">Encrypt</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="decrypt" id="decrypt" />
							<Label htmlFor="decrypt">Decrypt</Label>
						</div>
					</RadioGroup>
				</div>

				<Button
					onClick={handleCipher}
					className="w-full bg-purple-600 hover:bg-purple-700"
					disabled={loading}
				>
					{loading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Processing...
						</>
					) : (
						<>{mode === "encrypt" ? "Encrypt Message" : "Decrypt Message"}</>
					)}
				</Button>

				{error && (
					<Alert variant="destructive">
						<AlertTriangle className="h-4 w-4" />
						<AlertTitle>Oops!</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				{result && (
					<div>
						<Label htmlFor="result">
							Your {mode === "encrypt" ? "Encrypted" : "Decrypted"} Message
						</Label>
						<Textarea
							id="result"
							value={result}
							readOnly
							className="mt-1"
							rows={4}
						/>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
