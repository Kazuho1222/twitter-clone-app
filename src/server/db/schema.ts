import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    content: text("content").notNull(),
    handle: text("handle").notNull(),
    like: integer("like").notNull().default(0),
    image: text("image"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => [index("Post_userId_idx").on(table.handle)]
);

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    clerkId: text("clerkId").notNull(),
    email: text("email").notNull(),
    name: text("name").notNull(),
    handle: text("handle").notNull(),
    avatarUrl: text("avatarUrl"),
    bio: text("bio"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => [index("User_email_idx").on(table.email)]
);

export const likes = pgTable(
  "likes",
  {
    id: serial("id").primaryKey(),
    postId: integer("postId")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    userId: text("userId").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    index("Like_postId_idx").on(table.postId),
    index("Like_userId_idx").on(table.userId),
    index("Like_postId_userId_idx").on(table.postId, table.userId),
  ]
);
