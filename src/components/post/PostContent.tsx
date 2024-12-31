"use client";
interface PostContentProps {
	title: string;
	content: string;
	photo: string | null;
}

export function PostContent({ title, content, photo }: PostContentProps) {
	return (
		<div className="space-y-4">
			<h3 className="text-xl font-semibold">{title}</h3>
			<p className="whitespace-pre-wrap text-base">{content}</p>
			{photo && (
				<div className="relative aspect-video overflow-hidden rounded-lg">
					<img
						src={photo}
						alt="Post image"
						className="h-full w-full object-cover"
					/>
				</div>
			)}
		</div>
	);
}
