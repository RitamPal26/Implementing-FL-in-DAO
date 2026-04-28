import { useState, useEffect } from "react";
import { MOCK_DATA } from "../data/simulationData";

export function useSimulation() {
  const [round, setRound] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "Ready: Choose data and click Run",
  ]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && round < 5) {
      timer = setTimeout(() => {
        setRound((r) => r + 1);
        setLogs((prev) => [
          `Round ${
            round + 1
          } completed. Attacker rejected. Global MSE updated.`,
          ...prev,
        ]);
      }, 2000);
    } else if (round >= 5) {
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
    if (r >= 0 && r <= 5) setRound(r);
  };

  return {
    round,
    isPlaying,
    logs,
    currentData: round > 0 ? MOCK_DATA[round - 1] : null,
    chartData: MOCK_DATA.slice(0, round),
    togglePlay,
    reset,
    jumpToRound,
  };
}
