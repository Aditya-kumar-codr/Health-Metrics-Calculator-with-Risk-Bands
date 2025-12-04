// === BMI Calculator ===
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
      outputEl.textContent =
        "Please enter valid positive numbers for height and weight.";
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
    // Save BMI to localStorage
    localStorage.setItem("savedBMI", bmi);

    // Save BMI history (last 5 calculations)
    let bmiHistory = JSON.parse(localStorage.getItem("bmiHistory")) || [];
    bmiHistory.unshift({
      value: bmi,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    });
    // Keep only last 5 calculations
    if (bmiHistory.length > 5) {
      bmiHistory = bmiHistory.slice(0, 5);
    }
    localStorage.setItem("bmiHistory", JSON.stringify(bmiHistory));

    let message = `Your BMI is ${bmi}. `;
    if (bmiValue < 18.5) {
      message += "You're underweight.";
    } else if (bmiValue < 25) {
      message += "You're in the normal range.";
    } else if (bmiValue < 30) {
      message += "You're overweight.";
    } else {
      message += "You're in the obese range.";
    }

    outputEl.style.marginTop = "20px";
    outputEl.textContent = message;

    // Save BMI to localStorage for profile page
    localStorage.setItem("bmi", bmi);
    localStorage.setItem("bmiCategory", message);

    // Update health summary with both BMI and BMR if available
    const savedBMR = localStorage.getItem("bmr");
    const bmrMessage = localStorage.getItem("bmrMessage");
    let summary = `BMI: ${bmi}. `;

    if (savedBMR && bmrMessage) {
      summary += `BMR: ${savedBMR} calories/day. Combined health assessment: `;
      if (message.includes("normal")) {
        summary += "Your metrics indicate a healthy balance.";
      } else {
        summary +=
          "Consider consulting a healthcare professional for personalized advice.";
      }
    } else {
      // Only BMI available
      summary = `BMI: ${bmi}. ${message}`;
    }
    localStorage.setItem("summary", summary);
  });
}

// === BMR Calculator ===
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
      bmrOutput.textContent =
        "Please enter valid positive numbers for height and weight.";
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
    // Save BMR to localStorage
    localStorage.setItem("savedBMR", bmr);

    // Save BMR history (last 5 calculations)
    let bmrHistory = JSON.parse(localStorage.getItem("bmrHistory")) || [];
    bmrHistory.unshift({
      value: bmr,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    });
    // Keep only last 5 calculations
    if (bmrHistory.length > 5) {
      bmrHistory = bmrHistory.slice(0, 5);
    }
    localStorage.setItem("bmrHistory", JSON.stringify(bmrHistory));

    let message2 = `Your BMR is ${bmr}. `;

    if (selectedGender === "male") {
      message2 +=
        "The normal range for men is between 1600 and 1800 calories per day.";
    } else {
      message2 +=
        "The normal range for women is between 1300 and 1500 calories per day.";
    }

    bmrOutput.style.marginTop = "20px";
    bmrOutput.textContent = message2;

    // Save BMR to localStorage for profile page
    localStorage.setItem("bmr", bmr);
    localStorage.setItem("bmrMessage", message2);

    // Update health summary with both BMI and BMR if available
    const savedBMI = localStorage.getItem("bmi");
    const bmiCategory = localStorage.getItem("bmiCategory");
    let summary = `BMR: ${bmr} calories/day. `;

    if (savedBMI && bmiCategory) {
      summary += `BMI: ${savedBMI}. Combined health assessment: `;
      if (bmiCategory.includes("normal")) {
        summary += "Your metrics indicate a healthy balance.";
      } else {
        summary +=
          "Consider consulting a healthcare professional for personalized advice.";
      }
    }

    localStorage.setItem("summary", summary);
  });
}

