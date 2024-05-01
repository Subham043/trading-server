import { relations } from "drizzle-orm";
import { pgTable, bigserial, varchar, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user";
import { bigint } from "drizzle-orm/pg-core";
import { registrarMasterBranches } from "./registrar_master_branch";

export const registrarMasters = pgTable("registrar_masters", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  registrar_name: varchar("registrar_name", { length: 256 }).notNull(),
  sebi_regn_id: varchar("sebi_regn_id", { length: 256 }).notNull(),
  createdBy: bigint("createdBy", { mode: "number" }).references(
    () => users.id,
    { onDelete: "cascade" }
  ),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const registrarMastersRelations = relations(
  registrarMasters,
  ({ one, many }) => ({
    creator: one(users, {
      fields: [registrarMasters.createdBy],
      references: [users.id],
    }),
    registrarMasterBranches: many(registrarMasterBranches),
  })
);
