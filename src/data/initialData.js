const initialData = {
  tasks: {
    // TO DO - 5 tareas
    1: {
      id: 1,
      content: "Diseñar wireframes del dashboard",
      description:
        "Crear wireframes de baja fidelidad para las vistas principales: home, perfil y configuración",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // en 5 días
      taskPriority: "Alta",
    },
    2: {
      id: 2,
      content: "Investigar librerías de gráficos",
      description:
        "Comparar Chart.js, Recharts y D3.js para implementar visualizaciones de datos",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      taskPriority: "Media",
    },
    3: {
      id: 3,
      content: "Revisar feedback de usuarios",
      tag: "redes",
      description:
        "Analizar los comentarios del último sprint y priorizar mejoras",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // urgente
      taskPriority: "Alta",
    },
    4: {
      id: 4,
      content: "Actualizar documentación API",
      description:
        "Documentar los nuevos endpoints de autenticación y agregar ejemplos de uso",
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      taskPriority: "Baja",
    },
    5: {
      id: 5,
      content: "Planificar sprint review",
      description: "Preparar demo y slides para la presentación del equipo",
      tag: "team",
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      taskPriority: "Media",
    },

    // DOING - 4 tareas
    6: {
      id: 6,
      content: "Implementar autenticación con JWT",
      description:
        "Configurar middleware de autenticación y refresh tokens. Integrar con backend existente",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      taskPriority: "Alta",
    },
    7: {
      id: 7,
      content: "Optimizar queries de base de datos",
      tag: "backend",
      description:
        "Refactorizar consultas lentas y agregar índices a las tablas más consultadas",
      dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
      taskPriority: "Alta",
    },
    8: {
      id: 8,
      content: "Diseñar sistema de notificaciones",
      tag: "frontend",
      description:
        "Crear componentes reutilizables para toast, alerts y badges",
      dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
      taskPriority: "Media",
    },
    9: {
      id: 9,
      content: "Escribir tests E2E",
      description:
        "Configurar Cypress y escribir tests para los flujos críticos de usuario",
      dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
      taskPriority: "Baja",
    },

    // DONE - 6 tareas
    10: {
      id: 10,
      content: "Configurar CI/CD pipeline",
      description:
        "Implementar GitHub Actions para testing y deploy automático",
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // hace 2 días
      taskPriority: "Alta",
    },
    11: {
      id: 11,
      content: "Migrar a TypeScript",
      description:
        "Convertir componentes principales y agregar tipado estricto",
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      taskPriority: "Media",
    },
    12: {
      id: 12,
      content: "Implementar modo responsive",
      description:
        "Adaptar layout para tablets y móviles con breakpoints personalizados",
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      taskPriority: "Alta",
    },
    13: {
      id: 13,
      content: "Configurar ESLint y Prettier",
      description:
        "Establecer reglas de código y formateo automático para el equipo",
      dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      taskPriority: "Baja",
    },
    14: {
      id: 14,
      content: "Crear sistema de temas",
      tag: "frontend",
      description:
        "Implementar variables CSS y context para cambio dinámico de colores",
      dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      taskPriority: "Media",
    },
    15: {
      id: 15,
      content: "Optimizar bundle size",
      description:
        "Implementar code splitting y lazy loading. Reducir bundle de 2MB a <500KB",
      dueDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      taskPriority: "Alta",
    },
    16: {
      id: 16,
      content: "Code review PR #234",
      tag: "QA",
      description: "Revisar implementación de sistema de caché",
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      taskPriority: "Alta",
    },
  },
  columns: {
    todo: {
      id: "todo",
      title: "📋 Por Hacer",
      taskIds: [1, 2, 3, 4, 5],
    },
    doing: {
      id: "doing",
      title: "⚡ En Progreso",
      taskIds: [6, 7, 8, 9],
    },
    done: {
      id: "done",
      title: "✅ Completado",
      taskIds: [10, 11, 12, 13, 14, 15],
    },
    review: {
      id: "review",
      title: "👀 En Revisión",
      taskIds: [16],
    },
  },
  columnOrder: ["todo", "doing", "review", "done"],
};

export default initialData;
