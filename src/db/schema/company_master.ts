import { relations } from "drizzle-orm";
import {
  pgTable,
  bigserial,
  uniqueIndex,
  varchar,
  timestamp,
  doublePrecision,
} from "drizzle-orm/pg-core";
import { users } from "./user";
import { nameChangeMasters } from "./name_change_master";
import { registrarMasters } from "./registrar_master";

export const companyMasters = pgTable(
  "company_masters",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    CIN: varchar("CIN", { length: 256 }),
    ISIN: varchar("ISIN", { length: 256 }),
    faceValue: doublePrecision("face_value").default(0.0),
    closingPriceNSE: doublePrecision("closing_price_nse").default(0.0),
    closingPriceBSE: doublePrecision("closing_price_bse").default(0.0),
    registeredOffice: varchar("registered_office", { length: 256 }),
    city: varchar("city", { length: 256 }),
    state: varchar("state", { length: 256 }),
    pincode: varchar("pincode", { length: 256 }),
    telephone: varchar("telephone", { length: 256 }),
    fax: varchar("fax", { length: 256 }),
    email: varchar("email", { length: 256 }),
    website: varchar("website", { length: 256 }),
    nameContactPerson: varchar("name_contact_person", { length: 256 }),
    designationContactPerson: varchar("designation_contact_person", {
      length: 256,
    }),
    emailContactPerson: varchar("email_contact_person", { length: 256 }),
    phoneContactPerson: varchar("phone_contact_person", { length: 256 }),
    createdBy: bigserial("createdBy", { mode: "number" })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
  },
  (company_masters) => {
    return {
      cinIndex: uniqueIndex("cin_idx").on(
        company_masters.id,
        company_masters.CIN
      ),
      isinIndex: uniqueIndex("isin_idx").on(
        company_masters.id,
        company_masters.ISIN
      ),
    };
  }
);

export const companyMastersRelations = relations(
  companyMasters,
  ({ one, many }) => ({
    creator: one(users, {
      fields: [companyMasters.createdBy],
      references: [users.id],
    }),
    companyName: many(nameChangeMasters),
    registrar: one(registrarMasters),
  })
);
