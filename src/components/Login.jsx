import React from "react";
import AuthForm from "./AuthForm";
import LoadingScreen from "./LoadingScreen";
import { useAuth } from "../context/AuthContext";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../lib/supabaseClient";
import bg from "../assets/bg4-opt.webp";

function Login() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!user)
    return (
      <div
        className="flex items-center justify-center h-screen p-4"
        style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover" }}
      >
        <div className="rounded-2xl shadow-xl bg-white w-full text-center max-w-md pt-4">
          <h2 className="text-2xl font-bold mb-4">Bienvenido a NIMA</h2>

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
