import { useState, useEffect } from "react";
import flData from "../results/fl_results.json";

const REAL_DATA = flData.rounds.map((r) => ({
  round: r.round,
  mse: r.global_mse,
  c1: r.scores[0],
  c2: r.scores[1],
  c3: r.scores[2],
  attacker: r.scores[3],
}));

export function useSimulation() {
  const [round, setRound] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "Ready: Choose data and click Run",
  ]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && round < REAL_DATA.length) {
      timer = setTimeout(() => {
        setRound((r) => r + 1);
        setLogs((prev) => [
          `Round ${
            round + 1
          } completed. Attacker rejected. Global MSE updated.`,
          ...prev,
        ]);
      }, 2000);
    } else if (round >= REAL_DATA.length) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, round]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const reset = () => {
    setRound(0);
    setIsPlaying(false);
    setLogs(["Simulation Reset"]);
  };

  const jumpToRound = (r: number) => {
    if (r >= 0 && r <= REAL_DATA.length) setRound(r);
  };

  return {
    round,
    isPlaying,
    logs,
    currentData: round > 0 ? REAL_DATA[round - 1] : null,
    chartData: REAL_DATA.slice(0, round),
    togglePlay,
    reset,
    jumpToRound,
  };
}
