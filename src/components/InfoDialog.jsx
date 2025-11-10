import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function InfoDialog({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0f0f0f] border-white/20 text-white/70">
        <DialogHeader>
          <DialogTitle className="text-white">Acerca de NIMA</DialogTitle>
          <DialogDescription className="mt-4 text-white/80">
            <p className="mb-2">
              <b>NIMA</b> es una app de gestión de tareas inspirada en el estilo
              de Trello, pensada para organizar tu trabajo y tus proyectos de
              forma ágil y visual.
            </p>
            <p className="mb-2">
              Te permite crear tableros, columnas y tareas, moverlas fácilmente,
              y mantener todo sincronizado entre dispositivos.
            </p>
            <p className="mb-5">
              Ideal para uso personal o profesional, NIMA busca simplificar tu
              día a día sin complicaciones.
            </p>

            <strong className="mb-2 block">
              💾 Almacenamiento y seguridad
            </strong>
            <p className="mb-5">
              Tus datos se guardan de forma segura y privada.
              <br />
              Si iniciás sesión, se sincronizan con la nube para que puedas
              acceder a ellos desde cualquier lugar.
            </p>

            <strong className="mb-2 block">
              ⚙️ Características principales
            </strong>
            <ul>
              <li>Crear, editar y eliminar tableros, columnas y tareas.</li>
              <li>
                Organizar tareas con etiquetas, prioridades y fechas de
                vencimiento.
              </li>
              <li>Arrastrar y soltar tareas entre columnas.</li>
              <li>Vista de calendario para planificar tus semanas.</li>
              <li>
                Búsqueda avanzada para encontrar cualquier tarea al instante.
              </li>
              <li>Exportar tus tableros en PDF.</li>

              <li>Interfaz rápida, minimalista y adaptable.</li>
            </ul>
          </DialogDescription>
        </DialogHeader>

        <small className="text-white/50 text-center mt-4">
          Creado por
          <a href="https://www.nicolasdev.com"> Nicolás Devesa</a>
          <br />
          ¡Gracias por usarlo!
        </small>
      </DialogContent>
    </Dialog>
  );
}
