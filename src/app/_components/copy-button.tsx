"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CopyButtonProps {
	text: string;
	className?: string;
}

export function CopyButton({ text }: CopyButtonProps) {
	const [isCopied, setIsCopied] = useState(false);

	const copy = async () => {
		await navigator.clipboard.writeText(text);
		setIsCopied(true);
		setTimeout(() => setIsCopied(false), 2000);
	};

	return (
		<Button
			variant="outline"
			size="sm"
			onClick={copy}
			className="text-primary border-primary bg-background  hover:bg-primary/10 hover:text-primary"
			aria-label={isCopied ? "Copied" : "Copy to clipboard"}
		>
			{isCopied ? (
				<>
					<Check className="h-4 w-4 " />
					Copied
				</>
			) : (
				<>
					<Copy className="h-4 w-4 " />
					Copy
				</>
			)}
		</Button>
	);
}
