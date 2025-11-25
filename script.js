const bmiCalcBtn = document.getElementById("bmiCalcBtn");
bmiCalcBtn.addEventListener("click", (event) => {
  // If the button were inside a form, stopping default navigation is safe.
  if (event && typeof event.preventDefault === 'function') event.preventDefault();

  const heightRaw = document.getElementById("height").value;
  const weightRaw = document.getElementById("weight").value;
  const unit = document.getElementById("heightUnit")?.value || 'cm';
  const outputEl = document.getElementById("bmiOutput");

  const height = parseFloat(heightRaw);
  const weight = parseFloat(weightRaw);

  if (!isFinite(height) || !isFinite(weight) || height <= 0 || weight <= 0) {
    outputEl.textContent = "Please enter valid positive height and weight.";
    return;
  }

  let heightMeters = height;
  // Convert based on explicit unit selection
  if (unit === 'cm') {
    heightMeters = height / 100;
  } else if (unit === 'm') {
    heightMeters = height;
  }

  if (!isFinite(heightMeters) || heightMeters <= 0) {
    outputEl.textContent = "Height must be a positive number.";
    return;
  }

  const bmiValue = weight / (heightMeters * heightMeters);
  const bmi = bmiValue.toFixed(2);

  let message = `Your BMI is ${bmi}. `;
  if (bmiValue < 18.5) message += "You're underweight.";
  else if (bmiValue < 25) message += "You're in the normal range.";
  else if (bmiValue < 30) message += "You're overweight.";
  else message += "You're in the obese range.";

  outputEl.textContent = message;
});

