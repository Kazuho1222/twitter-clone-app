CREATE TABLE "likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"postId" integer NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_postId_posts_id_fk" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "Like_postId_idx" ON "likes" USING btree ("postId");--> statement-breakpoint
CREATE INDEX "Like_userId_idx" ON "likes" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "Like_postId_userId_idx" ON "likes" USING btree ("postId","userId");