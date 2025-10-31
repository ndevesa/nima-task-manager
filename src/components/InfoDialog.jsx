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
      <DialogContent className="bg-black border-white/20 text-white/70">
        <DialogHeader>
          <DialogTitle className="text-white">Acerca de NIMA</DialogTitle>
          <DialogDescription className="mt-4 text-white/70">
            NIMA es un task manager al estilo <i>Trello</i>, desarrollado para
            gestionar tareas de manera eficiente. <br /> Esta herramienta está
            diseñada para mejorar la productividad y facilitar la gestión de
            proyectos personales o profesionales.
            <span className="block mt-4 mb-2 text-white">Almacenamiento:</span>
            Tus datos se guardan automáticamente en tu navegador. Son privados y
            no salen de tu dispositivo.
          </DialogDescription>
        </DialogHeader>

        <div>
          <p className="text-white">Características principales:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Crear, editar y eliminar tareas.</li>
            <li>Organizar tareas en columnas personalizables.</li>
            <li>Arrastrar y soltar tareas entre columnas.</li>
            <li>Establecer prioridades y fechas de vencimiento.</li>
            <li>Importar y exportar datos en formato JSON.</li>
            <small className="mt-4 block text-white">¡NUEVO!</small>
            <li>Modo Calendario</li>
            <li>Autenticación de Usuarios</li>
            <li>Búsqueda avanzada de tareas</li>
          </ul>
        </div>

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
