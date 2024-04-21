import { pgTable, bigserial, timestamp } from "drizzle-orm/pg-core";
import { varchar } from "drizzle-orm/pg-core";

export const pincodes = pgTable("pincodes", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  circle_name: varchar("circle_name", { length: 256 }).notNull(),
  region_name: varchar("region_name", { length: 256 }).notNull(),
  division_name: varchar("division_name", { length: 256 }).notNull(),
  office_name: varchar("office_name", { length: 256 }).notNull(),
  pincode: varchar("pincode", { length: 256 }).notNull(),
  office_type: varchar("office_type", { length: 256 }).notNull(),
  district: varchar("district", { length: 256 }).notNull(),
  state_name: varchar("state_name", { length: 256 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});