// === Profile Page ===
// When page loads, fill all fields from localStorage
window.addEventListener("load", () => {
  // Basic profile
  document.getElementById("userName").textContent =
    localStorage.getItem("name") || "Your Name";

  document.getElementById("userAge").textContent =
    "Age: " + (localStorage.getItem("age") || "—");

  document.getElementById("userGender").textContent =
    "Gender: " + (localStorage.getItem("gender") || "—");

  // Saved metrics (we'll wire these later from BMI/BMR pages)
  document.getElementById("savedBMI").textContent =
    "Last BMI: " + (localStorage.getItem("bmi") || "—");

  document.getElementById("savedBMR").textContent =
    "Last BMR: " + (localStorage.getItem("bmr") || "—");

  // Display BMI history
  const bmiHistoryContainer = document.getElementById("bmiHistory");
  if (bmiHistoryContainer) {
    const bmiHistory = JSON.parse(localStorage.getItem("bmiHistory")) || [];
    if (bmiHistory.length > 0) {
      bmiHistoryContainer.innerHTML = "<h4>Recent BMI Calculations</h4>";
      const bmiList = document.createElement("ul");
      bmiList.className = "history-list";
      bmiHistory.forEach((entry, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<strong>${
          index + 1
        }.</strong> BMI: <span class="value">${
          entry.value
        }</span> - <span class="timestamp">${entry.date} ${entry.time}</span>`;
        bmiList.appendChild(listItem);
      });
      bmiHistoryContainer.appendChild(bmiList);
    } else {
      bmiHistoryContainer.innerHTML = "<p>No BMI calculations yet.</p>";
    }
  }

  // Display BMR history
  const bmrHistoryContainer = document.getElementById("bmrHistory");
  if (bmrHistoryContainer) {
    const bmrHistory = JSON.parse(localStorage.getItem("bmrHistory")) || [];
    if (bmrHistory.length > 0) {
      bmrHistoryContainer.innerHTML = "<h4>Recent BMR Calculations</h4>";
      const bmrList = document.createElement("ul");
      bmrList.className = "history-list";
      bmrHistory.forEach((entry, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<strong>${
          index + 1
        }.</strong> BMR: <span class="value">${
          entry.value
        }</span> cal/day - <span class="timestamp">${entry.date} ${
          entry.time
        }</span>`;
        bmrList.appendChild(listItem);
      });
      bmrHistoryContainer.appendChild(bmrList);
    } else {
      bmrHistoryContainer.innerHTML = "<p>No BMR calculations yet.</p>";
    }
  }

  document.getElementById("summaryText").textContent =
    localStorage.getItem("summary") ||
    "Your BMI & BMR summary will appear here once calculated.";
});

// Open popup
document.getElementById("editBtn").addEventListener("click", () => {
  document.getElementById("popupBg").style.display = "flex";
});

// Save profile
document.getElementById("saveBtn").addEventListener("click", () => {
  const name = document.getElementById("nameInput").value.trim();
  const age = document.getElementById("ageInput").value.trim();
  const gender = document.getElementById("genderInput").value;

  if (!name || !age || !gender) {
    alert("Please fill all fields.");
    return;
  }

  localStorage.setItem("name", name);
  localStorage.setItem("age", age);
  localStorage.setItem("gender", gender);

  // Close popup + refresh UI
  document.getElementById("popupBg").style.display = "none";
  document.getElementById("userName").textContent = name;
  document.getElementById("userAge").textContent = "Age: " + age;
  document.getElementById("userGender").textContent = "Gender: " + gender;
});

// Close popup if user clicks on the dark background
document.getElementById("popupBg").addEventListener("click", (e) => {
  if (e.target.id === "popupBg") {
    document.getElementById("popupBg").style.display = "none";
  }
});

