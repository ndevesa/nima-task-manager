import React from "react";
import { LoaderPinwheel } from "lucide-react";

function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col gap-2 items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4 text-white">
        <LoaderPinwheel size={24} className="animate-spin" />
        <p className="font-semibold">Cargando NIMA</p>
      </div>
    </div>
  );
}

export default LoadingScreen;
