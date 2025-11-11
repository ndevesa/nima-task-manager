import React from "react";
import AuthForm from "./AuthForm";
import LoadingScreen from "./LoadingScreen";
import { useAuth } from "../context/AuthContext";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../lib/supabaseClient";

import { FlickeringGrid } from "@/components/ui/flickering-background";
import { BubbleBackground } from "@/components/ui/bubble-background";

function Login() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  const colors = {
    second: "221,74,255", // RGB like ""
    third: "0,220,255", // RGB like ""
    fourth: "200,50,50", // RGB like ""
    fifth: "180,180,50", // RGB like ""
    sixth: "140,100,255", // RGB like ""
  };

  if (!user)
    return (
      <div
        className="flex items-center justify-center h-screen p-4"
        /* style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover" }} */
      >
        <BubbleBackground
          interactive={true}
          className="absolute inset-0"
          colors={colors}
          /*  squareSize={4}
          gridGap={6}
          flickerChance={0.3}
          color="rgb(100, 100, 100)"
          maxOpacity={0.2} */
        />
        <div className="rounded-2xl shadow-xl bg-gray backdrop-blur-lg border border-white/20 w-full text-center text-white max-w-md py-5 px-4 md:py-[40px]">
          <img
            src="/nima-white.svg"
            className="mx-auto mb-3"
            alt="NIMA logo"
            title="NIMA logo"
          />
          <p className=" mb-4 text-sm">
            Iniciá sesión para guardar tus tableros y sincronizar tus tareas.
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
