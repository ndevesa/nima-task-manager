import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const exportData = (data) => {
  const now = new Date();
  const formattedDate = now.toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (!data || !data.columns || !data.tasks) {
    alert("No hay datos para exportar.");
    return;
  }

  const doc = new jsPDF();

  // Fecha de exportación (título)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Backup generado el:", 14, 20);

  // La fecha
  doc.text(formattedDate, 14, 26);

  // Título del tablero
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Tablero NIMA", 14, 36);

  let currentY = 46; // Posición inicial para las columnas

  // Iterar columnas y sus tareas
  Object.values(data.columns).forEach((col) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(
      `${col.title}`,
      14,
      doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 10 : currentY
    );

    const tasksInColumn = col.taskIds
      .map((taskId) => data.tasks[taskId])
      .filter(Boolean);

    if (tasksInColumn.length > 0) {
      const rows = tasksInColumn.map((t) => [
        t.content || "(sin título)",
        t.description || "",
        t.taskPriority || "",
        t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "-",
      ]);

      autoTable(doc, {
        startY: doc.lastAutoTable?.finalY
          ? doc.lastAutoTable.finalY + 15
          : currentY + 5,
        head: [["Título", "Descripción", "Prioridad", "Vencimiento"]],
        body: rows,
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [15, 15, 15] },
      });
    } else {
      doc.setFontSize(10);
      doc.text(
        "Sin tareas en esta columna.",
        14,
        doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 15 : currentY + 5
      );
    }
  });

  doc.save("nima_tablero.pdf");
};

export default exportData;
