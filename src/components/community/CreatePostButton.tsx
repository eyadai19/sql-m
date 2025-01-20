"use client";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Loader2, PenSquare, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function CreatePostButton({
	infoAddPostAction,
	addPostAction,
}: {
	infoAddPostAction: () => Promise<
		| { field: string; message: string }
		| undefined
		| { name: string; photo: string | null }
	>;
	addPostAction: (
		title: string,
		content: string,
		photo: string | null,
	) => Promise<{ field: string; message: string } | undefined>;
}) {
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [photo, setPhoto] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [userInfo, setUserInfo] = useState<{
		name: string;
		photo: string | null;
	}>({
		name: "",
		photo: null,
	});

	const fetchUserInfo = async () => {
		try {
			const result = await infoAddPostAction();
			if (result && "name" in result && "photo" in result) {
				setUserInfo(result);
			} else {
				toast.error("Failed to fetch user info");
			}
		} catch (error) {
			toast.error("An error occurred while fetching user info");
		}
	};

	const handleDialogOpen = (isOpen: boolean) => {
		setOpen(isOpen);
		if (isOpen) {
			fetchUserInfo();
		} else {
			resetForm();
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim() || !content.trim()) {
			toast.error("Please fill in all required fields");
			return;
		}

		setIsSubmitting(true);
		try {
			const result = await addPostAction(title, content, photo);
			if (result?.message === "Post added successfully") {
				toast.success("Post created successfully!");
				setOpen(false);
				resetForm();
			} else {
				toast.error(result?.message || "Failed to create post");
			}
		} catch (error) {
			toast.error("An error occurred while creating the post");
		} finally {
			setIsSubmitting(false);
		}
	};

	const resetForm = () => {
		setTitle("");
		setContent("");
		setPhoto(null);
	};

	const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				toast.error("Image size should be less than 5MB");
				return;
			}

			const reader = new FileReader();
			reader.onloadend = () => {
				setPhoto(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleDialogOpen}>
			<DialogTrigger asChild>
				<Button className="gap-2 bg-[#00203F] hover:bg-[#00203F]/90">
					<PenSquare className="h-4 w-4" />
					Create Post
				</Button>
			</DialogTrigger>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
				<DialogHeader className="space-y-2">
					<DialogTitle>Create a New Post</DialogTitle>
					<DialogDescription>
						Share your thoughts with the community.
					</DialogDescription>
				</DialogHeader>
				<div className="flex items-center gap-4">
					<Avatar className="h-12 w-12">
						{userInfo.photo && (
							<AvatarImage src={userInfo.photo} alt={userInfo.name} />
						)}
						<AvatarFallback>
							{userInfo.name.slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div>
						<h2 className="font-semibold">{userInfo.name}</h2>
					</div>
				</div>
				<form onSubmit={handleSubmit} className="mt-4 space-y-4">
					<div>
						<Label htmlFor="title" className="mb-1.5 block">
							Title
						</Label>
						<Input
							id="title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Enter a descriptive title"
							maxLength={100}
							required
						/>
						<div className="mt-1 text-right text-xs text-gray-500">
							{title.length}/100
						</div>
					</div>

					<div>
						<Label htmlFor="content" className="mb-1.5 block">
							Content
						</Label>
						<Textarea
							id="content"
							value={content}
							onChange={(e) => setContent(e.target.value)}
							placeholder="Share your thoughts..."
							className="min-h-[120px] resize-none"
							maxLength={2000}
							required
						/>
						<div className="mt-1 text-right text-xs text-gray-500">
							{content.length}/2000
						</div>
					</div>

					<div>
						<Label className="mb-1.5 block">Image (Optional)</Label>
						{photo ? (
							<div className="relative">
								<img
									src={photo}
									alt="Post preview"
									className="h-32 w-full rounded-lg object-cover"
								/>
								<Button
									type="button"
									variant="destructive"
									size="icon"
									className="absolute right-2 top-2"
									onClick={() => setPhoto(null)}
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
						) : (
							<label
								htmlFor="image-upload"
								className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
							>
								<ImagePlus className="mb-2 h-6 w-6 text-gray-400" />
								<span className="text-sm text-gray-500">Upload image</span>
								<span className="mt-1 text-xs text-gray-400">Max: 5MB</span>
								<input
									id="image-upload"
									type="file"
									accept="image/*"
									className="hidden"
									onChange={handleImageInput}
								/>
							</label>
						)}
					</div>

					<div className="flex justify-end gap-3 pt-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								setOpen(false);
								resetForm();
							}}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							className="bg-[#00203F] hover:bg-[#00203F]/90"
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creating...
								</>
							) : (
								"Create Post"
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
