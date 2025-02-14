import { Game } from "@/components/game";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <Game />
    </div>
  );
}
