let dailyGoal = 0;
let totalConsumed = 0;
const today = new Date().toLocaleDateString(); // Today's date as the key

const canvas = document.getElementById('progress-slider');
const ctx = canvas.getContext('2d');
const radius = 100;
const centerX = canvas.width / 2;
const centerY = canvas.height;

window.onload = loadTodayData;

document.getElementById('add-food').addEventListener('click', addFood);
document.getElementById('calorie-goal').addEventListener('input', setGoal);
document.getElementById('view-history').addEventListener('click', toggleHistory);
document.getElementById('view-chart').addEventListener('click', toggleChart);
document.getElementById('enable-notifications').addEventListener('click', enableNotifications);

function setGoal() {
  const goal = document.getElementById('calorie-goal').value;
  dailyGoal = parseInt(goal) || 0;
  saveData();
  updateDisplay();
  drawProgress();
}

function addFood() {
  const foodItem = document.getElementById('food-item').value;
  const calories = parseInt(document.getElementById('calories-consumed').value) || 0;

  if (foodItem && calories) {
    totalConsumed += calories;

    const foodList = document.getElementById('food-list');
    const listItem = document.createElement('li');
    listItem.textContent = `${foodItem} - ${calories} calories`;
    listItem.addEventListener('click', () => deleteFood(listItem, calories));
    foodList.appendChild(listItem);

    saveData();
    updateDisplay();
    drawProgress();
    clearInputs();
  }
}

function deleteFood(listItem, calories) {
  totalConsumed -= calories;
  listItem.remove();
  saveData();
  updateDisplay();
  drawProgress();
}

function updateDisplay() {
  document.getElementById('goal-display').textContent = dailyGoal;
  document.getElementById('consumed-display').textContent = totalConsumed;
  const remaining = Math.max(dailyGoal - totalConsumed, 0);
  document.getElementById('remaining-display').textContent = remaining;
}

function clearInputs() {
  document.getElementById('food-item').value = '';
  document.getElementById('calories-consumed').value = '';
}

function drawProgress() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 15;
  ctx.stroke();

  const progress = Math.min(totalConsumed / dailyGoal, 1);
  const endAngle = Math.PI + progress * Math.PI;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, Math.PI, endAngle);
  ctx.strokeStyle = '#28a745';
  ctx.lineWidth = 15;
  ctx.stroke();
}

function saveData() {
  const data = {
    goal: dailyGoal,
    consumed: totalConsumed,
    foods: Array.from(document.querySelectorAll('#food-list li')).map(item => item.textContent)
  };
  localStorage.setItem(today, JSON.stringify(data));
}

function loadTodayData() {
  const data = JSON.parse(localStorage.getItem(today));
  if (data) {
    dailyGoal = data.goal;
    totalConsumed = data.consumed;

    data.foods.forEach(food => {
      const foodList = document.getElementById('food-list');
      const listItem = document.createElement('li');
      listItem.textContent = food;
      listItem.addEventListener('click', () => deleteFood(listItem, parseCaloriesFromEntry(food)));
      foodList.appendChild(listItem);
    });

    updateDisplay();
    drawProgress();
  }
}

function parseCaloriesFromEntry(entry) {
  const calories = entry.match(/\d+/);
  return calories ? parseInt(calories[0]) : 0;
}

function toggleHistory() {
  const historyDiv = document.getElementById('history');
  historyDiv.style.display = historyDiv.style.display === 'none' ? 'block' : 'none';
  loadHistory();
}

function loadHistory() {
  const historyList = document.getElementById('history-list');
  historyList.innerHTML = '';

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key !== today) {
      const data = JSON.parse(localStorage.getItem(key));
      const listItem = document.createElement('li');
      listItem.innerHTML = `<strong>${key}:</strong> Goal: ${data.goal}, Consumed: ${data.consumed} calories`;
      historyList.appendChild(listItem);
    }
  }
}

function toggleChart() {
  const chartContainer = document.getElementById('chart-container');
  chartContainer.classList.toggle('show');
  loadChart();
}

function loadChart() {
  const dates = [];
  const consumedCalories = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const data = JSON.parse(localStorage.getItem(key));
    dates.push(key);
    consumedCalories.push(data.consumed);
  }

  const ctx = document.getElementById('calorie-chart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: 'Calories Consumed',
        data: consumedCalories,
        borderColor: 'green',
        backgroundColor: 'rgba(0, 128, 0, 0.1)',
        borderWidth: 2,
        fill: true,
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function enableNotifications() {
  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        alert('Notifications enabled!');
        scheduleReminders();
      }
    });
  }
}

function scheduleReminders() {
  setInterval(() => {
    if (Notification.permission === 'granted') {
      new Notification('Don’t forget to log your meals today!');
    }
  }, 4 * 60 * 60 * 1000);
}