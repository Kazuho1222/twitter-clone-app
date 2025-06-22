import { posts, users } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { j, publicProcedure } from "../jstack";
import { uploadImage } from "@/lib/cloudinary";

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

  create: publicProcedure
    .input(
      z.object({
        content: z.string().min(1),
        handle: z.string(),
        image: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, c, input }) => {
      const { content, handle, image } = input;
      const { db } = ctx;

      let imageUrl = null;
      if (image) {
        try {
          imageUrl = await uploadImage(image);
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }

      const post = await db.insert(posts).values({
        content,
        handle,
        image: imageUrl,
      });

      return c.superjson(post);
    }),
});
