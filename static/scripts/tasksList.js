import { renderTaskList } from "./mainPage.js";
import { stackList } from './stackList.js'

export let tasksList = [];

export function deleteTaskFromTaskList(taskId){
  tasksList = tasksList.filter(task => task.id !== taskId);
}

export function addTaskToTaskList(taskName, dayId) {
  let taskId = 0;
  if (tasksList.length !== 0 && stackList.length !== 0) {
    taskId = Math.max(Number(tasksList[tasksList.length - 1].id), Number(stackList[0].id)) + 1;
  } else if (tasksList.length === 0 && stackList.length !== 0) {
    taskId = Number(stackList[0].id) + 1;
  } else if (tasksList.length !== 0 && stackList.length === 0) {
    taskId = Number(tasksList[tasksList.length - 1].id) + 1;
  } else if (tasksList.length === 0 && stackList.length === 0) {
    taskId = 1;
  }

  const newTask = {
    id: taskId,
    title: taskName,
    is_done: false,
    dayId: dayId
  };
  tasksList.push(newTask);
  renderTaskList(dayId); // Рендерим список задач для текущего дня
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