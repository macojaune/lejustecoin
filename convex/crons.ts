import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "dailyTweet",
  { hourUTC: 14, minuteUTC: 10 },
  internal.record.dailyRecap,
);
export default crons;
