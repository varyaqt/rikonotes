import { 
  stackList, 
  checkFullStack, 
  sortStackList, 
  deleteTaskFromStackList
} from "./stackList.js";

import {
  tasksList,
  addTaskToTaskList,
  completeTaskInTaskList,
  removeTaskfromTaskList
} from "./tasksList.js";

// calendar
new AirDatepicker('#airdatepicker', {
  inline: true,
  onSelect: function(dateInfo) {
    const selectedDate = dateInfo.date;
  const dynamicDaysContainer = document.getElementById('dynamic-days-container');
  dynamicDaysContainer.innerHTML = ''; // Очищаем контейнер
  const weekHTML = generateWeek(selectedDate);
  dynamicDaysContainer.innerHTML = weekHTML; // Добавляем 7 дней

  // После добавления дней, инициализируем рендеринг задач
  document.querySelectorAll('.day-container').forEach(dayContainer => {
    const dayId = dayContainer.getAttribute('data-day-id');
    renderTaskList(dayId);
  });
  }
});

// make a default value of calendar input as a today's date
const today = new Date();
const day = today.getDate();
const month = today.getMonth() + 1; 
const year = today.getFullYear();
const formattedDate = `${day}.${month}.${year}`;

const calendarInputElement = document.getElementById('airdatepicker');
calendarInputElement.value = `${formattedDate}`;

const inputElement = document.getElementById('inputToStack');
const placeholderImage = document.querySelector('.js-add-stack-icon');
const inputContainer = document.querySelector('.js-add-todo-to-stack');
const addToStackButtonElement = document.getElementById('addStackButton');
const taskInStackElement = document.querySelector('.js-todo-container-stack');

renderStackList();

// определяем размер стека
function updateSizeStack() {
  const sizeStackElement = document.querySelector('.js-size-stack');
  sizeStackElement.innerHTML = `${stackList.length}/10`;
};

// проверяем заполненность стэка
function checkInputStackAvailable() {
  const sizeStackElement = document.querySelector('.js-size-stack');
  if (checkFullStack() === true) {
    inputElement.classList.remove('input-active');
    inputElement.classList.add('not-active-input-stack');
    sizeStackElement.style.color = 'rgb(122, 25, 25)';
    inputElement.placeholder = 'Стек переполнен';
    inputElement.disabled = true;
    placeholderImage.style.display = 'none';
    addToStackButtonElement.style.display = 'none'
  } else {
    sizeStackElement.style.color = 'rgb(60,91,120)';
    inputElement.classList.remove('not-active-input-stack');
    inputElement.placeholder = 'Добавить в стек';
    inputElement.disabled = false;
  };
};

// генерация списка задач в стеке
function renderStackList() {
  const stackListElement = document.querySelector('.js-stack-list-container');
  sortStackList();
  let html = ``;
  stackList.forEach((element) => {
    html += `
      <div class="todo-container-stack js-task-in-stack" task-id="${element.id}">
        <div class="task-name" id="taskNameId${element.id}">${element.name}</div>
        <button class="task-done-button js-task-done-button" task-id="${element.id}">Выполнено</button>
        <button class="delete-task-button js-delete-task-button" task-id="${element.id}">Удалить</button>
      </div>
    `;
  });
  stackListElement.innerHTML = html;

  checkInputStackAvailable();
  updateSizeStack();

  // Добавляем обработчики событий для кнопок удаления
  const deleteTaskButtonElements = document.querySelectorAll('.js-delete-task-button');
  deleteTaskButtonElements.forEach(button => {
    button.addEventListener('click', (event => {
      const taskId = Number(event.target.getAttribute('task-id'));
      removeTaskfromStack(taskId);
    }));
  });

  // Добавляем обработчики событий для кнопок "Выполнено"
  const doneTasksButtonElements = document.querySelectorAll('.js-task-done-button');
  doneTasksButtonElements.forEach(button => {
    button.addEventListener('click', (event => {
      const taskId = Number(event.target.getAttribute('task-id'));
      completeTaskInStack(taskId);
    }));
  });
};

