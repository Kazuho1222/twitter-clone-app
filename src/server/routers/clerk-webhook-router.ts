import { users } from "@/server/db/schema";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { j, publicProcedure } from "../jstack";

export const clerkWebhookRouter = j.router({
  clerk: publicProcedure.post(async ({ c, ctx }) => {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    const { db } = ctx;

    if (!WEBHOOK_SECRET) {
      throw new Error("CLERK_WEBHOOK_SECRET is not set");
    }

    const payload = await c.req.text();
    const headers = c.req.raw.headers;

    const svixHeaders = {
      "svix-id": headers.get("svix-id") || "",
      "svix-timestamp": headers.get("svix-timestamp") || "",
      "svix-signature": headers.get("svix-signature") || "",
    };

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(payload, svixHeaders) as WebhookEvent;
    } catch (err) {
      console.error("Webhook verification failed", err);
      return c.json({ error: "Webhook verification failed" }, 400);
    }

    const eventType = evt.type;

    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name } = evt.data;
      console.log(`User ${id} was created`);

      try {
        await db.insert(users).values({
          clerkId: id,
          email: email_addresses[0]?.email_address ?? "",
          name: `${first_name || ""} ${last_name || ""}`.trim(),
          avatarUrl: "",
          bio: "",
          handle: email_addresses[0]?.email_address.split("@")[0] ?? "",
        });
        console.log(`User ${id} saved to database successfully`);
      } catch (dbError) {
        console.error("Database error:", dbError);
        return c.json({ error: "Failed to save user to database" }, 500);
      }
    }

    return c.json({ message: "Webhook received successfully" }, 200);
  }),
});
