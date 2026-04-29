import { useState, useEffect, useMemo } from "react";

import standardData from "../results/fl_results.json";
import poisoningData from "../results/fl_poisoning_results.json";
import sybilData from "../results/fl_sybil_results.json";
import freeridingData from "../results/fl_freeriding_results.json";

const mapData = (rawData: any) =>
  rawData.rounds.map((r: any) => ({
    round: r.round,
    mse: r.global_mse,
    c1: r.scores[0],
    c2: r.scores[1],
    c3: r.scores[2],
    attacker: r.scores[3],
  }));

export type AttackType = "none" | "poisoning" | "sybil" | "freeriding";

export function useSimulation() {
  const [round, setRound] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [attackType, setAttackType] = useState<AttackType>("none");
  const [logs, setLogs] = useState<string[]>([
    "Ready: Choose a threat model and click Run",
  ]);

  const activeDataset = useMemo(() => {
    switch (attackType) {
      case "poisoning":
        return mapData(poisoningData);
      case "sybil":
        return mapData(sybilData);
      case "freeriding":
        return mapData(freeridingData);
      default:
        return mapData(standardData);
    }
  }, [attackType]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && round < activeDataset.length) {
      timer = setTimeout(() => {
        setRound((r) => r + 1);
        setLogs((prev) => [
          `Round ${
            round + 1
          } completed. Aggregation applied based on current threat model.`,
          ...prev,
        ]);
      }, 2000);
    } else if (round >= activeDataset.length) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, round, activeDataset.length]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const reset = () => {
    setRound(0);
    setIsPlaying(false);
    setLogs(["Simulation Reset. Ready to run again."]);
  };

  const jumpToRound = (r: number) => {
    if (r >= 0 && r <= activeDataset.length) setRound(r);
  };

  const handleAttackChange = (type: AttackType) => {
    setAttackType(type);
    setRound(0);
    setIsPlaying(false);
    setLogs([`Threat Model changed to: ${type.toUpperCase()}. Ready to run.`]);
  };

  return {
    round,
    isPlaying,
    logs,
    attackType,
    currentData: round > 0 ? activeDataset[round - 1] : null,
    chartData: activeDataset.slice(0, round),
    togglePlay,
    reset,
    jumpToRound,
    handleAttackChange,
  };
}
