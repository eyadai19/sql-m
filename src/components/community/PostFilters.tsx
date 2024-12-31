"use client";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export function PostFilters() {
	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex flex-wrap gap-2">
				<Button variant="outline" size="sm">
					Today
				</Button>
				<Button variant="outline" size="sm">
					This Week
				</Button>
				<Button variant="outline" size="sm">
					This Month
				</Button>
			</div>
			<Select defaultValue="latest">
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Sort by" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="latest">Latest Posts</SelectItem>
					<SelectItem value="popular">Most Liked</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
