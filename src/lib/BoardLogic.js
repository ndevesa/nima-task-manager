import { supabase } from "./supabaseClient";
import { uploadTaskAttachment, deleteTaskAttachment } from "./storageHelpers";

// ========== CARGAR DATOS ==========
export const loadUserData = async (userId) => {
  try {
    const { data: columns, error: colError } = await supabase
      .from("columns")
      .select("id, title, position")
      .eq("user_id", userId)
      .order("position");

    if (colError) throw colError;

    const { data: tasks, error: taskError } = await supabase
      .from("tasks")
      .select(
        "due_date, priority, tag, column_id, attachment_url, attachment_name, attachment_type, id, title, description, subtasks"
      )
      .eq("user_id", userId)
      .order("created_at");

    if (taskError) throw taskError;

    const tasksById = Object.fromEntries(
      tasks.map((t) => [
        t.id,
        {
          id: t.id,
          content: t.title,
          description: t.description,
          dueDate: t.due_date,
          tag: t.tag,
          subtasks: t.subtasks || [],
          attachment_url: t.attachment_url || null,
          attachment_name: t.attachment_name || null,
          attachment_type: t.attachment_type || null,
          taskPriority: t.priority,
        },
      ])
    );

    const columnsById = Object.fromEntries(
      columns.map((c) => [
        c.id,
        {
          id: c.id,
          title: c.title,
          taskIds: tasks.filter((t) => t.column_id === c.id).map((t) => t.id),
        },
      ])
    );

    return {
      tasks: tasksById,
      columns: columnsById,
      columnOrder: columns.map((c) => c.id),
    };
  } catch (error) {
    console.error("Error loading data:", error);
    return null;
  }
};