// добавление новой задачи в стек
function addTaskToStack(taskName) {
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
    name: taskName
  };
  stackList.push(newTask);
  renderStackList();
  inputElement.value = '';
}

// удаление задачи из стека
function removeTaskfromStack(taskId) {
  deleteTaskFromStackList(taskId);
  renderStackList();
}

// пометка задачи как выполненной в стеке
function completeTaskInStack(taskId) {
  const taskNameElement = document.getElementById(`taskNameId${taskId}`);
  taskNameElement.style.textDecoration = 'line-through';
  setTimeout(() => {
    removeTaskfromStack(taskId);
  }, 1000);
}

// Скрываем плюсик при фокусе на поле ввода
inputElement.addEventListener('focus', () => {
  placeholderImage.classList.add('unvisible-input-img');
  inputElement.classList.add('input-active');
  addToStackButtonElement.style.display = 'block';
});

// Показываем изображение, если поле ввода пустое и не в фокусе
inputElement.addEventListener('blur', () => {
  if (inputElement.value === '') {
    placeholderImage.classList.remove('unvisible-input-img');
    inputElement.classList.remove('input-active');
    addToStackButtonElement.style.display = 'none';
  }
});

// добавление задачи в стэк при нажатии кнопки или enter
addToStackButtonElement.addEventListener('click', () => {
  const newTask = inputElement.value;
  if (newTask !== '') {
    addTaskToStack(newTask);
  }
});

inputElement.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const newTask = inputElement.value;
    if (newTask !== '') {
      addTaskToStack(newTask);
    }
  }
});

// Функция для генерации уникального идентификатора дня
const generateDayId = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Функция для генерации блока дня
const generateDayBlock = (date) => {
  const dayId = generateDayId(date);
  const dayOfWeek = new Intl.DateTimeFormat('ru-RU', { weekday: 'long' }).format(date);
  const dateWithoutYear = new Intl.DateTimeFormat('ru-RU', {
    month: 'long', 
    day: 'numeric' 
  }).format(date);
  // Форматируем год без "г."
  const year = new Intl.DateTimeFormat('en-US', {
    year: 'numeric'
  }).format(date);

  const formattedDate = `${dateWithoutYear} ${year}`;

  return `
    <div class="day-container" data-day-id="${dayId}">
      <div class="day-container-header">
        <div class="day-title">
          <div class="date">${formattedDate}</div>
          <div class="day-of-week">${dayOfWeek}</div>
        </div>
        <div class="add-todo-to-day">
          <input class="input-todo-day" type="text" placeholder="Добавить задачу" id=${dayId}></input>
          <img class="add-todo-day-icon" src="../static/icons/add-todo-icon.svg" style="display: none;">
          <button class="add-todo-day-button" style="display: none;">
            <img class="add-todo-day-button-icon" src="../static/icons/add-todo-to-stack-icon.svg">
          </button>
        </div>
      </div>
      <div class="todo-day-list js-todo-day-list" data-day-id="${dayId}"></div>
    </div>
  `;
};



document.querySelectorAll('.input-todo-day').forEach(inputElement => {
  inputElement.addEventListener('keydown', (event) => {
    const newTask = inputElement.value;
    const dayId = inputElement.id;
    if (event.key === 'Enter') {
      const newTask = inputElement.value;
      console.log(newTask);
      if (newTask !== '') {
        addTaskToTaskList(newTask, dayId);
        inputElement.value = ''; // Очищаем поле ввода
        renderTaskList(dayId); // Обновляем список задач для этого дня
      }
    }
  });
});

// Функция для генерации недели (7 дней)
const generateWeek = (startDate) => {
  let weekHTML = '';
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    weekHTML += generateDayBlock(currentDate);
  }
  return weekHTML;
};

