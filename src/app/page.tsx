import { FunFact } from "./_components/fun-fact";
import MemberList from "./_components/member-list";
import { SymmetricCipher } from "./_components/symmetric-cipher";

export default function Home() {
	return (
		<main className="relative z-10">
			<div className="mt-4 space-y-8 p-4">
				<div className="space-y-2">
					<h1 className="text-white font-black text-center text-4xl uppercase">
						Team Padin
					</h1>
					<div className="flex justify-center">
						<MemberList />
					</div>
				</div>
				<div className="grid lg:grid-cols-2 max-w-screen-lg mx-auto gap-4">
					<SymmetricCipher />
					<FunFact />
				</div>
			</div>
		</main>
	);
}
