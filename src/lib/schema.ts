import {
	boolean,
	integer,
	json,
	pgTable,
	text,
	timestamp,
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
	stageId: text("stage_id")
		.notNull()
		.references(() => TB_stage.id, { onDelete: "cascade" }),
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

export const TB_level = pgTable("level", {
	id: text("id").primaryKey(),
	level: text("level").notNull().unique(),
	stageId: text("stage_id")
		.notNull()
		.references(() => TB_stage.id, { onDelete: "cascade" }),
});

export const TB_stage = pgTable("stage", {
	id: text("id").primaryKey(),
	stage: text("stage").notNull(),
});

export const TB_quiz = pgTable("quiz", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => TB_user.id, { onDelete: "cascade" }),
	stageId: text("stage_id")
		.notNull()
		.references(() => TB_stage.id, { onDelete: "cascade" }),
	mark: integer("mark"),
});

export const TB_user_excercise_summary = pgTable("user_excercise_summary", {
	id: text("id").primaryKey(),
	levelId: text("level_id")
		.notNull()
		.references(() => TB_level.id, { onDelete: "cascade" }),
	userId: text("user_id")
		.notNull()
		.references(() => TB_user.id, { onDelete: "cascade" }),
	time: timestamp("time", {
		withTimezone: true,
		mode: "date",
	}),
	trials: integer("trials"),
	is_show_ans: boolean("is_show_ans").notNull(),
});

export const TB_question_bank = pgTable("question_bank", {
	id: text("id").primaryKey(),
	levelId: text("level_id")
		.notNull()
		.references(() => TB_level.id, { onDelete: "cascade" }),
	question: text("question").notNull(),
	answer: text("answer").notNull(),
});

export const TB_user_db = pgTable("user_db", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => TB_user.id, { onDelete: "cascade" }),
	db: json("db"),
});
