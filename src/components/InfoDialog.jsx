import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function InfoDialog({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0f0f0f] border-white/20 text-white/70">
        <DialogHeader>
          <DialogTitle className="text-white">Acerca de NIMA</DialogTitle>
          <DialogDescription asChild>
            <section className="mt-4 text-white/80 space-y-4">
              <p>
                <strong>NIMA</strong> es una app de gestión de tareas inspirada
                en el estilo de Trello, pensada para organizar tu trabajo y tus
                proyectos de forma ágil y visual.
              </p>

              <p>
                Te permite crear tableros, columnas y tareas, moverlas
                fácilmente y mantener todo sincronizado entre dispositivos.
              </p>

              <p>
                Ideal para uso personal o profesional, NIMA busca simplificar tu
                día a día sin complicaciones.
              </p>

              <section>
                <h3 className="text-white font-semibold mb-2">
                  💾 Almacenamiento y seguridad
                </h3>
                <p>
                  Tus datos se guardan de forma segura y privada. Si iniciás
                  sesión, se sincronizan con la nube para que puedas acceder a
                  ellos desde cualquier lugar.
                </p>
              </section>

              <section>
                <h3 className="text-white font-semibold mb-2">
                  ⚙️ Características principales
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Crear, editar y eliminar tableros, columnas y tareas.</li>
                  <li>
                    Organizar tareas con etiquetas, prioridades y fechas de
                    vencimiento.
                  </li>
                  <li>Arrastrar y soltar tareas entre columnas.</li>
                  <li>Vista de calendario para planificar tus semanas.</li>
                  <li>
                    Búsqueda avanzada para encontrar cualquier tarea al
                    instante.
                  </li>
                  <li>Exportar tus tableros en PDF.</li>
                  <li>Interfaz rápida, minimalista y adaptable.</li>
                </ul>
              </section>
            </section>
          </DialogDescription>
        </DialogHeader>

        <footer className="text-center mt-6 text-white/50 text-sm">
          <p>
            Creado por{" "}
            <a
              href="https://www.nicolasdev.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white/70"
            >
              Nicolás Devesa
            </a>
          </p>
          <p>¡Gracias por usar NIMA!</p>
        </footer>
      </DialogContent>
    </Dialog>
  );
}
