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
import Image from "next/image";
import Confetti from "react-confetti";
import { shuffle } from "radash";
import clsx from "clsx";
import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import quizData from "../../mock/ad_data01.json";
// Mock data for the quiz
// const quizData = [
//   {
//     id: 1,
//     image: [
//       "https://img.leboncoin.fr/api/v1/lbcpb1/images/23/fc/25/23fc25127da2be27ffd62207870059c54f83ffc4.jpg?rule=ad-large",
//       "https://img.leboncoin.fr/api/v1/lbcpb1/images/0d/a0/9b/0da09baf914b9a9841208023999429a9683c9a40.jpg?rule=ad-large",
//       "https://img.leboncoin.fr/api/v1/lbcpb1/images/15/83/62/15836232501a2b6265dbf71f7fdd0ce766a1048d.jpg?rule=ad-large",
//       "https://img.leboncoin.fr/api/v1/lbcpb1/images/3a/d0/5d/3ad05d8b1b97370dcf53a6c14e03a11a6fe02a12.jpg?rule=ad-large",
//     ],
//     price: 600,
//   },
//   {
//     id: 2,
//     image: ["/placeholder.svg?height=400&width=600"],
//     price: 1030,
//   },
//   {
//     id: 3,
//     image: ["/placeholder.svg?height=400&width=600"],
//     price: 920,
//   },
//   {
//     id: 4,
//     image: ["/placeholder.svg?height=400&width=600"],
//     price: 450,
//   },
//   {
//     id: 5,
//     image: ["/placeholder.svg?height=400&width=600"],
//     price: 2620,
//   },
// ];

export default function Quiz() {
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
  const [showNameForm, toggleNameForm] = useState(true);
  const [shuffledOptions, setShuffledOptions] = useState<number[]>([]);
  const [playerName, setPlayerName] = useState(
    "makanda-" + Date.now().toString().slice(-3),
  );
  const [shuffledData, _] = useState(shuffle(quizData));

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameStarted]);

  const options = useCallback(() => {
    const price = parseInt(shuffledData[currentQuestion].price);
    return shuffle([
      price,
      Math.floor(price + price * 0.2),
      Math.floor(price - price * 0.4),
      Math.floor(price + price * 1.2),
    ]);
  }, [currentQuestion]);

  useEffect(() => {
    setShuffledOptions(options());
  }, [currentQuestion]);

  const handleStartGame = () => {
    setGameStarted(true);
    setShuffledOptions(options());
  };

  const handleAnswerClick = (price: number) => {
    if (gameOver) return;

    setSelectedAnswer(price);
    const correct = price === parseInt(shuffledData[currentQuestion].price);
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

  const handleSubmitName = async (e: React.FormEvent) => {
    e.preventDefault();
    toggleNameForm(false);
    await pushScore({ name: playerName, score });
  };

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const question = useMemo(
    () => shuffledData[currentQuestion],
    [shuffledData, currentQuestion],
  );
  const images = useMemo(
    () => shuffle(question.images).slice(0, 3),
    [question.images],
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
              Tu as <b>1 minute</b> pour deviner le prix du loyer du maximum de
              logements possible !
            </p>
            <Button onClick={handleStartGame} className="w-full">
              C'est parti
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameOver) {
    let board = leaderboard ?? [];
    if (showNameForm) {
      board = [
        ...(leaderboard ?? []),
        { name: playerName, score, isYou: true },
      ];
    }
    return (
      <div className="w-full flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              C'est fini !
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">Ton score: {score} points</p>
            <h3 className="text-xl font-semibold mb-2">Classement</h3>
            <ol className="list-decimal px-6 space-y-2">
              {board
                .sort((a, b) => b.score - a.score)
                .map((player) => (
                  <li key={player._id}>
                    {player?.isYou && showNameForm ? (
                      <form
                        onSubmit={handleSubmitName}
                        className="flex flex-row"
                      >
                        <Input
                          type="text"
                          id="playerName"
                          value={playerName}
                          onChange={(e) => setPlayerName(e.target.value)}
                          placeholder="Ton @pseudo des réseaux"
                          className="w-3/4"
                        />
                        <Button
                          type="submit"
                          className="w-auto ml-auto px-2 py-1 "
                        >
                          Ok
                        </Button>
                      </form>
                    ) : (
                      <span
                        className={clsx(
                          "flex grow justify-between items-baseline",
                          player?.isYou && "font-bold",
                        )}
                      >
                        <span>{player.name}</span>
                        <span className="ml-auto">{player.score} pts</span>
                      </span>
                    )}
                  </li>
                ))}
            </ol>
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.location.reload()} className="w-full">
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
            <div key={index} className="w-full relative">
              <Image
                src={image!}
                alt={question.url}
                fill
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
                  : selectedAnswer < parseInt(question.price)
                    ? "C'est plus."
                    : "C'est moins."
                : "Trouve le prix du loyer"}
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
                          price == parseInt(question.price)
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
