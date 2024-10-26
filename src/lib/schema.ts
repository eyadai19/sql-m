import {
	boolean,
	index,
	integer,
	pgTable,
	text,
	timestamp,
	unique,
	uniqueIndex,
} from "drizzle-orm/pg-core";

export const TB_user = pgTable("user", {
	id: text("id").primaryKey(),
	username: text("username").notNull().unique(),
	password: text("password").notNull(),
	createdTime: timestamp("created_time", {
		withTimezone: true,
		mode: "date",
	})
		.notNull()
		.defaultNow(),
	lastUpdateTime: timestamp("last_update_time", {
		withTimezone: true,
		mode: "date",
	})
		.notNull()
		.defaultNow(),
});

export const TB_session = pgTable("session", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => TB_user.id, { onDelete: "cascade" }),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date",
	}).notNull(),
});