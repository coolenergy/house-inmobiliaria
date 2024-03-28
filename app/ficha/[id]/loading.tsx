import { CircleDashed, Home } from "lucide-react";

export default function DatasheetLoading() {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Generando ficha técnica</h1>
      <div className="relative flex h-20 w-full items-center justify-center">
        <CircleDashed className="absolute h-12 w-12 animate-spin" />
        <Home className="absolute" />
      </div>
    </main>
  );
}
