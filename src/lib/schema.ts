import { relations } from "drizzle-orm";
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

// تعريف العلاقات لجدول المستخدم (User)
export const RE_user = relations(TB_user, ({ many, one }) => ({
	sessions: many(TB_session),
	quizzes: many(TB_quiz),
	exerciseSummaries: many(TB_user_excercise_summary),
	database: one(TB_user_db, {
		fields: [TB_user.id],
		references: [TB_user_db.userId],
	}),
	stage: one(TB_stage, {
		fields: [TB_user.stageId],
		references: [TB_stage.id],
	}),
}));

// تعريف العلاقات لجدول الجلسة (Session)
export const RE_session = relations(TB_session, ({ one }) => ({
	user: one(TB_user, {
		fields: [TB_session.userId],
		references: [TB_user.id],
	}),
}));

// تعريف العلاقات لجدول المستوى (Level)
export const RE_level = relations(TB_level, ({ many, one }) => ({
	stage: one(TB_stage, {
		fields: [TB_level.stageId],
		references: [TB_stage.id],
	}),
	questions: many(TB_question_bank),
	exerciseSummaries: many(TB_user_excercise_summary),
}));

// تعريف العلاقات لجدول المرحلة (Stage)
export const RE_stage = relations(TB_stage, ({ many }) => ({
	levels: many(TB_level),
	users: many(TB_user),
	quizzes: many(TB_quiz),
}));

// تعريف العلاقات لجدول الكويز (Quiz)
export const RE_quiz = relations(TB_quiz, ({ one }) => ({
	user: one(TB_user, {
		fields: [TB_quiz.userId],
		references: [TB_user.id],
	}),
	stage: one(TB_stage, {
		fields: [TB_quiz.stageId],
		references: [TB_stage.id],
	}),
}));

// تعريف العلاقات لجدول ملخص التمارين للمستخدمين (User Exercise Summary)
export const RE_user_excercise_summary = relations(
	TB_user_excercise_summary,
	({ one }) => ({
		user: one(TB_user, {
			fields: [TB_user_excercise_summary.userId],
			references: [TB_user.id],
		}),
		level: one(TB_level, {
			fields: [TB_user_excercise_summary.levelId],
			references: [TB_level.id],
		}),
	}),
);

// تعريف العلاقات لجدول بنك الأسئلة (Question Bank)
export const RE_question_bank = relations(TB_question_bank, ({ one }) => ({
	level: one(TB_level, {
		fields: [TB_question_bank.levelId],
		references: [TB_level.id],
	}),
}));

// تعريف العلاقات لجدول قواعد بيانات المستخدمين (User Database)
export const RE_user_db = relations(TB_user_db, ({ one }) => ({
	user: one(TB_user, {
		fields: [TB_user_db.userId],
		references: [TB_user.id],
	}),
}));

//dds