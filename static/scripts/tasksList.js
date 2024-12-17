import { renderTaskList } from "./mainPage.js";
import { stackList } from './stackList.js'

export let tasksList = [];

export function deleteTaskFromTaskList(taskId){
  tasksList = tasksList.filter(task => task.id !== taskId);
}

export async function addTaskToTaskList(taskName, dayId) {
  const newTask = {
    title: taskName,
    user_id: localStorage.getItem('user_id'), // Получаем ID пользователя из localStorage
    date: new Date(dayId).toISOString(), // Преобразуем дату в формат ISO
    is_done: false
  };

  // Отправляем задачу на бэкенд
  const response = await addTaskToDatabase(newTask);

  if (response && response.task_id) {
    // Если задача успешно добавлена, обновляем локальный список задач
    newTask.id = response.task_id;
    tasksList.push(newTask);
    renderTaskList(dayId); // Рендерим список задач для текущего дня
  }
}

export async function removeTaskfromTaskList(taskId, dayId) {
  try {
    const response = await fetch(`/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete task');
    }

    // Удаляем задачу из локального списка
    tasksList = tasksList.filter(task => task.id !== taskId);
    renderTaskList(dayId);
  } catch (error) {
    console.error('Error deleting task:', error);
  }
}

export function completeTaskInTaskList(taskId, dayId) {
  const taskNameElement = document.getElementById(`taskNameId${taskId}`);
  taskNameElement.style.textDecoration = 'line-through';
  setTimeout(() => {
    removeTaskfromTaskList(taskId, dayId);
  }, 1000);
}