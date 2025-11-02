import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import * as BoardLogic from "../lib/BoardLogic";

export default function TaskSearch({ columns, onSearchChange }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState(undefined); // ← undefined para placeholder
  const [selectedColumn, setSelectedColumn] = useState("Todas");

  const data = BoardLogic.loadFromLocalStorage();

  const totalTasks = useMemo(() => BoardLogic.calculateTasks(data), [data]);
  const searchPlaceholder = `Buscar tareas (${totalTasks})`;

  // Notificar cambios al componente padre (App)
  const handleChange = (newValues) => {
    onSearchChange({
      query: newValues.query ?? searchQuery,
      priority: newValues.priority ?? selectedPriority,
      column: newValues.column ?? selectedColumn,
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 bg-white/10 border border-white/20 p-2 rounded-xl backdrop-blur-md">
      <Input
        type="text"
        placeholder={searchPlaceholder}
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          handleChange({ query: e.target.value });
        }}
        className="flex-1 bg-white/10 border-white/20 text-white/80 placeholder:text-white/70"
      />

      {/* PRIORIDAD con placeholder */}
      <Select
        value={selectedPriority || undefined}
        onValueChange={(value) => {
          setSelectedPriority(value);
          handleChange({ priority: value });
        }}
      >
        <SelectTrigger className="bg-white/10 border-white/20 text-white/80 hover:text-white w-[140px] [&>span]:text-white/80 [&>svg]:text-white/80 hover:[&>svg]:text-white">
          <SelectValue placeholder="Prioridad" />
        </SelectTrigger>
        <SelectContent className="bg-gray backdrop-blur-lg border-white/20 text-white">
          <SelectItem value="Todas">Todas</SelectItem>
          <SelectItem value="Alta">Alta</SelectItem>
          <SelectItem value="Media">Media</SelectItem>
          <SelectItem value="Baja">Baja</SelectItem>
        </SelectContent>
      </Select>

      {/* COLUMNA con "Todas" seleccionado pero mostrando placeholder visual */}
      <Select
        value={selectedColumn}
        onValueChange={(value) => {
          setSelectedColumn(value);
          handleChange({ column: value });
        }}
      >
        <SelectTrigger className="bg-white/10 border-white/20 text-white/80 hover:text-white w-[140px] [&>span]:text-white/80 [&>svg]:text-white/80 hover:[&>svg]:text-white">
          <SelectValue>
            {selectedColumn === "Todas" ? (
              <span className="text-white/70">Categoría</span>
            ) : (
              columns[selectedColumn]?.title || selectedColumn
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-gray backdrop-blur-lg border-white/20 text-white">
          <SelectItem value="Todas">Todas</SelectItem>
          {Object.values(columns).map((col) => (
            <SelectItem key={col.id} value={col.id}>
              {col.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
