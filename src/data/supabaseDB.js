import { sub } from "date-fns";
import { supabase } from "../lib/supabaseClient";

// ========== TAREAS ==========

export const fetchUserTasks = async (userId) => {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("position");

  if (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }

  return data;
};

export const createTaskDB = async (taskData, userId) => {
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      user_id: userId,
      title: taskData.title,
      description: taskData.description,
      due_date: taskData.dueDate,
      subtasks: taskData.subtasks,
      tag: taskData.tag,
      attachment_url: taskData.attachment_url || null,
      attachment_name: taskData.attachment_name || null,
      attachment_type: taskData.attachment_type || null,
      priority: taskData.taskPriority,
      column_id: taskData.columnId,
    })
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

// ========== COLUMNAS ==========

export const fetchUserColumns = async (userId) => {
  const { data, error } = await supabase
    .from("columns")
    .select("*")
    .eq("user_id", userId)
    .order("position");

  if (error) {
    console.error("Error fetching columns:", error);
    return [];
  }

  return data;
};

export const createColumnDB = async (columnData, userId) => {
  const { data, error } = await supabase
    .from("columns")
    .insert({
      id: columnData.id,
      user_id: userId,
      title: columnData.title,
      position: columnData.position,
    })
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
