import { relations } from "drizzle-orm";
import { pgTable, bigserial, varchar, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user";
import { text } from "drizzle-orm/pg-core";

export const failedExcels = pgTable("failed_excels", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  file_name: text("file_name").notNull(),
  file_of: varchar("file_of", { length: 256 }).notNull(),
  createdBy: bigserial("createdBy", { mode: "number" })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const failedExcelsRelations = relations(failedExcels, ({ one }) => ({
  creator: one(users, {
    fields: [failedExcels.createdBy],
    references: [users.id],
  }),
}));
