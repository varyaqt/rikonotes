import { renderTaskList } from "./mainPage.js";

const today = new Date();
export let tasksList = [
  {
    id: 1,
    title: 'Помыть посуду',
    is_done: false,
    dayId: '2024-12-17'
  },
  {
    id: 2,
    title: 'Сделать домашку',
    is_done: false,
    dayId: '2024-12-18'
  },
  {
    id: 3,
    title: 'Помыть посуду',
    is_done: false,
    dayId: '2024-12-18'
  }
];

export function deleteTaskFromTaskList(taskId){
  tasksList = tasksList.filter(task => task.id !== taskId);
}

export function addTaskToTaskList(taskName, dayId) {
  let taskId = 0;
  if (tasksList.length !== 0) {
    taskId = Number(tasksList[tasksList.length - 1].id) + 1;
  } else {
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
  console.log(taskNameElement);
  taskNameElement.style.textDecoration = 'line-through';
  setTimeout(() => {
    removeTaskfromTaskList(taskId, );
  }, 1000);
}