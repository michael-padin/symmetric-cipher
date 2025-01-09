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
	{ name: "Garth Jade Garvez", role: "Programmer", avatar: "GJ" },
	{ name: "Michael Padin", role: "Programmer", avatar: "ML" },
	{ name: "Apple Jane Monic-Buro Caminero", role: "UI/UX", avatar: "AJ" },
	{ name: "Kristin Manila", role: "UI/UX", avatar: "KM" },
	{ name: "Airiz Alcazaren", role: "SCRIPT WRITER & DOCUMENTATION", avatar: "AA" },
	{ name: "Arvilyn Mae Alegado", role: "SCRIPT WRITER & DOCUMENTATION", avatar: "AM" },
	{ name: "James Villamora", role: "SCRIPT WRITER & DOCUMENTATION", avatar: "JV" },
	{ name: "Margie Dayag Alconera", role: "SCRIPT WRITER & DOCUMENTATION", avatar: "MD" },
	{ name: "Gino Carrillo", role: "Video Editor", avatar: "GC" },
	{ name: "James Ryan Cejas", role: "Video Editor", avatar: "JR" },
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
	<div className="flex items-center space-x-4 p-4 border-b last:border-b-0 w-max lg:border-none">
		<Avatar>
			<AvatarImage
				src={`https://api.dicebear.com/6.x/initials/svg?seed=${avatar}`}
				alt={name}
			/>
			<AvatarFallback>{avatar}</AvatarFallback>
		</Avatar>
		<div>
			<h3 className="">{name}</h3>
			<p className="text-sm text-muted-foreground">{role}</p>
		</div>
	</div>
);

const MemberList = () => {
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const content = (
		<ScrollArea className="h-[400px] ">
			<div className="lg:grid lg:grid-cols-2 w-full lg:gap-2">
				{teamMembers.map((member, index) => (
					<MemberCard key={index} {...member} />
				))}
			</div>
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
				<DialogContent className="max-w-screen-md">
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
					<DrawerTitle>Our Team Members</DrawerTitle>
					<DrawerDescription>
					</DrawerDescription>
				</DrawerHeader>
				{content}
				<DrawerFooter>
					<DrawerClose asChild>
						<Button>Close</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};

export default MemberList;
