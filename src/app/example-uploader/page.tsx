"use client";

import { UploadButton, UploadDropzone } from "@/utils/uploadthing";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
            <UploadButton
                className="bg-red-500"
				endpoint="imageUploader"
				onClientUploadComplete={(res) => {
					console.log("Files: ", res);
					alert("Upload Completed");
				}}
				onUploadError={(error: Error) => {
					// Do something with the error.
					alert(`ERROR! ${error.message}`);
				}}
			/>
		</main>
	);
}