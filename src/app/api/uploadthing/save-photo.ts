import { db } from "@/lib/db";
import { TB_user } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method === "POST") {
		const { userId, photoUrl } = req.body;

		if (!userId || !photoUrl) {
			return res
				.status(400)
				.json({ error: "userId and photoUrl are required" });
		}

		try {
			await db
				.update(TB_user)
				.set({ photo: photoUrl })
				.where(eq(TB_user.id, userId));

			res.status(200).json({ message: "Photo URL saved successfully" });
		} catch (error) {
			console.error("Error saving photo URL:", error);
			res.status(500).json({ error: "Failed to save photo URL" });
		}
	} else {
		res.status(405).json({ error: "Method not allowed" });
	}
}
