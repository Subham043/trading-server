import { relations } from "drizzle-orm";
import {
  pgTable,
  bigserial,
  uniqueIndex,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";
import { registrarMasters } from "./registrar_master";
import { bigint } from "drizzle-orm/pg-core";

export const registrarMasterBranches = pgTable(
  "registrar_master_branches",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
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
    registrarMasterID: bigint("registrarMasterID", {
      mode: "number",
    }).references(() => registrarMasters.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
  },
  (registrar_master_branches) => {
    return {
      registrarMasterIndex: uniqueIndex("registrar_master_idx").on(
        registrar_master_branches.id,
        registrar_master_branches.registrarMasterID
      ),
    };
  }
);

export const registrarMasterBranchesRelations = relations(
  registrarMasterBranches,
  ({ one }) => ({
    registrarMaster: one(registrarMasters, {
      fields: [registrarMasterBranches.registrarMasterID],
      references: [registrarMasters.id],
    }),
  })
);
