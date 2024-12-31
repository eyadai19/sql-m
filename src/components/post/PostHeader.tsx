"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, Pencil, Trash } from "lucide-react";

interface PostHeaderProps {
	userPhoto: string | null;
	userName: string;
	createdTime: Date; // Changed from string to Date
	canEdit: boolean;
	onEdit: () => void;
	onDelete: () => void;
}

export function PostHeader({
	userPhoto,
	userName,
	createdTime,
	canEdit,
	onEdit,
	onDelete,
}: PostHeaderProps) {
	return (
		<div className="mb-4 flex items-center justify-between gap-4">
			<div className="flex items-center gap-4">
				<Avatar className="h-12 w-12">
					{userPhoto && <AvatarImage src={userPhoto} alt={userName} />}
					<AvatarFallback>{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
				</Avatar>
				<div>
					<h2 className="font-semibold">{userName}</h2>
					<p className="text-sm text-muted-foreground">
						{formatDistanceToNow(createdTime, { addSuffix: true })}
					</p>
				</div>
			</div>

			{canEdit && (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon">
							<MoreVertical className="h-5 w-5" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={onEdit}>
							<Pencil className="mr-2 h-4 w-4" />
							Edit
						</DropdownMenuItem>
						<DropdownMenuItem onClick={onDelete} className="text-red-600">
							<Trash className="mr-2 h-4 w-4" />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</div>
	);
}
