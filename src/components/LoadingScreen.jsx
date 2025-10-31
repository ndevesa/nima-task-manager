import React from "react";
import { Loader } from "lucide-react";

function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col gap-2 items-center justify-center">
      <div className="bg-white p-4 min-w-[200px] rounded-2xl flex flex-col items-center justify-center gap-4">
        <Loader size={48} className="h-8 w-8 animate-spin" />
        <p>Cargando NIMA</p>
      </div>
    </div>
  );
}

export default LoadingScreen;
