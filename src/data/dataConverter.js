import { sub } from "date-fns";

export const supabaseToAppFormat = (supabaseTasks, supabaseColumns) => {
  // Convertir tareas
  const tasks = supabaseTasks.reduce((acc, task) => {
    acc[task.id] = {
      id: task.id,
      content: task.title,
      description: task.description,
      dueDate: task.due_date,
      tag: task.tag,
      subtasks: task.subtasks || [],
      attachment_url: task.attachment_url,
      attachment_file_name: task.attachment_file_name,
      attachment_type: task.attachment_type,
      taskPriority: task.priority,
    };
    return acc;
  }, {});

  // Convertir columnas
  const columns = supabaseColumns.reduce((acc, col) => {
    const columnTasks = supabaseTasks
      .filter((t) => t.column_id === col.id)
      .map((t) => t.id);

    acc[col.id] = {
      id: col.id,
      title: col.title,
      taskIds: columnTasks,
    };
    return acc;
  }, {});

  return {
    tasks,
    columns,
    columnOrder: supabaseColumns.map((c) => c.id),
  };
};

// Convierte 1 tarea de formato app a Supabase
export const appTaskToSupabase = (appTask, columnId, userId) => {
  return {
    user_id: userId,
    title: appTask.content || appTask.title,
    description: appTask.description,
    due_date: appTask.dueDate,
    priority: appTask.taskPriority,
    column_id: columnId,
  };
};