// ========== CRUD: COLUMNS ==========
export const createColumnDB = async (title, userId, position) => {
  const { data, error } = await supabase
    .from("columns")
    .insert([{ user_id: userId, title, position }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateColumnDB = async (columnId, updates) => {
  const { error } = await supabase
    .from("columns")
    .update(updates)
    .eq("id", columnId);
  if (error) throw error;
};

export const deleteColumnDB = async (columnId) => {
  const { error } = await supabase.from("columns").delete().eq("id", columnId);
  if (error) throw error;
};

// ========== CRUD: TASKS ==========
export const createTaskDB = async (task, columnId, userId) => {
  const { data, error } = await supabase
    .from("tasks")
    .insert([
      {
        user_id: userId,
        column_id: columnId,
        title: task.title,
        description: task.description,
        tag: task.tag || null,
        due_date: task.dueDate,
        priority: task.taskPriority,
        subtasks: task.subtasks || [],
        attachment_url: task.attachment_url || null,
        attachment_name: task.attachment_name || null,
        attachment_type: task.attachment_type || null,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateTaskDB = async (taskId, updates) => {
  const { error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", taskId);
  if (error) throw error;
};

export const deleteTaskDB = async (taskId) => {
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);
  if (error) throw error;
};

// ========== OPERACIONES EN ESTADO LOCAL ==========

export const editTask = (
  taskId,
  data,
  setFormData,
  setEditingTaskId,
  setIsDialogOpen
) => {
  const task = data.tasks[taskId];
  const columnId = Object.keys(data.columns).find((colId) =>
    data.columns[colId].taskIds.includes(taskId)
  );

  setFormData({
    title: task.content,
    description: task.description || "",
    category: columnId,
    tag: task.tag || "",
    dueDate: task.dueDate || null,
    subtasks: task.subtasks || [],
    taskPriority: task.taskPriority || null,
    attachment_url: task.attachment_url || null,
    attachment_name: task.attachment_name || null,
    attachment_type: task.attachment_type || null,
  });

  setEditingTaskId(taskId);
  setIsDialogOpen(true);
};

export const deleteTask = async (data, taskId, setData, user) => {
  const columnId = Object.keys(data.columns).find((colId) =>
    data.columns[colId].taskIds.includes(taskId)
  );

  if (!columnId) return;

  try {
    // Eliminar archivo adjunto si existe
    const task = data.tasks[taskId];
    if (task.attachment_url) {
      await deleteTaskAttachment(task.attachment_url);
    }

    // Eliminar de Supabase
    if (user) {
      await deleteTaskDB(taskId);
    }
  } catch (error) {
    console.error("Error eliminando tarea:", error);
  }

  // 2. Eliminar del estado local
  const { [taskId]: _, ...remainingTasks } = data.tasks;

  const updatedTaskIds = data.columns[columnId].taskIds.filter(
    (id) => id !== taskId
  );

  setData({
    ...data,
    tasks: remainingTasks,
    columns: {
      ...data.columns,
      [columnId]: { ...data.columns[columnId], taskIds: updatedTaskIds },
    },
  });
};

export const addNewColumn = async (data, setData, user) => {
  try {
    const supaCol = await createColumnDB(
      "Nueva columna",
      user.id,
      data.columnOrder.length
    );
    const newCol = { id: supaCol.id, title: supaCol.title, taskIds: [] };

    setData({
      ...data,
      columns: { ...data.columns, [newCol.id]: newCol },
      columnOrder: [...data.columnOrder, newCol.id],
    });
  } catch (error) {
    console.error("Error creando columna:", error);
  }
};

export const deleteColumn = async (data, columnId, setData, user) => {
  try {
    if (user) await deleteColumnDB(columnId);
  } catch (error) {
    console.error("Error eliminando columna:", error);
  }

  const newColumns = { ...data.columns };
  delete newColumns[columnId];
  const newOrder = data.columnOrder.filter((id) => id !== columnId);

  setData({ ...data, columns: newColumns, columnOrder: newOrder });
};

export const updateColumnTitle = async (
  data,
  columnId,
  title,
  setData,
  user
) => {
  try {
    if (user) await updateColumnDB(columnId, { title });
  } catch (error) {
    console.error("Error actualizando columna:", error);
  }

  setData({
    ...data,
    columns: {
      ...data.columns,
      [columnId]: { ...data.columns[columnId], title },
    },
  });
};

export const handleSaveTask = async (
  data,
  formData,
  setData,
  editingTaskId,
  setEditingTaskId,
  setIsDialogOpen,
  setFormData,
  user,
  attachmentFile
) => {
  /* console.log("🟢 === INICIO handleSaveTask ==="); */

  try {
    if (!data.columns[formData.category]) {
      console.error("❌ La columna no existe:", formData.category);
      throw new Error(
        `La columna "${formData.category}" no existe. Por favor seleccioná una columna válida.`
      );
    }

    let attachmentData = {
      attachment_url: formData.attachment_url || null,
      attachment_name: formData.attachment_name || null,
      attachment_type: formData.attachment_type || null,
    };

    // Si hay nuevo archivo, subirlo
    if (attachmentFile) {
      /* console.log("📤 Subiendo archivo a Supabase..."); */
      const uploaded = await uploadTaskAttachment(
        attachmentFile,
        user.id,
        editingTaskId || Date.now()
      );

      console.log("✅ Archivo subido exitosamente:", uploaded);

      attachmentData = {
        attachment_url: uploaded.url,
        attachment_name: uploaded.name,
        attachment_type: uploaded.type,
      };
    }

    if (editingTaskId) {
      /* console.log("✏️ MODO EDICIÓN - taskId:", editingTaskId); */

      if (user) {
        /* console.log("📡 Actualizando en Supabase..."); */
        await updateTaskDB(editingTaskId, {
          title: formData.title,
          description: formData.description,
          due_date: formData.dueDate,
          tag: formData.tag,
          subtasks: formData.subtasks,
          priority: formData.taskPriority,
          column_id: formData.category,
          ...attachmentData,
        });
        /* console.log("✅ Supabase actualizado"); */
      }

      /* console.log("🔄 Actualizando estado local..."); */
      setData({
        ...data,
        tasks: {
          ...data.tasks,
          [editingTaskId]: {
            ...data.tasks[editingTaskId],
            content: formData.title,
            description: formData.description,
            tag: formData.tag,
            dueDate: formData.dueDate,
            subtasks: formData.subtasks,
            taskPriority: formData.taskPriority,
            ...attachmentData,
          },
        },
      });
      console.log("✅ Estado local actualizado");
    } else {
      /* console.log("➕ MODO CREACIÓN"); */

      const newTask = await createTaskDB(
        { ...formData, ...attachmentData },
        formData.category,
        user.id
      );
      /*   console.log("✅ Tarea creada en Supabase:", newTask); */

      /* console.log("🔄 Actualizando estado local..."); */
      setData({
        ...data,
        tasks: {
          ...data.tasks,
          [newTask.id]: {
            id: newTask.id,
            content: newTask.title,
            description: newTask.description,
            tag: newTask.tag,
            subtasks: newTask.subtasks,
            dueDate: newTask.due_date,
            taskPriority: newTask.priority,
            ...attachmentData,
          },
        },
        columns: {
          ...data.columns,
          [formData.category]: {
            ...data.columns[formData.category],
            taskIds: [...data.columns[formData.category].taskIds, newTask.id],
          },
        },
      });
      /*  console.log("✅ Estado local actualizado con nueva tarea"); */
    }

    /*  console.log("🧹 Limpiando formulario..."); */
    setIsDialogOpen(false);
    setEditingTaskId(null);
    setFormData({
      title: "",
      description: "",
      category: undefined,
      tag: "",
      dueDate: null,
      taskPriority: null,
      subtasks: [],
      attachment_url: null,
      attachment_name: null,
      attachment_type: null,
    });
    /*  console.log("✅ === FIN handleSaveTask ==="); */
  } catch (error) {
    console.error("❌ === ERROR EN handleSaveTask ===");
    console.error("Error completo:", error);
    console.error("Stack:", error.stack);
    throw error;
  }
};

export const calculateTasks = (data) => {
  if (!data?.columns) return 0; // 👈 protege contra null o undefined
  return Object.values(data.columns).reduce(
    (acc, col) => acc + (col.taskIds?.length || 0),
    0
  );
};

// ======== LOCAL STORAGE HELPERS (fallback/backup) ========
export const saveToLocalStorage = (data) => {
  try {
    localStorage.setItem("tgc-trello-data", JSON.stringify(data));
    return true;
  } catch (e) {
    console.error("Error guardando en localStorage:", e);
    return false;
  }
};

export const loadFromLocalStorage = () => {
  try {
    const saved = localStorage.getItem("tgc-trello-data");
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    console.error("Error cargando localStorage:", e);
    return null;
  }
};

export const clearLocalStorage = () => {
  try {
    localStorage.removeItem("tgc-trello-data");
    return true;
  } catch (e) {
    console.error("Error limpiando localStorage:", e);
    return false;
  }
};