// =======================
// Chart.js on Profile Page
// ================================
// Comparison Charts: BMI & BMR vs Normal
// ================================
(function createComparisonCharts() {
  // Wait for DOM + Chart.js to be ready
  window.addEventListener("load", () => {
    // Ensure saved keys exist (fallback to 0)
    const rawBMI = localStorage.getItem("savedBMI");
    const rawBMR = localStorage.getItem("savedBMR");
    const gender = (localStorage.getItem("gender") || "").toLowerCase();

    const userBMI = Number(rawBMI) || 0;
    const userBMR = Number(rawBMR) || 0;

    /* -------- BMI normal values --------
       Official normal BMI range: 18.5 - 24.9
       We'll show:
         - user's BMI
         - normalMin (18.5)
         - normalAvg (21.7) for quick visual center
         - normalMax (24.9)
    */
    const bmiNormalMin = 18.5;
    const bmiNormalMax = 24.9;
    const bmiNormalAvg = (bmiNormalMin + bmiNormalMax) / 2; // 21.7

    // BMI Chart
    const bmiCanvas = document.getElementById("bmiCompareChart");
    if (bmiCanvas) {
      const ctx = bmiCanvas.getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["You", "Normal Min", "Normal Avg", "Normal Max"],
          datasets: [{
            label: "BMI Comparison",
            data: [
              isNaN(userBMI) ? 0 : userBMI,
              bmiNormalMin,
              bmiNormalAvg,
              bmiNormalMax
            ],
            backgroundColor: [
              "#4dabf7", // user
              "#cfe9ff", // normal min
              "#89c2ff", // normal mid
              "#cfe9ff"  // normal max
            ],
            borderColor: [
              "#1c7ed6",
              "#8fbce8",
              "#5aa0e6",
              "#8fbce8"
            ],
            borderWidth: 1
          }]
        },
        options: {
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    }

    /* -------- BMR normal values --------
       Typical approximate ranges:
         - Men: 1600 - 1800 (avg 1700)
         - Women: 1300 - 1500 (avg 1400)
       If gender unknown, show both ranges' averages as separate bars for context.
    */
    const bmrMaleMin = 1600;
    const bmrMaleMax = 1800;
    const bmrMaleAvg = (bmrMaleMin + bmrMaleMax) / 2; //1700

    const bmrFemaleMin = 1300;
    const bmrFemaleMax = 1500;
    const bmrFemaleAvg = (bmrFemaleMin + bmrFemaleMax) / 2; //1400

    // BMR Chart
    const bmrCanvas = document.getElementById("bmrCompareChart");
    if (bmrCanvas) {
      const ctx2 = bmrCanvas.getContext("2d");

      if (gender === "male" || gender === "female") {
        // Use the single gender's normal range to compare
        const normMin = gender === "male" ? bmrMaleMin : bmrFemaleMin;
        const normAvg = gender === "male" ? bmrMaleAvg : bmrFemaleAvg;
        const normMax = gender === "male" ? bmrMaleMax : bmrFemaleMax;

        new Chart(ctx2, {
          type: "bar",
          data: {
            labels: ["You", "Normal Min", "Normal Avg", "Normal Max"],
            datasets: [{
              label: "BMR Comparison",
              data: [
                isNaN(userBMR) ? 0 : userBMR,
                normMin,
                normAvg,
                normMax
              ],
              backgroundColor: [
                "#ffa94d", // user
                "#ffe8cc",
                "#ffd09a",
                "#ffe8cc"
              ],
              borderColor: [
                "#f76707",
                "#e6a65a",
                "#f59a2f",
                "#e6a65a"
              ],
              borderWidth: 1
            }]
          },
          options: {
            plugins: {
              legend: { display: false }
            },
            scales: { y: { beginAtZero: true } }
          }
        });

      } else {
        // Gender unknown: show user's value plus both male & female averages for context
        new Chart(ctx2, {
          type: "bar",
          data: {
            labels: ["You", "Male Avg", "Female Avg"],
            datasets: [{
              label: "BMR Comparison (gender unknown)",
              data: [
                isNaN(userBMR) ? 0 : userBMR,
                bmrMaleAvg,
                bmrFemaleAvg
              ],
              backgroundColor: [
                "#ffa94d",
                "#ffe6d0",
                "#fff0d9"
              ],
              borderColor: [
                "#f76707",
                "#e6a65a",
                "#f1b86b"
              ],
              borderWidth: 1
            }]
          },
          options: {
            plugins: {
              legend: { display: false }
            },
            scales: { y: { beginAtZero: true } }
          }
        });
      }
    }
  }); // load
})(); // IIFE
