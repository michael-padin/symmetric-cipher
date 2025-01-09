import { Metadata } from "next";
import MemberList from "./_components/member-list";
import { SymmetricCipherV2 } from "./_components/symmetric-cipher-v2";

export const metadata: Metadata = {
	title: "Symmetric Cipher",
	description: "Encrypt or decrypt your secret messages",
}

export default function Home() {
	return (
		<main className="relative z-10">
			<div className="p-2 py-4">
				<div className="space-y-2 lg:space-y-4">
					<h1 className="text-white font-black text-center text-4xl uppercase">
						Team Padin
					</h1>
					<div className="flex justify-center">
						<MemberList />
					</div>
				<div className="grid lg w-full mx-auto max-w-screen-sm gap-4">
					<SymmetricCipherV2 />
					{/* <FunFact /> */}
				</div>
				</div>
			</div>
		</main>
	);
}
