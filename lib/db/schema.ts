import {
  integer,
  jsonb,
  pgSchema,
  pgTable,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";

const authSchema = pgSchema("auth");
export const authUsers = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

export const accountTable = pgTable("account", {
  userId: uuid("user_id")
    .references(() => authUsers.id)
    .notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const propertyTable = pgTable("property", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  address: text("address").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  rooms: integer("rooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  guests: integer("guests").notNull(),
  services: text("services").array().notNull().default([]),

  userId: uuid("user_id")
    .references(() => authUsers.id)
    .notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const galleryTable = pgTable("gallery", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull(),

  propertyId: uuid("property_id")
    .references(() => propertyTable.id)
    .notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
