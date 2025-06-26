import { uploadImage } from "@/lib/cloudinary";
import { likes, posts, users } from "@/server/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { j, publicProcedure } from "../jstack";

export const postRouter = j.router({
  all: publicProcedure
    .input(z.object({ userId: z.string().optional() }).optional())
    .query(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const userId = input?.userId;

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

      // ユーザーがログインしている場合、いいね状態を取得
      if (userId) {
        const likesData = await db
          .select({
            postId: likes.postId,
          })
          .from(likes)
          .where(eq(likes.userId, userId));

        const likedPostIds = new Set(likesData.map((like) => like.postId));

        return c.superjson(
          postsData.map((post) => ({
            ...post,
            isLiked: likedPostIds.has(post.id),
          }))
        );
      }

      return c.superjson(
        postsData.map((post) => ({
          ...post,
          isLiked: false,
        }))
      );
    }),

  toggleLike: publicProcedure
    .input(
      z.object({
        postId: z.number(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, c, input }) => {
      const { db } = ctx;
      const { postId, userId } = input;

      // 既存のいいねを確認
      const existingLike = await db
        .select()
        .from(likes)
        .where(and(eq(likes.postId, postId), eq(likes.userId, userId)))
        .limit(1);

      if (existingLike.length > 0) {
        // いいねを削除
        await db
          .delete(likes)
          .where(and(eq(likes.postId, postId), eq(likes.userId, userId)));

        // 投稿のいいね数を減らす
        await db
          .update(posts)
          .set({
            like: sql`${posts.like} - 1`,
          })
          .where(eq(posts.id, postId));

        return c.superjson({ isLiked: false });
      } else {
        // いいねを追加
        await db.insert(likes).values({
          postId,
          userId,
        });

        // 投稿のいいね数を増やす
        await db
          .update(posts)
          .set({
            like: sql`${posts.like} + 1`,
          })
          .where(eq(posts.id, postId));

        return c.superjson({ isLiked: true });
      }
    }),

  create: publicProcedure
    .input(
      z.object({
        content: z.string().min(1),
        handle: z.string(),
        image: z.string().optional(),
        clerkId: z.string(),
        email: z.string(),
        name: z.string(),
        avatarUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, c, input }) => {
      const { content, handle, image, clerkId, email, name, avatarUrl } = input;
      const { db } = ctx;

      // ユーザーが存在するかチェック
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.handle, handle))
        .limit(1);

      if (existingUser.length === 0) {
        // ユーザーが存在しない場合は作成
        await db.insert(users).values({
          clerkId,
          email,
          name: name.trim(),
          handle,
          avatarUrl,
          bio: null,
        });
      }

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
        like: 0,
      });

      return c.superjson(post);
    }),
});
