"use client";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import { useMediaQuery } from "../hooks/use-media-query";

const teamMembers = [
	{ name: "Apple Jane Monic-Buro Caminero", role: "", avatar: "AJ" },
	{ name: "Airiz Alcazaren", role: "", avatar: "AA" },
	{ name: "Arvilyn Mae Alegado", role: "", avatar: "AM" },
	{ name: "Garth Jade Garvez", role: "", avatar: "GJ" },
	{ name: "Gino Carrillo", role: "", avatar: "GC" },
	{ name: "James Ryan Cejas", role: "", avatar: "JR" },
	{ name: "James Villamora", role: "", avatar: "JV" },
	{ name: "Kristin Manila", role: "", avatar: "KM" },
	{ name: "Margie Dayag Alconera", role: "", avatar: "MD" },
	{ name: "Michael Padin", role: "", avatar: "ML" },
];

const MemberCard = ({
	name,
	role,
	avatar,
}: {
	name: string;
	role: string;
	avatar: string;
}) => (
	<div className="flex items-center space-x-4 p-4 border-b last:border-b-0">
		<Avatar>
			<AvatarImage
				src={`https://api.dicebear.com/6.x/initials/svg?seed=${avatar}`}
				alt={name}
			/>
			<AvatarFallback>{avatar}</AvatarFallback>
		</Avatar>
		<div>
			<h3 className="font-semibold">{name}</h3>
			<p className="text-sm text-gray-500">{role}</p>
		</div>
	</div>
);

const MemberList = () => {
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const content = (
		<ScrollArea className="h-[400px] md:h-[500px]">
			{teamMembers.map((member, index) => (
				<MemberCard key={index} {...member} />
			))}
		</ScrollArea>
	);

	if (isDesktop) {
		return (
			<Dialog>
				<DialogTrigger asChild>
					<Button>
						<Users className="mr-2 h-4 w-4" />
						View Team Members
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Our Team Members</DialogTitle>
						<DialogDescription>
						</DialogDescription>
					</DialogHeader>
					{content}
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button>
					<Users className="mr-2 h-4 w-4" />
					View Team Members
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Cipher Academy Team</DrawerTitle>
					<DrawerDescription>
						Meet the brilliant minds behind our encryption tools.
					</DrawerDescription>
				</DrawerHeader>
				{content}
				<DrawerFooter>
					<DrawerClose asChild>
						<Button variant="outline">Close</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};

export default MemberList;
