"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FunFact() {
	return (
		<Card className="w-full max-w-2xl mx-auto ">
			<CardHeader>
				<CardTitle className="text-3xl font-bold text-primary">
					Cipher Fun Facts! 🎉
				</CardTitle>
			</CardHeader>
			<CardContent className="">
				<ul className="list-disc pl-6 space-y-2 text-gray-800">
					<li>
						The word{" "}
						<span className="text-primary font-bold">&quot;cipher&quot;</span>{" "}
						comes from the Arabic word{" "}
						<span className="text-primary font-bold">&quot;sifr&quot;</span>,
						meaning &quot;zero&quot; or &quot;empty&quot;.
					</li>
					<li>
						The Vigenère cipher was once known as{" "}
						<span className="text-primary font-bold">
							&quot;le chiffre indéchiffrable&quot;
						</span>
						(the indecipherable cipher).
					</li>
					<li>
						The Playfair cipher was used by the British in the Boer War and
						World War I.
					</li>
					<li>
						Columnar transposition ciphers were popular during World War II.
					</li>
					<li>
						AES (Advanced Encryption Standard) was established by the U.S.
						National Institute of Standards and Technology (NIST) in 2001.
					</li>
				</ul>
			</CardContent>
		</Card>
	);
}
