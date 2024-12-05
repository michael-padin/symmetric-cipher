import { FunFact } from "./_components/fun-fact";
import MemberList from "./_components/member-list";
import { MotionDiv } from "./_components/motion-wrapper";
import { SymmetricCipher } from "./_components/symmetric-cipher";

export default function Home() {
	return (
		<main className="relative z-10">
			<div className="mt-4 space-y-8 p-4">
				<div className="space-y-2">
					<MotionDiv initial={{ scale: 0 }} animate={{ scale: 1 }} >
						<h1 className="text-white font-black text-center text-4xl uppercase">
							Team Padin
						</h1>
						<div className="flex justify-center">
							<MemberList />
						</div>
					</MotionDiv>
				</div>
				<div className="grid lg:grid-cols-2 max-w-screen-lg mx-auto gap-4">
					<MotionDiv
						initial={{ opacity: 0, x: -100 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.35 }}
					>
						<SymmetricCipher />
					</MotionDiv>
					<MotionDiv
						initial={{ opacity: 0, x: 100 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.35 }}
					>
						<FunFact />
					</MotionDiv>
				</div>
			</div>
		</main>
	);
}
