import { pgTable, serial, text, integer } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age"),
})

// export const posts = pgTable("posts", {
//   id: serial("id").primaryKey(),
//   body: text("body"),
//   userId: integer("user_id").references(() => users.id),
// })
