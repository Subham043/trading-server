import { relations } from "drizzle-orm";
import { pgTable, bigserial, varchar, timestamp } from "drizzle-orm/pg-core";
import { companyMasters } from "./company_master";
import { bigint } from "drizzle-orm/pg-core";

export const nameChangeMasters = pgTable("name_change_masters", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  NSE: varchar("NSE", { length: 256 }),
  BSE: varchar("BSE", { length: 256 }),
  previousName: varchar("previous_name", { length: 256 }),
  currentName: varchar("current_name", { length: 256 }),
  dateNameChange: timestamp("date_name_change").defaultNow(),
  companyID: bigint("companyID", { mode: "number" }).references(
    () => companyMasters.id,
    { onDelete: "cascade" }
  ),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const nameChangeMastersRelations = relations(
  nameChangeMasters,
  ({ one }) => ({
    company: one(companyMasters, {
      fields: [nameChangeMasters.companyID],
      references: [companyMasters.id],
    }),
  })
);
