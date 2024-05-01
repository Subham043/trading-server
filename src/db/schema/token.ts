import { pgTable, bigserial, timestamp, text } from "drizzle-orm/pg-core";
import { users } from "./user";
import { relations } from "drizzle-orm";
import { bigint } from "drizzle-orm/pg-core";

export const tokens = pgTable("tokens", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  token: text("token").notNull(),
  userId: bigint("userId", { mode: "number" }).references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const tokensRelations = relations(tokens, ({ one }) => ({
  authToken: one(users, {
    fields: [tokens.userId],
    references: [users.id],
  }),
}));
