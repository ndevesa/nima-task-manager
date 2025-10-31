import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function AuthForm() {
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (isLogin) {
      // LOGIN
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) setMessage(error.message);
    } else {
      // REGISTRO
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullname }, // 👈 Guarda el nombre en user_metadata
        },
      });

      if (error) {
        setMessage(error.message);
      } else {
        // 👇 Crear perfil con fullname en la tabla profiles
        if (data.user) {
          await supabase.from("profiles").insert([
            {
              id: data.user.id,
              fullname: fullname,
              background: null,
            },
          ]);
        }

        setMessage("✅ Revisá tu correo para confirmar la cuenta.");
      }
    }
  };

  return (
    <div className="p-4 bg-white/10 rounded-xl text-center">
      {/* <h2 className="text-xl font-bold mb-4">
        {isLogin ? "Iniciar sesión" : "Registrarse"}
      </h2> */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          className="p-2 rounded bg-white/50"
          type="text"
          placeholder="Nombre Completo"
          value={fullname}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <Input
          className="p-2 rounded bg-white/50"
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          className="p-2 rounded bg-white/50"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">{isLogin ? "Entrar" : "Crear cuenta"}</Button>
      </form>
      <p
        className="mt-2 text-sm cursor-pointer"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin
          ? "¿No tenés cuenta? Registrate"
          : "¿Ya tenés cuenta? Iniciá sesión"}
      </p>
      {message && <p className="text-red-400 mt-2">{message}</p>}
    </div>
  );
}
