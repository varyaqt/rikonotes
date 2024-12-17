import { renderTaskList } from "./mainPage.js";
import { stackList } from './stackList.js'

export let tasksList = [];

export function deleteTaskFromTaskList(taskId){
  tasksList = tasksList.filter(task => task.id !== taskId);
}

async function addTaskToTaskList(taskName, dayId) {
  const response = await fetch('/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: taskName,
      description: '',
      user_id: localStorage.getItem('user_id'),
      date: new Date(dayId).toISOString(),
      is_done: false,
    }),
  });

  if (response.ok) {
    const newTask = await response.json();
    renderTaskList(dayId); // Обновляем список задач для текущего дня
  } else {
    console.error('Failed to add task');
  }
}

async function removeTaskfromTaskList(taskId, dayId) {
  const response = await fetch(`/tasks/${taskId}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    renderTaskList(dayId); // Обновляем список задач для текущего дня
  } else {
    console.error('Failed to delete task');
  }
}

async function completeTaskInTaskList(taskId, dayId) {
  const taskNameElement = document.getElementById(`taskNameId${taskId}`);
  taskNameElement.style.textDecoration = 'line-through';

  const response = await fetch(`/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      is_done: true,
    }),
  });

  if (response.ok) {
    setTimeout(() => {
      removeTaskfromTaskList(taskId, dayId);
    }, 1000);
  } else {
    console.error('Failed to mark task as completed');
  }
}