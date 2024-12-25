import { renderTaskList } from "./mainPage.js";
import { stackList } from './stackList.js'

export let tasksList = [];

// Логирование при удалении задачи
export function deleteTaskFromTaskList(taskId){
  tasksList = tasksList.filter(task => task.id !== taskId);
}

// Логирование при добавлении задачи
export async function addTaskToTaskList(taskName, dayId) {
  const token = localStorage.getItem('access_token'); // Получаем токен из localStorage

  // Формируем структуру задачи
  const taskData = {
    title: taskName,
    description: '',
    user_id: localStorage.getItem('user_id'),
    date: new Date(dayId).toISOString(),
    is_done: false,
  };

  // Логирование данных задачи перед отправкой на сервер
  console.debug("Adding task:", taskData);

  const response = await fetch('http://127.0.0.1:8000/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Передаем токен в заголовках
    },
    body: JSON.stringify(taskData),
  });

  if (response.ok) {
    const newTask = await response.json();
    console.debug("Task added successfully:", newTask);  // Логирование ответа от сервера

    // Обновляем список задач для текущего дня
    renderTaskList(dayId);
  } else {
    const errorData = await response.json();
    console.error('Failed to add task:', errorData);  // Логирование ошибки
  }
}

// Логирование при удалении задачи
export async function removeTaskfromTaskList(taskId, dayId) {
  const token = localStorage.getItem('access_token'); // Получаем токен из localStorage

  // Логирование перед удалением задачи
  console.debug(`Deleting task with ID: ${taskId}`);

  const response = await fetch(`http://127.0.0.1:8000/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`, // Передаем токен в заголовках
    },
  });

  if (response.ok) {
    console.debug(`Task with ID: ${taskId} deleted successfully`);

    // Обновляем список задач для текущего дня
    renderTaskList(dayId);
  } else {
    console.error('Failed to delete task');
  }
}

// Логирование при пометке задачи как завершенной
export async function completeTaskInTaskList(taskId, dayId) {
  const token = localStorage.getItem('access_token'); // Получаем токен из localStorage
  const taskNameElement = document.getElementById(`taskNameId${taskId}`);
  taskNameElement.style.textDecoration = 'line-through';

  const taskData = { is_done: true };

  // Логирование данных перед отправкой на сервер
  console.debug(`Marking task as completed (ID: ${taskId}):`, taskData);

  const response = await fetch(`http://127.0.0.1:8000/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Передаем токен в заголовках
    },
    body: JSON.stringify(taskData),
  });

  if (response.ok) {
    console.debug(`Task with ID: ${taskId} marked as completed`);

    // Обновление списка задач после завершения
    setTimeout(() => {
      removeTaskfromTaskList(taskId, dayId);
    }, 1000);
  } else {
    console.error('Failed to mark task as completed');
  }
}
