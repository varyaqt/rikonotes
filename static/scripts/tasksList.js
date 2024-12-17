import { renderTaskList } from "./mainPage.js";
import { stackList } from './stackList.js';
import { addTaskToDatabase } from './mainPage.js'; // Импортируем функцию для добавления задачи на бэкенд

export let tasksList = [];

export function deleteTaskFromTaskList(taskId) {
  tasksList = tasksList.filter(task => task.id !== taskId);
}

export async function addTaskToTaskList(taskName, dayId) {
  const newTask = {
    title: taskName,
    description: '', // Добавьте описание, если нужно
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

export function removeTaskfromTaskList(taskId, dayId) {
  deleteTaskFromTaskList(taskId);
  renderTaskList(dayId);
}

export function completeTaskInTaskList(taskId, dayId) {
  const taskNameElement = document.getElementById(`taskNameId${taskId}`);
  taskNameElement.style.textDecoration = 'line-through';
  setTimeout(() => {
    removeTaskfromTaskList(taskId, dayId);
  }, 1000);
}