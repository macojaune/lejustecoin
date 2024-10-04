"use node";
import { sendTweet } from "@/lib/twitter";
import { api, internal } from "./_generated/api";
import { internalAction } from "./_generated/server";

export const updateRecord = internalAction({
  args: {},
  handler: async (ctx, args) => {
    if (process.env.ENV === "development") return;

    let tweet = "";
    // get leaderboard
    const [leaderboard, meta] = await Promise.all([
      ctx.runQuery(api.leaderboard.get),
      ctx.runQuery(internal.leaderboard.getMeta),
    ]);
    const orderedBoard = leaderboard.sort((a, b) => {
      // First, sort by score (descending order)
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // If scores are equal, sort by date (most recent first)
      return (
        new Date(b._creationTime).getTime() -
        new Date(a._creationTime).getTime()
      );
    });
    // compare new high score with old high score
    const highScoreMeta = meta.find((r) => r.name === "highScore");
    if (highScoreMeta) {
      const highScore = parseInt(highScoreMeta.value);
      const newHighScore = orderedBoard[0].score;
      if (newHighScore > highScore) {
        tweet = `🏆 ${orderedBoard[0].name} vient d'exploser le record avec ${newHighScore}points !\n\n`;
        tweet += "Voici le nouveau classement: \n";
        // update meta
        await ctx.runMutation(internal.leaderboard.createMeta, {
          id: highScoreMeta._id,
          value: newHighScore.toString(),
          name: "highScore",
        });

        const newTop3 = orderedBoard.slice(0, 3);
        newTop3.forEach((r, i) => {
          if (i === 0) {
            tweet += "🥇";
          }
          if (i === 1) {
            tweet += "🥇";
          }
          if (i === 2) {
            tweet += "🥇";
          }

          tweet += ` ${r.name} — ${r.score}pts\n`;
        });
        tweet +=
          "\n Viens récupérer ta place ou te faire un nom sur LeJusteCoin : https://lejustecoin.marvinl.com";
        await sendTweet(tweet);
      }
    }
  },
});

export const dailyRecap = internalAction({
  args: {},
  handler: async (ctx, args) => {
    if (process.env.ENV === "development") return;
    let tweet =
      "C'est une nouvelle journée ! Voici le classement du jour :\n\n";
    // get leaderboard
    const leaderboard = await ctx.runQuery(api.leaderboard.get);
    const orderedBoard = leaderboard
      .sort((a, b) => {
        // First, sort by score (descending order)
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        // If scores are equal, sort by date (most recent first)
        return (
          new Date(b._creationTime).getTime() -
          new Date(a._creationTime).getTime()
        );
      })
      .slice(0, 3);
    orderedBoard.forEach((r, i) => {
      if (i === 0) {
        tweet += "🥇";
      }
      if (i === 1) {
        tweet += "🥇";
      }
      if (i === 2) {
        tweet += "🥇";
      }

      tweet += ` ${r.name} — ${r.score}pts\n`;
    });
    tweet +=
      "\n Toi aussi viens tester ton talent sur LeJusteCoin : https://lejustecoin.marvinl.com";
    await sendTweet(tweet);
  },
});
