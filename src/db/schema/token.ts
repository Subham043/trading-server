import { pgTable, bigserial, timestamp, text } from "drizzle-orm/pg-core";
import { users } from "./user";
import { relations } from "drizzle-orm";

export const tokens = pgTable("tokens", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  token: text("token").notNull(),
  userId: bigserial("userId", { mode: "number" })
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const tokensRelations = relations(tokens, ({ one }) => ({
  authToken: one(users, {
    fields: [tokens.userId],
    references: [users.id],
  }),
}));
