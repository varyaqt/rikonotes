const today = new Date();
export let tasksList = [
  {
    id: 1,
    title: 'Помыть посуду',
    date: new Date(),
    is_done: false
  },
  {
    id: 2,
    title: 'Сделать домашку',
    date: today,
    is_done: false
  },
  {
    id: 3,
    title: 'Помыть посуду',
    date: today.setDate(today.getDate() + 45),
    is_done: false
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
    name: taskName,
    dayId: dayId
  };
  tasksList.push(newTask);
  renderTaskList(dayId); // Рендерим список задач для текущего дня
}

export function removeTaskfromTaskList(taskId) {
  deleteTaskFromTaskList(taskId);
  const dayId = tasksList.find(task => task.id === taskId).dayId;
  renderTaskList(dayId);
}

export function completeTaskInTaskList(taskId) {
  const taskNameElement = document.getElementById(`taskNameId${taskId}`);
  taskNameElement.style.textDecoration = 'line-through';
  setTimeout(() => {
    removeTaskfromTaskList(taskId);
  }, 1000);
}