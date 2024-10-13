let dailyGoal = 0;
let totalConsumed = 0;
const today = new Date().toLocaleDateString();
const canvas = document.getElementById('progress-slider');
const ctx = canvas.getContext('2d');
const radius = 100;
const centerX = canvas.width / 2;
const centerY = canvas.height;

window.onload = loadTodayData;

document.getElementById('add-food').addEventListener('click', addFood);
document.getElementById('calorie-goal').addEventListener('input', setGoal);
document.getElementById('view-history').addEventListener('click', toggleHistory);
document.getElementById('toggle-theme').addEventListener('click', toggleDarkMode);
document.getElementById('show-trend').addEventListener('click', showTrend);

if ('Notification' in window && Notification.permission !== 'granted') {
  Notification.requestPermission();
}

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
    const listItem = document.createElement('li');
    listItem.textContent = `${foodItem} - ${calories} calories`;
    document.getElementById('food-list').appendChild(listItem);
    saveData();
    updateDisplay();
    drawProgress();
  }
}

function updateDisplay() {
  document.getElementById('goal-display').textContent = dailyGoal;
  document.getElementById('consumed-display').textContent = totalConsumed;
  document.getElementById('remaining-display').textContent = Math.max(dailyGoal - totalConsumed, 0);
}

function drawProgress() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 15;
  ctx.stroke();
  const progress = Math.min(totalConsumed / dailyGoal, 1);
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, Math.PI, Math.PI + progress * Math.PI);
  ctx.strokeStyle = '#28a745';
  ctx.lineWidth = 15;
  ctx.stroke();
}

function saveData() {
  const data = {
    goal: dailyGoal,
    consumed: totalConsumed,
  };
  localStorage.setItem(today, JSON.stringify(data));
}

function loadTodayData() {
  const data = JSON.parse(localStorage.getItem(today));
  if (data) {
    dailyGoal = data.goal;
    totalConsumed = data.consumed;
    updateDisplay();
    drawProgress();
  }
}

function toggleDarkMode() {
  document.body.classList.toggle('dark');
}

function showTrend() {
  const ctx = document.getElementById('calorie-trend-chart').getContext('2d');
  const dates = [];
  const calories = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const data = JSON.parse(localStorage.getItem(key));
    dates.push(key);
    calories.push(data.consumed);
  }
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: 'Calories Consumed',
        data: calories,
        borderColor: 'green',
        fill: false,
      }],
    },
  });
  document.getElementById('chart-container').style.display = 'block';
}

function sendReminder() {
  if (Notification.permission === 'granted') {
    new Notification('Don’t forget to log your meals!');
  }
}
setInterval(sendReminder, 4 * 60 * 60 * 1000);
