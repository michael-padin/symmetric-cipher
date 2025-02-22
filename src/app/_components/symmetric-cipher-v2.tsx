"use client";
import { useRef, useState } from "react";
import {
	aesCipher,
	caesarCipher,
	columnarCipher,
	doubleColumnarCipher,
	playfairCipher,
	vigenereCipher,
} from "../codes/ciphers";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CopyButton } from "./copy-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Lock, Trash2, Unlock } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Result {
	operation: "encrypt" | "decrypt";
	encrypted?: string;
	key?: string;
	decrypted?: string;
	matrix?: string[];
	firstKeyOrder?: number[];
	plainText?: string;
	firstKey?: string;
	secondKeyOrder?: number[];
	keyOrder?: number[];
	secondKey?: string;
	firstGrid?: string[][];
	grid?: string[][];
	secondGrid?: string[][];
	splitPlaintext?: string[];
	intermediateText?: string;
}

const defaults = {
	text: "",
	key: "",
	key2: "",
	shift: 3,
	cipherType: "caesar" as CipherType,
};

type CipherType =
	| "caesar"
	| "vigenere"
	| "playfair"
	| "aes"
	| "columnar"
	| "doubleColumnar";

export function SymmetricCipherV2() {
	const resultsContainer = useRef<HTMLDivElement>(null);
	const [text, setText] = useState(defaults.text);
	const [key, setKey] = useState(defaults.key);
	const [key2, setKey2] = useState(defaults.key2);
	const [shift, setShift] = useState(defaults.shift);
	const [cipherType, setCipherType] = useState<CipherType>(defaults.cipherType);
	const [error, setError] = useState("");
	const [output, setOutput] = useState<{
		operation: "encrypt" | "decrypt";
		encrypted?: string;
		key?: string;
		decrypted?: string;
		matrix?: string[];
		firstKeyOrder?: number[];
		plainText?: string;
		firstKey?: string;
		secondKeyOrder?: number[];
		keyOrder?: number[];
		secondKey?: string;
		firstGrid?: string[][];
		grid?: string[][];
		secondGrid?: string[][];
		splitPlaintext?: string[];
		intermediateText?: string;
	} | null>(null);

	const handleResultsContainerScroll = () => {
		if (resultsContainer.current) {
			resultsContainer.current.scrollIntoView({
				behavior: "smooth",
				block: "nearest",
			});
		}
	};

	const handleEncrypt = () => {
		let result: Result = { operation: "encrypt" };
		setError("");
		try {
			if (!text) throw new Error("Input text is required");
			if (cipherType !== "caesar" && !key) throw new Error("Key is required");
			if (cipherType === "doubleColumnar" && !key2)
				throw new Error("Second key is required");
			switch (cipherType) {
				case "caesar":
					result.encrypted = caesarCipher.encrypt(text, shift);
					break;
				case "vigenere":
					result.encrypted = vigenereCipher.encrypt(text, key);
					break;
				case "playfair":
					const playfairResult = playfairCipher.encrypt(text, key);
					result = { ...result, ...playfairResult };
					break;
				case "aes":
					result.encrypted = aesCipher.encrypt(text, key);
					break;
				case "columnar":
					const columnarResult = columnarCipher.encrypt(text, key);
					result = { ...result, ...columnarResult };
					break;
				case "doubleColumnar":
					const doubleColumnarResult = doubleColumnarCipher.encrypt(
						text,
						key,
						key2
					);
					result = { ...result, ...doubleColumnarResult };
					break;
			}
			setOutput(result);
			setTimeout(() => {
				handleResultsContainerScroll();
			}, 100);
		} catch (error) {
			setError(
				error instanceof Error ? error.message : "An unexpected error occurred"
			);
		}
	};

	const handleDecrypt = () => {
		let result: Result = { operation: "decrypt" };
		setError("");
		try {
			if (!text) throw new Error("Input text is required");

			if (cipherType !== "caesar" && !key) throw new Error("Key is required");
			if (cipherType === "doubleColumnar" && !key2)
				throw new Error("Second key is required");
			switch (cipherType) {
				case "caesar":
					result.decrypted = caesarCipher.decrypt(text, shift);
					break;
				case "vigenere":
					result.decrypted = vigenereCipher.decrypt(text, key);
					break;
				case "playfair":
					const playfairResult = playfairCipher.decrypt(text, key);
					result = { ...result, ...playfairResult };
					break;
				case "aes":
					result.decrypted = aesCipher.decrypt(text, key);
					break;
				case "columnar":
					const columnarResult = columnarCipher.decrypt(text, key);
					result = { ...result, ...columnarResult };
					break;
				case "doubleColumnar":
					const doubleColumnarResult = doubleColumnarCipher.decrypt(
						text,
						key,
						key2
					);

					result = { ...result, ...doubleColumnarResult };
					break;
			}

			setOutput(result);
			handleResultsContainerScroll();
		} catch (error) {
			setError(
				error instanceof Error ? error.message : "An unexpected error occurred"
			);
		}
	};

	const renderGrid = (
		grid: string[][],
		key: string,
		keyOrder: number[],
		title: string,
		inputText: string,
		outputText: string
	) => (
		<div className="mt-4 ">
			<h4 className="text-md font-semibold mb-2">{title}</h4>
			<div className="border rounded-lg">
				<Table className="">
					<TableHeader>
						<TableRow>
							{/* {keyOrder.map((order, index) => (
								<TableCell key={`${index}` } className="text-center">
									{order + 1}
								</TableCell>
								
							))} */}
						</TableRow>
					</TableHeader>
					<TableBody className="">
						<TableRow>
							{key.split("").map((k, index) => (
								<TableHead key={index} className="text-center">
									{k}
								</TableHead>
							))}
						</TableRow>
						{grid.map((row, i) => (
							<TableRow key={i}>
								{row.map((cell, j) => (
									<TableCell key={j} className="text-center">
										{cell}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			<p className="mt-2">
				<strong>Output:</strong>
				<br /> {outputText} <CopyButton text={outputText} />
			</p>
		</div>
	);

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle className="text-3xl font-bold text-primary">
						Symmetric Cipher
					</CardTitle>
					<CardDescription>
						Encrypt or decrypt your secret messages
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col">
					<div className="grid gap-4">
						<div className="grid gap-2">
							<Label htmlFor="input-text">Plaint Text or Decrypted Text</Label>
							<Input
								id="input-text"
								value={text}
								onChange={(e) => setText(e.target.value)}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="cipher-type">Cipher Type</Label>
							<Select
								value={cipherType}
								onValueChange={(value: CipherType) => {
									setOutput(null);
									setCipherType(value);
								}}
							>
								<SelectTrigger id="cipher-type">
									<SelectValue placeholder="Select cipher type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="caesar">Caesar Cipher</SelectItem>
									<SelectItem value="vigenere">Vigenère Cipher</SelectItem>
									<SelectItem value="playfair">Playfair Cipher</SelectItem>
									<SelectItem value="columnar">
										Columnar Transposition Cipher
									</SelectItem>
									<SelectItem value="doubleColumnar">
										Double Columnar Transposition Cipher
									</SelectItem>
									<SelectItem value="aes">AES</SelectItem>
								</SelectContent>
							</Select>
						</div>
						{cipherType === "caesar" && (
							<div className="grid gap-2">
								<Label htmlFor="shift">Shift</Label>
								<Input
									id="shift"
									type="number"
									value={shift}
									onChange={(e) => setShift(Number(e.target.value))}
								/>
							</div>
						)}
						{(cipherType === "vigenere" ||
							cipherType === "aes" ||
							cipherType === "playfair" ||
							cipherType === "columnar" ||
							cipherType === "doubleColumnar") && (
							<div className="grid gap-2">
								<Label htmlFor="key">
									Key {cipherType === "doubleColumnar" ? "1" : ""}{" "}
								</Label>
								<Input
									id="key"
									value={key}
									onChange={(e) => setKey(e.target.value)}
								/>
							</div>
						)}
						{cipherType === "doubleColumnar" && (
							<div className="grid gap-2">
								<Label htmlFor="key2">Key 2</Label>
								<Input
									id="key2"
									value={key2}
									onChange={(e) => setKey2(e.target.value)}
								/>
							</div>
						)}
						<div className="flex gap-2 flex-wrap    ">
							<div className="w-full flex gap-2">
								<Button onClick={handleEncrypt} className="flex-1" size={"lg"}>
									<Lock />
									Encrypt
								</Button>
								<Button onClick={handleDecrypt} className="flex-1" size={"lg"}>
									<Unlock />
									Decrypt
								</Button>
							</div>
							<div className="flex w-full">
								<Button
									size={"lg"}
									variant={"secondary"}
									onClick={() => {
										setText(defaults.text);
										setKey(defaults.key);
										setKey2(defaults.key2);
										setShift(defaults.shift);
										setCipherType(defaults.cipherType);
										setError("");
										setOutput(null);
									}}
									className="w-full"
								>
									<Trash2 />
									Reset
								</Button>
							</div>
						</div>
					</div>

					{output && !error && (
						<>
							<Separator className="my-4" />
							<div className="flex flex-col" ref={resultsContainer}>
								<CardTitle className="text-3xl font-bold text-primary mb-1.5">
									Results
								</CardTitle>{" "}
								<div className="flex flex-col flex-wrap overflow-hidden">
									{output.operation === "encrypt" ? (
										<>
											{output.encrypted && (
												<p className="break-all">
													<strong>
														Encrypted Text:
														<br />
													</strong>{" "}
													{output.encrypted}{" "}
													<CopyButton text={output.encrypted} />
												</p>
											)}
											{output.decrypted && (
												<p className="break-all">
													<strong>
														Decrypted Text:
														<br />
													</strong>
													{text} <CopyButton text={output.decrypted} />
												</p>
											)}
										</>
									) : (
										<>
											<div className="space-y-2">
												{output.decrypted && (
													<>
														<p className="break-all">
															<strong>
																Decrypted Text:
																<br />
															</strong>{" "}
															{output.decrypted}{" "}
															<CopyButton text={output.decrypted} />
														</p>
														{output.plainText && (
															<p className="break-all">
																<strong>
																	Plain Text:
																	<br />
																</strong>{" "}
																{output.plainText}{" "}
																<CopyButton text={output.plainText} />
															</p>
														)}
													</>
												)}

												{output.encrypted && (
													<p className="break-all">
														<strong>
															Encrypted Text:
															<br />
														</strong>{" "}
														{output.encrypted}{" "}
														<CopyButton text={output.encrypted} />
													</p>
												)}
											</div>
										</>
									)}
								</div>
								{output.matrix && (
									<div className="mt-4">
										<h4 className="text-md font-semibold mb-2">
											Playfair Matrix:
										</h4>
										<Table>
											<TableBody>
												{Array.from({ length: 5 }, (_, i) => (
													<TableRow key={i}>
														{Array.from({ length: 5 }, (_, j) => (
															<TableCell key={j} className="text-center w-min">
																{output.matrix![i * 5 + j]}
															</TableCell>
														))}
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>
								)}
								{output.splitPlaintext && (
									<div className="mt-4">
										<h4 className="text-md font-semibold mb-2">
											Split Plaintext:
										</h4>
										<p>{output.splitPlaintext.join(" ")}</p>
									</div>
								)}
								{cipherType === "columnar" &&
									output.grid &&
									output.keyOrder &&
									renderGrid(
										output.grid,
										output.key!,
										output.keyOrder,
										"Columnar Transposition Grid",
										output.operation === "encrypt" ? text : output.encrypted!,
										output.operation === "encrypt"
											? output.encrypted!
											: output.decrypted!
									)}
								{cipherType === "doubleColumnar" &&
									output.firstGrid &&
									output.secondGrid &&
									output.firstKeyOrder &&
									output.secondKeyOrder && (
										<div className="space-y-8">
											{renderGrid(
												output.firstGrid!,
												output.firstKey!,
												output.firstKeyOrder,
												output.operation === "encrypt"
													? "First Columnar Transposition Grid"
													: "Second Columnar Transposition Grid",
												output.operation === "encrypt"
													? text
													: output.intermediateText!,
												output.intermediateText!
											)}
											{renderGrid(
												output.secondGrid,
												output.secondKey!,
												output.secondKeyOrder,
												output.operation === "encrypt"
													? "Second Columnar Transposition Grid"
													: "First Columnar Transposition Grid",
												output.intermediateText!,
												output.operation === "encrypt"
													? output.encrypted!
													: output.decrypted!
											)}
										</div>
									)}
							</div>
						</>
					)}
					{error && (
						<div className="mt-8 flex flex-col">
							<Alert variant="destructive">
								<AlertTriangle className="h-4 w-4" />
								<AlertTitle>Oops!</AlertTitle>
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						</div>
					)}
				</CardContent>
			</Card>
		</>
	);
}
