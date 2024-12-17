import { renderTaskList } from "./mainPage.js";
import { stackList } from './stackList.js'

export let tasksList = [];

export function deleteTaskFromTaskList(taskId){
  tasksList = tasksList.filter(task => task.id !== taskId);
}

export async function addTaskToTaskList(taskName, dayId) {
  const user_id = localStorage.getItem('user_id'); // Предполагаем, что user_id сохранен в localStorage
  const taskData = {
    title: taskName,
    description: 'Описание задачи', // Добавьте описание, если нужно
    user_id: user_id,
    date: new Date(dayId).toISOString(), // Преобразуем dayId в формат даты
    is_done: false
  };

  try {
    const response = await fetch('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}` // Добавляем токен авторизации
      },
      body: JSON.stringify(taskData)
    });

    if (response.ok) {
      const newTask = await response.json();
      tasksList.push(newTask); // Добавляем задачу в локальный список
      renderTaskList(dayId); // Рендерим список задач для текущего дня
    } else {
      console.error('Ошибка при добавлении задачи');
    }
  } catch (error) {
    console.error('Ошибка сети:', error);
  }
}

export async function removeTaskfromTaskList(taskId, dayId) {
  try {
    const response = await fetch(`/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}` // Добавляем токен авторизации
      }
    });

    if (response.ok) {
      deleteTaskFromTaskList(taskId); // Удаляем задачу из локального списка
      renderTaskList(dayId); // Рендерим список задач для текущего дня
    } else {
      console.error('Ошибка при удалении задачи');
    }
  } catch (error) {
    console.error('Ошибка сети:', error);
  }
}

export async function completeTaskInTaskList(taskId, dayId) {
  const taskNameElement = document.getElementById(`taskNameId${taskId}`);
  taskNameElement.style.textDecoration = 'line-through';

  try {
    const response = await fetch(`/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}` // Добавляем токен авторизации
      },
      body: JSON.stringify({ is_done: true })
    });

    if (response.ok) {
      setTimeout(() => {
        removeTaskfromTaskList(taskId, dayId); // Удаляем задачу из локального списка
      }, 1000);
    } else {
      console.error('Ошибка при обновлении задачи');
    }
  } catch (error) {
    console.error('Ошибка сети:', error);
  }
}