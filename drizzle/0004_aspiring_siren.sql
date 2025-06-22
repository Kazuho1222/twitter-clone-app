DROP INDEX "Post_name_idx";--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
CREATE INDEX "Post_name_idx" ON "posts" USING btree ("name");