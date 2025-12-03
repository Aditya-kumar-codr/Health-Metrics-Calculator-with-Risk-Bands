const bmiCalcBtn = document.getElementById("bmiCalcBtn");

if (bmiCalcBtn) {
  bmiCalcBtn.addEventListener("click", (event) => {
    // If the button were inside a form, stopping default navigation is safe.
    if (event && typeof event.preventDefault === "function")
      event.preventDefault();

    const heightRaw = document.getElementById("height").value;
    const weightRaw = document.getElementById("weight").value;
    const unit = document.getElementById("heightUnit")?.value || "cm";
    const outputEl = document.getElementById("bmiOutput");

    const height = parseFloat(heightRaw);
    const weight = parseFloat(weightRaw);

    if (!isFinite(height) || !isFinite(weight) || height <= 0 || weight <= 0) {
      outputEl.textContent = "Please enter valid positive numbers for height and weight.";
      outputEl.style.marginTop = "20px";
      outputEl.style.color = "red";
      return;
    }

    let heightMeters = height;
    // Convert based on explicit unit selection
    if (unit === "cm") {
      heightMeters = height / 100;
    } else if (unit === "m") {
      heightMeters = height;
    }

    const bmiValue = weight / (heightMeters * heightMeters);
    const bmi = bmiValue.toFixed(2);

    let message = `Your BMI is ${bmi}. `;
    if (bmiValue < 18.5) message += "You're underweight.";
    else if (bmiValue < 25) message += "You're in the normal range.";
    else if (bmiValue < 30) message += "You're overweight.";
    else message += "You're in the obese range.";

    outputEl.style.marginTop = "20px";
    outputEl.textContent = message;
  });
}

//bmr calculator
const bmrCalcBtn = document.getElementById("bmrCalcBtn");

if (bmrCalcBtn) {
  const age = document.getElementById("age");
  const height = document.getElementById("height");
  const weight = document.getElementById("weight");
  const bmrOutput = document.getElementById("bmrOutput");

  bmrCalcBtn.addEventListener("click", () => {
    const gender = document.querySelector('input[name="gender"]:checked');
    const selectedGender = gender ? gender.value : null;

    // Ensure values are present before calculation
    if (!age.value || !height.value || !weight.value || !selectedGender) {
      bmrOutput.textContent = "Please enter valid positive numbers for height and weight.";
      bmrOutput.style.marginTop = "20px";
      bmrOutput.style.color = "red";
      return;
    }

    let bmrValue;
    if (selectedGender === "male") {
      bmrValue = 10 * weight.value + 6.25 * height.value - 5 * age.value + 5;
    } else {
      bmrValue = 10 * weight.value + 6.25 * height.value - 5 * age.value - 161;
    }
    const bmr = bmrValue.toFixed(2);
    let message2 = `Your BMR is ${bmr}.`;
    if (selectedGender === "male")
      message2 +=
        "The normal range for men is between 1600 and 1800 calories per day.";
    else
      message2 +=
        "The normal range for women is between 1300 and 1500 calories per day.";

    // Apply margin-top to the output element
    bmrOutput.style.marginTop = "20px";
    bmrOutput.textContent = message2;
  });
}
