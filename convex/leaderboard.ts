import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("leaderboard").collect();
  },
});

export const createScore = mutation({
  args: { name: v.string(), score: v.number() },
  handler: async (ctx, args) => {
    await ctx.db.insert("leaderboard", args);
  },
});
