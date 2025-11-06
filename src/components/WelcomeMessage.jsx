import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function WelcomeMessage({ user, data }) {
  const [showWelcome, setShowWelcome] = useState(true);

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0];

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 4000); // 👈 4 segundos visible
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {showWelcome && user && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="absolute left-1/2 top-1/3 transform -translate-x-1/2 text-center px-6 py-5 rounded-xl bg-black/60 backdrop-blur-lg shadow-lg text-white z-50"
        >
          <h2 className="text-xl md:text-2xl font-semibold mb-2">
            ¡Hola, {userName}!
          </h2>
          {data.columnOrder.length === 0 ? (
            <p className="text-white/80">
              Crea tu primera columna para comenzar a usar <b>NIMA</b>
            </p>
          ) : (
            <p className="text-white/60">
              Seguís avanzando — tus tareas están listas
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
