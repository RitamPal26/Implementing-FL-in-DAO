import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function LogStream({ logs }: { logs: string[] }) {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <CardTitle className="text-sm">DAO Transaction Stream</CardTitle>
        <span className="text-xs text-slate-500">
          Validation, rejection, aggregation
        </span>
      </CardHeader>
      <CardContent className="bg-slate-50 rounded-b-lg font-mono text-sm h-24 overflow-y-auto p-4 flex flex-col-reverse">
        {logs.map((log, i) => (
          <div
            key={i}
            className="py-1 text-slate-700 border-b border-slate-100 last:border-0"
          >
            <span className="text-slate-400 mr-4">
              {new Date().toLocaleTimeString()}
            </span>
            {log}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
