let dailyGoal = 0;
let totalConsumed = 0;

const canvas = document.getElementById('progress-slider');
const ctx = canvas.getContext('2d');
const radius = 100;
const centerX = canvas.width / 2;
const centerY = canvas.height;

// Event Listeners
document.getElementById('add-food').addEventListener('click', addFood);
document.getElementById('calorie-goal').addEventListener('input', setGoal);

function setGoal() {
  const goal = document.getElementById('calorie-goal').value;
  dailyGoal = parseInt(goal) || 0;
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
    foodList.appendChild(listItem);

    updateDisplay();
    drawProgress();
    clearInputs();
  }
}

function updateDisplay() {
  document.getElementById('goal-display').textContent = dailyGoal;
  document.getElementById('consumed-display').textContent = totalConsumed;
  document.getElementById('remaining-display').textContent = Math.max(dailyGoal - totalConsumed, 0);
}

function clearInputs() {
  document.getElementById('food-item').value = '';
  document.getElementById('calories-consumed').value = '';
}

function drawProgress() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background semicircle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 15;
  ctx.stroke();

  // Calculate progress angle
  const progress = Math.min(totalConsumed / dailyGoal, 1);
  const endAngle = Math.PI + progress * Math.PI;

  // Draw progress semicircle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, Math.PI, endAngle);
  ctx.strokeStyle = '#28a745';
  ctx.lineWidth = 15;
  ctx.stroke();
}
