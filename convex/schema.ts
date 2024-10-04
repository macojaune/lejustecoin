import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  houses: defineTable({
    desc: v.string(),
    images: v.array(v.string()),
    price: v.string(),
    url: v.string(),
  }),
  leaderboard: defineTable({
    name: v.string(),
    score: v.float64(),
  }),
  meta: defineTable({ value: v.string() }),
});
