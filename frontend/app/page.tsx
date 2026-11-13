"use client";

import { useState, useEffect } from "react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [counter, setCounter] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedValue = localStorage.getItem("Counter");

    if (savedValue !== null) {
      const parsedValue = Number(savedValue);

      if (Number.isFinite(parsedValue)) {
        setCounter(parsedValue);
      }
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("Counter", counter.toString());
    }
  }, [counter, hydrated]);

  const increaseCounter = () => {
    setCounter((prev) => prev + 1);
  };

  const decreaseCounter = () => {
    setCounter((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const resetCounter = () => {
    setCounter(0);

    toast.add({
      type: "success",
      description: "Counter reset successfully!!",
    });
  };
  return (
    <div>
      <h1>Jagrut!!</h1>
      <h2>
        Counter: {counter < 0 ? "Negative Counter not possible" : counter}
      </h2>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => increaseCounter()}>Increase By 1</Button>
        <Button onClick={() => decreaseCounter()} disabled={counter === 0}>
          Decrease By 1
        </Button>
        <Button onClick={() => resetCounter()}>Reset</Button>
      </div>
    </div>
  );
}
