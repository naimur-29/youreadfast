"use client";

import React, { useState, useEffect, useRef } from "react";

function getRandomNumber(min = 0, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function Home() {
  // states:
  const [wordsRead, setWordsRead] = useState({
    count: 0,
    time: 0.0,
  });
  const [readingSpeed, setReadingSpeed] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // refs:
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // constants:
  const text = `The sun was shining brightly in the blue sky. Birds were singing, and a gentle breeze moved the trees. People walked around the park, smiling and enjoying the day. A small dog ran after a ball, happily wagging its tail. Children played on the swings, laughing with their friends. The flowers in the garden bloomed in many colors, making the air smell sweet. It was a perfect day to be outside, to relax, and to feel happy. Everyone seemed peaceful and full of joy, enjoying the simple beauty of a sunny day in the park.`;

  const words = text
    .trim()
    .replaceAll("\n", "")
    .split(/\s+/) // Split by whitespace
    .filter(Boolean); // Remove any empty strings

  const totalWordsCount = words.length;

  // event handler functions:
  const handleWordClick = (word: string, index: number) => {
    if (index + 1 === totalWordsCount) {
      setIsRunning(false);
    }

    if (isRunning)
      setReadingSpeed((prev) => {
        const count = index + 1 - wordsRead.count;
        const time = (elapsedTime - wordsRead.time) / 1000 / 60;
        const speed = count / time;

        return Number(((prev + speed) / 2).toFixed(1));
      });
    setWordsRead({ count: index + 1, time: elapsedTime });
  };

  const handleResetBtn = () => {
    setReadingSpeed(0);
    setWordsRead({
      count: 0,
      time: 0.0,
    });
    setStartTime(null);
    setElapsedTime(0);
    setIsRunning(false);
  };

  const handleStartBtn = () => {
    setStartTime(Date.now());
    setIsRunning(true);
  };

  // useEffects:
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isRunning && startTime !== null) {
      intervalId = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, startTime]);

  useEffect(() => {
    let intervalId2: NodeJS.Timeout | null = null;

    const simulateRandomClick = () => {
      const randomIndex = getRandomNumber(0, totalWordsCount);
      const randomWordRef = wordRefs.current[randomIndex];

      if (randomWordRef) {
        randomWordRef.classList.add("bg-[#fff9]");
        setTimeout(() => {
          randomWordRef.classList.remove("bg-[#fff9]");
        }, 1000);
      }
    };

    if (!isRunning) {
      intervalId2 = setInterval(() => {
        simulateRandomClick();
      }, 1000);
    }

    return () => {
      if (intervalId2) clearInterval(intervalId2);
    };
  }, [isRunning, totalWordsCount]);

  return (
    <section className="py-10 w-screen min-h-screen flex flex-col items-center bg-[#fff3] gap-6">
      <p className="flex items-center justify-between text-2xl bg-[#fff3] w-full text-right p-2">
        <span>{(elapsedTime / 1000).toFixed(1)} sec</span>
        <span>{readingSpeed} wpm</span>
      </p>

      <div className="w-full flex items-center gap-2">
        <button
          onClick={() => handleStartBtn()}
          disabled={isRunning}
          className="w-full bg-[#fff3] px-6 py-2 rounded text-2xl font-bold cursor-pointer active:scale-95 active:bg-[#fff7] active:transition-colors duration-100 disabled:opacity-50"
        >
          START
        </button>

        <button
          onClick={() => handleResetBtn()}
          className="w-full bg-[#fff3] px-6 py-2 rounded text-2xl font-bold cursor-pointer active:scale-95 active:bg-[#fff7] active:transition-colors duration-100"
        >
          RESET
        </button>
      </div>

      <article
        className={`bg-[#fff3] p-4 text-justify text-2xl transition-opacity duration-100 opacity-50 blur-sm${
          isRunning ? " opacity-100 blur-none" : ""
        }`}
      >
        {words.map((word, index) => (
          <React.Fragment key={index}>
            <span
              ref={(ele) => {
                wordRefs.current[index] = ele;
              }}
              onClick={() => handleWordClick(word, index)}
              className="rounded active:bg-[#fff9] active:transition-colors duration-1000"
            >
              {word}
            </span>{" "}
          </React.Fragment>
        ))}
      </article>
    </section>
  );
}
