import { posts, users } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { j, publicProcedure } from "../jstack";

export const postRouter = j.router({
  all: publicProcedure.query(async ({ c, ctx }) => {
    const { db } = ctx;

    const postsData = await db
      .select({
        id: posts.id,
        content: posts.content,
        handle: posts.handle,
        name: users.name,
        like: posts.like,
        image: posts.image,
        createdAt: posts.createdAt,
        avatarUrl: users.avatarUrl,
      })
      .from(posts)
      .innerJoin(users, eq(users.handle, posts.handle))
      .orderBy(desc(posts.createdAt));
    return c.superjson(postsData);
  }),
});
