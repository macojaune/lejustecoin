"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import clsx from "clsx";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";

export default function LeaderboardPage() {
  const board = useQuery(api.leaderboard.get);

  return (
    <div className="contents">
      <Link
        href={"/"}
        className="text-4xl text-orange-02 self-start text-center sm:text-6xl sm:text-left z-20 font-display"
      >
        LeJusteCoin <small className="text-sm text-zinc-600">Guadeloupe</small>
      </Link>
      <div className="w-full flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="">
              <h1 className="text-2xl font-bold text-center">Classement</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal px-6 space-y-2">
              {board
                ?.sort((a, b) => b.score - a.score)
                ?.map((player) => (
                  <li key={player._id}>
                    <span
                      className={clsx(
                        "flex grow justify-between items-baseline",
                      )}
                    >
                      <span>{player.name}</span>
                      <span className="ml-auto">{player.score} pts</span>
                    </span>
                  </li>
                ))}
            </ol>
          </CardContent>
          <CardFooter>
            <Link className="w-full" href={"/"}>
              <Button className="w-full">Clique pour jouer</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
