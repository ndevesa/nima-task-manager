import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Handshake, CheckCircle2, AlertCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabaseClient";

export default function FeedBackDialog({ open, onOpenChange }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    setLoading(true);

    try {
      // 1) Obtener sesión
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user;

      // 2) Guardar feedback
      const { error } = await supabase.from("feedback").insert({
        message,
        user_id: user?.id,
      });

      if (error) throw error;

      // 3) Llamar Edge Function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-feedback-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ message, userId: user?.id }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      // Mostrar éxito
      setShowSuccess(true);
      setMessage("");

      // Cerrar el dialog después de 2 segundos
      setTimeout(() => {
        setShowSuccess(false);
        onOpenChange(false);
      }, 2000);
    } catch (err) {
      console.error("Error enviando feedback:", err);
      // Toast de error más visual
      const errorDiv = document.createElement("div");
      errorDiv.className =
        "fixed top-4 right-4 bg-red-500/90 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-in slide-in-from-top";
      errorDiv.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
        <span>Error al enviar. Intentá de nuevo.</span>
      `;
      document.body.appendChild(errorDiv);
      setTimeout(() => errorDiv.remove(), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0f0f0f] backdrop-blur-2xl border-white/20 text-white/70 max-w-xl">
        {!showSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-white text-xl flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Handshake className="w-6 h-6 text-blue-400" />
                </div>
                Tu mirada ayuda a mejorar NIMA
              </DialogTitle>
              <DialogDescription className="text-white/60 pt-2">
                NIMA crece gracias a vos. Si encontraste un bug, algo falló o
                tenés una idea para mejorarlo, dejame tu comentario.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <Textarea
                placeholder="Escribí tu comentario acá..."
                className="min-h-32 bg-black/30 border-white/10 text-white placeholder:text-white/40 focus:border-blue-500/50 focus:ring-blue-500/20 resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                autoFocus
              />
            </div>

            <DialogFooter className="mt-6 gap-2">
              <Button
                variant="ghost"
                className="text-white/60 hover:text-white hover:bg-white/5"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white gap-2 min-w-[120px]"
                disabled={loading || !message.trim()}
                onClick={handleSend}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
              <CheckCircle2 className="w-20 h-20 text-green-400 relative animate-in zoom-in duration-300" />
            </div>
            <h3 className="text-white text-xl font-medium mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              ¡Recibido!
            </h3>
            <p className="text-white/60 mt-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
              Gracias por ayudarme a mejorar NIMA
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
