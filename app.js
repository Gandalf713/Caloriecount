let dailyGoal = 0;
let totalConsumed = 0;

document.getElementById('add-food').addEventListener('click', addFood);
document.getElementById('calorie-goal').addEventListener('input', setGoal);

function setGoal() {
  const goal = document.getElementById('calorie-goal').value;
  dailyGoal = parseInt(goal) || 0;
  updateDisplay();
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
    clearInputs();
  }
}

function updateDisplay() {
  document.getElementById('goal-display').textContent = dailyGoal;
  document.getElementById('consumed-display').textContent = totalConsumed;
  document.getElementById('remaining-display').textContent = dailyGoal - totalConsumed;
}

function clearInputs() {
  document.getElementById('food-item').value = '';
  document.getElementById('calories-consumed').value = '';
}
