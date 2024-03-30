import { relations } from "drizzle-orm";
import {
  pgTable,
  bigserial,
  uniqueIndex,
  varchar,
  uuid,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { tokens } from "./token";

export const statusEnum = pgEnum("status", ["active", "blocked"]);
export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable(
  "users",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }).notNull(),
    password: varchar("password", { length: 256 }).notNull(),
    status: statusEnum("status").default("active"),
    role: roleEnum("role").default("user"),
    key: uuid("uuid1").defaultRandom(),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
  },
  (users) => {
    return {
      emailIndex: uniqueIndex("email_idx").on(users.id, users.email),
    };
  }
);

export const usersRelations = relations(users, ({ many }) => ({
  tokens: many(tokens),
}));
