import { Play, Pause, ChevronRight, ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Sidebar({
  round,
  isPlaying,
  togglePlay,
  jumpToRound,
}: any) {
  return (
    <aside className="w-64 flex flex-col gap-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm">Simulation</CardTitle>
            <span className="text-xs font-bold text-emerald-500">Ready</span>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500">Rounds</p>
            <p className="font-bold text-lg">5</p>
          </div>
          <div>
            <p className="text-slate-500">Clients</p>
            <p className="font-bold text-lg">4</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm">Live Control</CardTitle>
            <span className="text-xs font-bold">{round} / 5</span>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={(round / 5) * 100} className="h-2 mb-4" />
          <div className="flex justify-center gap-2">
            <button
              className="p-2 border rounded"
              onClick={() => jumpToRound(round - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white rounded font-medium"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}{" "}
              {isPlaying ? "Pause" : "Run"}
            </button>
            <button
              className="p-2 border rounded"
              onClick={() => jumpToRound(round + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200 bg-red-50/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-red-600">DAO Rule</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-red-800 font-medium mb-2">
            Score &lt; 10 rejected
          </p>
        </CardContent>
      </Card>
    </aside>
  );
}
