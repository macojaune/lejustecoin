import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  leaderboard: defineTable({
    name: v.string(),
    score: v.float64(),
  }),
  meta: defineTable({
    name: v.string(),
    value: v.string(),
  }),
});
