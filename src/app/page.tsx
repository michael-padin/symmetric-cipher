import { FunFact } from "./_components/fun-fact";
import { MotionDiv } from "./_components/motion-wrapper";
import { SymmetricCipher } from "./_components/symmetric-cipher";

export default function Home() {
	return (
		<main className="relative z-10">
			<div className="mt-4 space-y-8 py-4">
				<h1 className="text-white font-black text-center text-4xl uppercase">
					Team Padin
				</h1>
				<div className="grid grid-cols-2 max-w-screen-lg mx-auto gap-4">
					<MotionDiv
						initial={{ opacity: 0, x: -100 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
					>
						<SymmetricCipher />
					</MotionDiv>
					<MotionDiv
						initial={{ opacity: 0, x: 100 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
					>
						<FunFact />
					</MotionDiv>
				</div>
			</div>
		</main>
	);
}
