import { relations } from "drizzle-orm";
import {
	boolean,
	customType,
	integer,
	pgTable,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const TB_user = pgTable("user", {
	id: text("id").primaryKey(),
	username: text("username").notNull().unique(),
	password: text("password").notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	photo: text("photo"),
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
	index: serial("index"),
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

export const TB_quiz_questions = pgTable("quiz_questions", {
	id: text("id").primaryKey(),
	quizId: text("quiz_id")
		.notNull()
		.references(() => TB_quiz.id, { onDelete: "cascade" }),
	question: text("question").notNull(),
	answer: text("answer").notNull(),
	score: integer("score").notNull(),
});

export const TB_user_excercise_summary = pgTable("user_excercise_summary", {
	id: text("id").primaryKey(),
	levelId: text("level_id")
		.notNull()
		.references(() => TB_level.id, { onDelete: "cascade" }),
	userId: text("user_id")
		.notNull()
		.references(() => TB_user.id, { onDelete: "cascade" }),
	time: integer("time"),
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

export const TB_posts = pgTable("posts", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => TB_user.id, { onDelete: "cascade" }),
	content: text("content").notNull(),
	photo: text("photo_url"),
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

export const TB_comments = pgTable("comments", {
	id: text("id").primaryKey(),
	postId: text("post_id")
		.notNull()
		.references(() => TB_posts.id, { onDelete: "cascade" }),
	userId: text("user_id")
		.notNull()
		.references(() => TB_user.id, { onDelete: "cascade" }),
	content: text("content").notNull(),
	photo: text("photo_url"),
	createdTime: timestamp("created_time", {
		withTimezone: true,
		mode: "date",
	})
		.notNull()
		.defaultNow(),
});

export const TB_post_likes = pgTable("post_likes", {
	id: text("id").primaryKey(),
	postId: text("post_id")
		.notNull()
		.references(() => TB_posts.id, { onDelete: "cascade" }),
	userId: text("user_id")
		.notNull()
		.references(() => TB_user.id, { onDelete: "cascade" }),
	createdTime: timestamp("created_time", {
		withTimezone: true,
		mode: "date",
	})
		.notNull()
		.defaultNow(),
});

export const TB_comment_likes = pgTable("comment_likes", {
	id: text("id").primaryKey(),
	commentId: text("comment_id")
		.notNull()
		.references(() => TB_comments.id, { onDelete: "cascade" }),
	userId: text("user_id")
		.notNull()
		.references(() => TB_user.id, { onDelete: "cascade" }),
	createdTime: timestamp("created_time", {
		withTimezone: true,
		mode: "date",
	})
		.notNull()
		.defaultNow(),
});

export const RE_comment_likes = relations(TB_comment_likes, ({ one }) => ({
	comment: one(TB_comments, {
		fields: [TB_comment_likes.commentId],
		references: [TB_comments.id],
	}),
	user: one(TB_user, {
		fields: [TB_comment_likes.userId],
		references: [TB_user.id],
	}),
}));

export const RE_post_likes = relations(TB_post_likes, ({ one }) => ({
	post: one(TB_posts, {
		fields: [TB_post_likes.postId],
		references: [TB_posts.id],
	}),
	user: one(TB_user, {
		fields: [TB_post_likes.userId],
		references: [TB_user.id],
	}),
}));

export const RE_posts = relations(TB_posts, ({ many, one }) => ({
	user: one(TB_user, {
		fields: [TB_posts.userId],
		references: [TB_user.id],
	}),
	comments: many(TB_comments),
	likes: many(TB_post_likes),
}));

export const RE_comments = relations(TB_comments, ({ many, one }) => ({
	post: one(TB_posts, {
		fields: [TB_comments.postId],
		references: [TB_posts.id],
	}),
	user: one(TB_user, {
		fields: [TB_comments.userId],
		references: [TB_user.id],
	}),
	likes: many(TB_comment_likes),
}));

export const RE_user = relations(TB_user, ({ many, one }) => ({
	sessions: many(TB_session),
	quizzes: many(TB_quiz),
	exerciseSummaries: many(TB_user_excercise_summary),
	stage: one(TB_stage, {
		fields: [TB_user.stageId],
		references: [TB_stage.id],
	}),
}));

export const RE_session = relations(TB_session, ({ one }) => ({
	user: one(TB_user, {
		fields: [TB_session.userId],
		references: [TB_user.id],
	}),
}));

export const RE_level = relations(TB_level, ({ many, one }) => ({
	stage: one(TB_stage, {
		fields: [TB_level.stageId],
		references: [TB_stage.id],
	}),
	questions: many(TB_question_bank),
	exerciseSummaries: many(TB_user_excercise_summary),
}));

export const RE_stage = relations(TB_stage, ({ many }) => ({
	levels: many(TB_level),
	users: many(TB_user),
	quizzes: many(TB_quiz),
}));

export const RE_quiz = relations(TB_quiz, ({ one, many }) => ({
	user: one(TB_user, {
		fields: [TB_quiz.userId],
		references: [TB_user.id],
	}),
	stage: one(TB_stage, {
		fields: [TB_quiz.stageId],
		references: [TB_stage.id],
	}),
	quizQuestions: many(TB_quiz_questions),
}));

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

export const RE_question_bank = relations(TB_question_bank, ({ one }) => ({
	level: one(TB_level, {
		fields: [TB_question_bank.levelId],
		references: [TB_level.id],
	}),
}));

export const RE_quiz_questions = relations(TB_quiz_questions, ({ one }) => ({
	quiz: one(TB_quiz, {
		fields: [TB_quiz_questions.quizId],
		references: [TB_quiz.id],
	}),
}));
