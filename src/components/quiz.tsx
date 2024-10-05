"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Confetti from "react-confetti";
import { shuffle } from "radash";
import clsx from "clsx";
import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { ShareButtons } from "./social-share";
import { type Id } from "../../convex/_generated/dataModel";

export default function Quiz() {
  const quizData = useQuery(api.houses.get);
  const leaderboard = useQuery(api.leaderboard.get);
  const pushScore = useMutation(api.leaderboard.createScore);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<number[]>([]);
  const [playerName, setPlayerName] = useState(
    (typeof window !== "undefined" && localStorage.getItem("playerName")) ||
      "@makanda-" + Date.now().toString().slice(-3),
  );
  const [gameId, setGameId] = useState<Id | null>(null);
  const shuffledData = useMemo(
    () => (quizData && shuffle([...quizData])) || [],
    [quizData],
  );
  useEffect(() => {
    let timer: NodeJS.Timeout;
    async function sendScore() {
      const id = await pushScore({ name: playerName, score });
      setGameId(id);
    }
    if (gameStarted && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      sendScore();
      setGameOver(true);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameStarted]);

  const getRandomFactor = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const options = useCallback(() => {
    const price = parseInt(shuffledData?.[currentQuestion]?.price);

    const generateRandomPrice = (baseFactor: number, range: number) => {
      const randomFactor = getRandomFactor(
        baseFactor - range,
        baseFactor + range,
      );
      return Math.floor(price * randomFactor);
    };

    // Generate a larger pool of random prices
    const pricePool = [
      generateRandomPrice(0.5, 0.1), // Much lower
      generateRandomPrice(0.7, 0.1), // Lower
      generateRandomPrice(0.9, 0.05), // Slightly lower
      generateRandomPrice(1.1, 0.05), // Slightly higher
      generateRandomPrice(1.3, 0.1), // Higher
      generateRandomPrice(1.5, 0.1), // Much higher
      generateRandomPrice(0.8, 0.15), // Variable lower
      generateRandomPrice(1.2, 0.15), // Variable higher
      generateRandomPrice(1.0, 0.2), // Around original price
    ];

    // Shuffle the price pool
    const shuffledPool = pricePool.sort(() => Math.random() - 0.5);

    // Select 3 random prices from the pool
    const selectedPrices = shuffledPool.slice(0, 3);

    // Add the correct price
    selectedPrices.push(price);

    // Final shuffle to randomize position of correct price
    return selectedPrices.sort(() => Math.random() - 0.5);
  }, [currentQuestion, shuffledData]);

  useEffect(() => {
    setShuffledOptions(options());
  }, [currentQuestion]);

  const handleStartGame = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShuffledOptions(options());
    // save name to local storage
    localStorage.setItem("playerName", playerName);
    setGameStarted(true);
  };

  const handleAnswerClick = (price: number) => {
    if (gameOver) return;

    setSelectedAnswer(price);
    const correct = price === parseInt(shuffledData?.[currentQuestion]?.price);
    setIsCorrect(correct);
    if (correct) {
      setShowConfetti(true);
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < shuffledData.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setCurrentQuestion(0);
    }
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowConfetti(false);
  };
  const handleReset = () => {
    setShuffledOptions(options());
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowConfetti(false);
    setScore(0);
    setTimeLeft(60);
    setGameId(null);
    setGameOver(false);
    setGameStarted(true);
  };
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const question = useMemo(
    () => shuffledData?.[currentQuestion] ?? null,
    [shuffledData, currentQuestion],
  );
  const images = useMemo(
    () => (question && shuffle(question?.images)?.slice(0, 3)) ?? [],
    [question],
  );

  if (!gameStarted) {
    return (
      <div className="w-full flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center">
              Déroulement du jeu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-8 text-lg">
              Tu as <b>1 minute</b> pour deviner le prix du loyer d&apos;un
              maximum de logements possible !
            </p>
            <form
              onSubmit={handleStartGame}
              className="flex flex-col gap-2 sm:gap-4"
            >
              <div className="w-full text-left">
                <Label htmlFor="playerName" className="font-semibold">
                  Choisis un pseudo
                </Label>
                <Input
                  type="text"
                  id="playerName"
                  defaultValue={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onBlur={(e) => {
                    if (e.target.value === "") {
                      setPlayerName(
                        "@makanda-" + Date.now().toString().slice(-3),
                      );
                    }
                  }}
                  maxLength={15}
                  placeholder="Ton @pseudo des réseaux"
                  className="w-full"
                  required
                />
              </div>
              <Button type="submit" data-umami-event="play" className="w-full">
                C&apos;est parti
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="w-full flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              C&apos;est fini !
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">Ton score: {score} points</p>
            <h3 className="text-xl font-semibold mb-2">Classement</h3>
            <ol className="list-decimal px-6 space-y-2">
              {leaderboard
                ?.sort((a, b) => b.score - a.score)
                ?.map((player) => (
                  <li key={player._id}>
                    <span
                      className={clsx(
                        "flex grow justify-between items-baseline",
                        player?._id === gameId && "font-bold",
                      )}
                    >
                      <span>{player.name}</span>
                      <span className="ml-auto">{player.score} pts</span>
                    </span>
                  </li>
                ))}
            </ol>
          </CardContent>
          <CardFooter className="flex-wrap  justify-center">
            <div className=" flex flex-col gap-2 mb-2">
              <p className="font-semibold">
                Partage tes prouesses avec tes ami·es
              </p>
              <ShareButtons
                url={window.location.href}
                title={`Je viens de faire ${score}points sur le jeu LeJusteCoin, viens tester !`}
              />
            </div>
            <Button onClick={handleReset} className="w-full">
              Rejouer
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  return (
    <div className="w-full absolute bg-white">
      {showConfetti && <Confetti tweenDuration={300} />}
      <div className="w-full relative  h-lvh items-end flex justify-center ">
        <div className="absolute z-0 grid sm:grid-cols-3 h-full w-full">
          {images.map((image, index) => (
            <div key={question?.url + "-" + index} className="w-full relative">
              <Image
                src={image!}
                alt={question?.url}
                placeholder="empty"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px)  33vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <Card className="w-4/5 sm:w-1/4 z-20 mb-4 sm:mb-12 bg-card/90">
          <CardHeader>
            <div className="flex flex-col-reverse gap-4 sm:flex-row justify-between items-center">
              <span>Score: {score}</span>
              <span>Temps restant: {timeLeft}s</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 sm:pt-4">
            <div
              className={`text-center text-lg font-semibold ${isCorrect !== null ? (isCorrect === true ? "text-green-600" : "text-red-600") : "text-black"}`}
            >
              {isCorrect !== null && selectedAnswer !== null
                ? isCorrect
                  ? "C'est juste!"
                  : selectedAnswer < parseInt(question?.price)
                    ? "C'est plus."
                    : "C'est moins."
                : "Trouve le prix du loyer"}{" "}
              {question?.desc !== "" && selectedAnswer === null && (
                <span className="text-sm text-gray-500">{question?.desc}</span>
              )}
              {isCorrect !== null && selectedAnswer !== null ? (
                <a
                  href={"https://leboncoin.fr" + question?.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-orange-02 underline-offset-8 underline"
                >
                  Voir l&apos;annonce →
                </a>
              ) : null}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {shuffledOptions.map((price) => (
                <Button
                  key={price}
                  onClick={() => handleAnswerClick(price)}
                  variant="outline"
                  className={`text-lg py-8 transition-all duration-300 ${
                    selectedAnswer === price
                      ? isCorrect
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "animate-shake bg-red-500 hover:bg-red-600 text-white"
                      : selectedAnswer !== null &&
                          price == parseInt(question?.price)
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : ""
                  }`}
                  disabled={selectedAnswer !== null}
                >
                  {price.toLocaleString()}€
                </Button>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleNextQuestion}
              className="w-full"
              disabled={selectedAnswer === null}
            >
              Suivant
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
