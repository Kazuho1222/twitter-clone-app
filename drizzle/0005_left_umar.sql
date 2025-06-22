DROP INDEX "Post_name_idx";--> statement-breakpoint
DROP INDEX "Post_userId_idx";--> statement-breakpoint
CREATE INDEX "Post_userId_idx" ON "posts" USING btree ("handle");--> statement-breakpoint
CREATE INDEX "User_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "name";