// Обработчик событий для календаря
const calendar = document.getElementById('airdatepicker');
calendar.addEventListener('change', (event) => {
  const selectedDate = new Date(event.target.value);
  const dynamicDaysContainer = document.getElementById('dynamic-days-container');
  dynamicDaysContainer.innerHTML = ''; // Очищаем контейнер
  const weekHTML = generateWeek(selectedDate);
  dynamicDaysContainer.innerHTML = weekHTML; // Добавляем 7 дней

  // После добавления дней, инициализируем рендеринг задач
  document.querySelectorAll('.day-container').forEach(dayContainer => {
    const dayId = dayContainer.getAttribute('data-day-id');
    renderTaskList(dayId);
  });
});

// Инициализация: генерируем 7 дней для текущей даты
const todayDate = new Date();
const dynamicDaysContainer = document.getElementById('dynamic-days-container');
dynamicDaysContainer.innerHTML = generateWeek(todayDate);

// Обработчик событий для добавления задач по нажатию Enter
document.querySelector('main').addEventListener('keydown', (event) => {
  if (event.target.classList.contains('input-todo-day') && event.key === 'Enter') {
    const dayContainer = event.target.closest('.day-container');
    const dayId = dayContainer.getAttribute('data-day-id');
    const newTask = event.target.value;

    if (newTask !== '') {
      addTaskToTaskList(newTask, dayId);
      event.target.value = ''; // Очищаем поле ввода
    }
  }
});

// Функция для рендеринга задач для указанного дня
export async function renderTaskList(dayId) {
  const taskListElement = document.querySelector(`.js-todo-day-list[data-day-id="${dayId}"]`);
  const tasks = await fetchTasksFromDB(dayId);
  let html = ``;
  tasks.forEach((element) => {
    html += `
      <div class="todo-day-container js-task-in-day" task-id="${element._id}" day-id="${dayId}">
        <div class="task-name" id="taskNameId${element._id}">${element.title}</div>
        <button class="task-done-button js-task-done-button-day" task-id="${element._id}">Выполнено</button>
        <button class="delete-task-button js-delete-task-button-day" task-id="${element._id}">Удалить</button>
      </div>
    `;
  });
  taskListElement.innerHTML = html;

  // Добавляем обработчики событий для кнопок удаления
  const deleteTaskButtonElements = taskListElement.querySelectorAll('.js-delete-task-button-day');
  deleteTaskButtonElements.forEach(button => {
    button.addEventListener('click', (event => {
      const taskId = event.target.getAttribute('task-id');
      const dayId = event.target.closest('.js-task-in-day').getAttribute('day-id');
      removeTaskfromTaskList(taskId, dayId);
    }));
  });

  // Добавляем обработчики событий для кнопок "Выполнено"
  const doneTasksButtonElements = taskListElement.querySelectorAll('.js-task-done-button-day');
  doneTasksButtonElements.forEach(button => {
    button.addEventListener('click', (event => {
      const taskId = event.target.getAttribute('task-id');
      const dayId = event.target.closest('.js-task-in-day').getAttribute('day-id');
      completeTaskInTaskList(taskId, dayId);
    }));
  });
}

// Обработчик событий для полей ввода задач в календаре
document.querySelectorAll('.input-todo-day').forEach(input => {
  input.addEventListener('focus', () => {
    const addButton = input.nextElementSibling; // Предполагаем, что кнопка добавления следует за полем ввода
    addButton.style.display = 'block';
  });

  input.addEventListener('blur', () => {
    if (input.value === '') {
      const addButton = input.nextElementSibling;
      addButton.style.display = 'none';
    }
  });
});

export async function fetchTasksFromDB(dayId) {
  const token = localStorage.getItem('access_token'); // Получаем токен из localStorage
  const response = await fetch(`http://127.0.0.1:8000/tasks/day/${dayId}`, {
    headers: {
      'Authorization': `Bearer ${token}`, // Передаем токен в заголовках
    },
  });
  if (response.ok) {
    const tasks = await response.json();
    return tasks;
  } else {
    console.error('Failed to fetch tasks');
    return [];
  }
}