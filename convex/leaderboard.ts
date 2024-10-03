import { internal } from "./_generated/api";
import {
  query,
  mutation,
  internalMutation,
  internalQuery,
} from "./_generated/server";
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
    const id = await ctx.db.insert("leaderboard", args);
    await ctx.scheduler.runAfter(0, internal.record.updateRecord);

    return id;
  },
});

export const createMeta = internalMutation({
  args: { id: v.id("meta"), name: v.optional(v.string()), value: v.string() },
  handler: async (ctx, { id, name, value }) => {
    await ctx.db.patch(id, { name, value });
  },
});

export const getMeta = internalQuery({
  handler: async (ctx) => {
    return await ctx.db.query("meta").collect();
  },
});
