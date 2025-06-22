ALTER TABLE "posts" RENAME COLUMN "name" TO "content";--> statement-breakpoint
DROP INDEX "User_email_idx";--> statement-breakpoint
DROP INDEX "Post_name_idx";--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "handle" text NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "like" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "image" text;--> statement-breakpoint
CREATE INDEX "Post_userId_idx" ON "users" USING btree ("handle");--> statement-breakpoint
CREATE INDEX "Post_name_idx" ON "posts" USING btree ("content");