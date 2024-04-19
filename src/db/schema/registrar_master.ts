import { relations } from "drizzle-orm";
import {
  pgTable,
  bigserial,
  uniqueIndex,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./user";
import { companyMasters } from "./company_master";

export const registrarMasters = pgTable(
  "registrar_masters",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    registrar_name: varchar("registrar_name", { length: 256 }).notNull(),
    sebi_regn_id: varchar("sebi_regn_id", { length: 256 }).notNull(),
    address: varchar("address", { length: 256 }),
    city: varchar("city", { length: 256 }),
    state: varchar("state", { length: 256 }),
    pincode: varchar("pincode", { length: 256 }),
    telephone1: varchar("telephone1", { length: 256 }),
    telephone2: varchar("telephone2", { length: 256 }),
    email: varchar("email", { length: 256 }),
    website: varchar("website", { length: 256 }),
    nameContactPerson: varchar("name_contact_person", { length: 256 }),
    designationContactPerson: varchar("designation_contact_person", {
      length: 256,
    }),
    emailContactPerson: varchar("email_contact_person", { length: 256 }),
    phoneContactPerson: varchar("phone_contact_person", { length: 256 }),
    officerAssigned: varchar("officer_assigned", { length: 256 }),
    branch: varchar("branch", { length: 256 }),
    createdBy: bigserial("createdBy", { mode: "number" })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    companyID: bigserial("companyID", { mode: "number" })
      .notNull()
      .references(() => companyMasters.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
  },
  (registrar_masters) => {
    return {
      companyIndex: uniqueIndex("company_idx").on(
        registrar_masters.id,
        registrar_masters.companyID
      ),
    };
  }
);

export const registrarMastersRelations = relations(
  registrarMasters,
  ({ one }) => ({
    creator: one(users, {
      fields: [registrarMasters.createdBy],
      references: [users.id],
    }),
    company: one(companyMasters, {
      fields: [registrarMasters.companyID],
      references: [companyMasters.id],
    }),
  })
);
