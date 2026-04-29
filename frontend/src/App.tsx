import { useSimulation } from "./hooks/useSimulation";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import MetricsGrid from "./components/dashboard/MetricsGrid";
import LocalTraining from "./components/dashboard/LocalTraining";
import MiddleSection from "./components/dashboard/MiddleSection";
import LogStream from "./components/dashboard/LogStream";
import LiveExplainer from "./components/dashboard/LiveExplainer";

export default function App() {
  const sim = useSimulation();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Header onReset={sim.reset} />

      <div className="flex flex-1 overflow-hidden p-6 gap-6 max-w-[1600px] mx-auto w-full">
        <Sidebar
          round={sim.round}
          isPlaying={sim.isPlaying}
          togglePlay={sim.togglePlay}
          jumpToRound={sim.jumpToRound}
        />

        <main className="flex-1 flex flex-col gap-6 overflow-y-auto">
          <MetricsGrid round={sim.round} currentData={sim.currentData} />

          <LiveExplainer round={sim.round} isPlaying={sim.isPlaying} />

          <MiddleSection
            round={sim.round}
            currentData={sim.currentData}
            chartData={sim.chartData}
          />

          <LocalTraining round={sim.round} currentData={sim.currentData} />

          <LogStream logs={sim.logs} />
        </main>
      </div>
    </div>
  );
}
