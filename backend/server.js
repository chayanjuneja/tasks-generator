const express = require("express");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Load data
function loadData() {
  const raw = fs.readFileSync("data.json");
  return JSON.parse(raw);
}

// Save data
function saveData(data) {
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
}

// Status route
app.get("/status", (req, res) => {
  res.json({
    backend: "ok",
    database: "ok",
    llm: "mocked"
  });
});

// Generate route (mock for now)
app.post("/generate", (req, res) => {
  const { goal, users, constraints } = req.body;

 if (!goal || !users) {
  return res.status(400).json({
    error: "Goal and users are required"
  });
}

if (goal.length < 5) {
  return res.status(400).json({
    error: "Goal must be at least 5 characters"
  });
}

if (/^\d+$/.test(goal) || /^\d+$/.test(users)) {
  return res.status(400).json({
    error: "Please enter meaningful text, not just numbers"
  });
}


  const result = {
    userStories: [
      `As a ${users}, I want ${goal}`,
      `As a ${users}, I want a simple interface`,
      `As a ${users}, I want fast performance`
    ],
    tasks: [
      "Create database schema",
      "Build API endpoints",
      "Implement frontend form",
      "Connect frontend to backend",
      "Add export feature"
    ]
  };

  // Save to last 5 specs
  const data = loadData();
  data.specs.unshift({ goal, users, constraints, result });

  if (data.specs.length > 5) {
    data.specs = data.specs.slice(0, 5);
  }

  saveData(data);

  res.json(result);
});

// History route
app.get("/history", (req, res) => {
  const data = loadData();
  res.json(data.specs);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});