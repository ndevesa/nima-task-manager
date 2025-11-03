import React from "react";
import AuthForm from "./AuthForm";
import LoadingScreen from "./LoadingScreen";
import { useAuth } from "../context/AuthContext";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../lib/supabaseClient";
import bg from "../assets/bg4-opt.webp";
import { FlickeringGrid } from "@/components/ui/flickering-background";
import { BubbleBackground } from "@/components/ui/bubble-background";

function Login() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!user)
    return (
      <div
        className="flex items-center justify-center h-screen p-4"
        style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover" }}
      >
        <FlickeringGrid
          className="absolute inset-0"
          squareSize={4}
          gridGap={6}
          flickerChance={0.3}
          color="rgb(100, 100, 100)"
          maxOpacity={0.2}
        />
        <div className="rounded-2xl shadow-xl bg-gray backdrop-blur-lg border border-white/20 w-full text-center text-white max-w-md py-5 px-4 md:py-[40px]">
          <h2 className="text-2xl font-bold mb-2">Bienvenido a NIMA</h2>

          <p className=" mb-4 text-sm">
            Iniciá sesión para guardar tu tablero y sincronizar tus tareas.
          </p>
          <AuthForm
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "#0f0f0f",
                    brandAccent: "#0f0f0f",
                  },
                },
              },
            }}
            theme="light"
          />
        </div>
      </div>
    );
}

export default Login;
