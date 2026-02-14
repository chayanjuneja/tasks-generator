import { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, Link } from "react-router-dom";

const API_URL = "https://tasks-generator-backend-rar9.onrender.com";

function StatusPage() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/status`)
      .then((res) => res.json())
      .then((data) => setStatus(data));
  }, []);

  if (!status) return <div>Loading...</div>;

  return (
  <div
    style={{
      minHeight: "100vh",
      background: "#f3f4f6",
      padding: "40px 20px",
      fontFamily: "Inter, Arial, sans-serif",
    }}
  >
    <div
      style={{
        maxWidth: 500,
        margin: "0 auto",
        background: "#ffffff",
        padding: 30,
        borderRadius: 12,
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
      }}
    >
      <h1>Status</h1>
      <p style={{ marginTop: 15 }}>Backend: {status.backend}</p>
      <p>Database: {status.database}</p>
      <p>LLM: {status.llm}</p>

      <Link
        to="/"
        style={{
          display: "inline-block",
          marginTop: 20,
          textDecoration: "none",
          color: "white",
          background: "#4f46e5",
          padding: "10px 16px",
          borderRadius: 8,
        }}
      >
        Back to Home
      </Link>
    </div>
  </div>
);
}

function HomePage() {
  const [goal, setGoal] = useState("");
  const [users, setUsers] = useState("");
  const [constraints, setConstraints] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [template, setTemplate] = useState("");

  const loadHistory = async () => {
    const res = await axios.get(`${API_URL}/history`);
    setHistory(res.data);
  };

  const handleGenerate = async () => {
    try {
      const res = await axios.post(`${API_URL}/generate`, {
        goal,
        users,
        constraints,
      });
      setResult(res.data);
      loadHistory();
    } catch (err) {
      alert("Error generating tasks");
    }
  };
  const clearForm = () => {
  setGoal("");
  setUsers("");
  setConstraints("");
  setResult(null);
};

const inputStyle = {
    display: "block",
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    fontSize: 14,
    boxSizing: "border-box",
  };

  const exportMarkdown = () => {
    if (!result) return;

    let text = "## User Stories\n";
    result.userStories.forEach((s) => {
      text += `- ${s}\n`;
    });

    text += "\n## Tasks\n";
    result.tasks.forEach((t) => {
      text += `- ${t}\n`;
    });

    navigator.clipboard.writeText(text);
    alert("Copied as Markdown!");
  };

  const applyTemplate = (type) => {
  setTemplate(type);

  if (type === "web") {
    setGoal("Build a dashboard feature");
    setUsers("Web users");
    setConstraints("Responsive, fast load time");
  }

  if (type === "mobile") {
    setGoal("Add offline note-taking");
    setUsers("Mobile users");
    setConstraints("Low data usage, fast sync");
  }

  if (type === "internal") {
    setGoal("Create employee reporting tool");
    setUsers("Internal staff");
    setConstraints("Secure access, simple UI");
  }
};

  return (
    <div
  style={{
    minHeight: "100vh",
    background: "#f3f4f6",
    padding: "40px 20px",
    fontFamily: "Inter, Arial, sans-serif",
  }}
>
  <div
    style={{
      maxWidth: 720,
      margin: "0 auto",
      background: "#ffffff",
      padding: 30,
      borderRadius: 12,
      boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    }}
  >
      <h1 style={{ marginBottom: 5 }}>Tasks Generator</h1>
<p style={{ color: "#6b7280", marginBottom: 20 }}>
  Generate user stories and engineering tasks from a feature idea.
</p>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
  <Link
    to="/status"
    style={{
      textDecoration: "none",
      background: "#e5e7eb",
      color: "#111827",
      padding: "6px 12px",
      borderRadius: 6,
      fontSize: 13,
      fontWeight: 500,
    }}
  >
    Status
  </Link>
</div>

      <div
  style={{
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  }}
>

        <select
  value={template}
  onChange={(e) => applyTemplate(e.target.value)}
  style={inputStyle}
>
  <option value="">Select Template (optional)</option>
  <option value="web">Web App</option>
  <option value="mobile">Mobile App</option>
  <option value="internal">Internal Tool</option>
</select>
        <input
          placeholder="Goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Users"
          value={users}
          onChange={(e) => setUsers(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Constraints"
          value={constraints}
          onChange={(e) => setConstraints(e.target.value)}
         style={inputStyle}
        />

        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
  <button
    onClick={handleGenerate}
    style={{
      padding: "12px 20px",
      background: "#4f46e5",
      color: "white",
      border: "none",
      borderRadius: 8,
      cursor: "pointer",
      fontWeight: 600,
    }}
  >
    Generate Tasks
  </button>

  <button
    onClick={clearForm}
    style={{
      padding: "12px 20px",
      background: "#e5e7eb",
      color: "#111827",
      border: "none",
      borderRadius: 8,
      cursor: "pointer",
      fontWeight: 600,
    }}
  >
    Clear Form
  </button>
</div>
      </div>

      {result && (
        <div>
          <button
  onClick={exportMarkdown}
  style={{
    padding: "10px 16px",
    background: "#111827",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    marginBottom: 15,
  }}
>
  Export as Markdown
</button>

          <h2 style={{ marginTop: 30, marginBottom: 10 }}>
  User Stories
</h2>
          <ul>
            {result.userStories.map((story, i) => (
              <li key={i}>
                <input
  value={story}
  onChange={(e) => {
    const updated = { ...result };
    updated.userStories[i] = e.target.value;
    setResult(updated);
  }}
  style={{
    width: "100%",
    padding: 8,
    borderRadius: 6,
    border: "1px solid #e5e7eb",
  }}
/>
              </li>
            ))}
          </ul>

          <h2>Tasks</h2>
          <ul>
            {result.tasks.map((task, i) => (
              <li key={i}>
                <input
  value={task}
  onChange={(e) => {
    const updated = { ...result };
    updated.tasks[i] = e.target.value;
    setResult(updated);
  }}
  style={{
    width: "100%",
    padding: 8,
    borderRadius: 6,
    border: "1px solid #e5e7eb",
  }}
/>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {result && (
  <>
    <h2 style={{ marginTop: 30 }}>Risks / Unknowns</h2>
    <ul>
      <li>Performance under high load</li>
      <li>Edge cases in user input</li>
      <li>Integration or API limitations</li>
    </ul>
  </>
)}

      {history.length > 0 && (
  <>
    <h2 style={{ marginTop: 30 }}>Last 5 Specs</h2>
    <ul>
      {history.map((item, i) => (
        <li key={i}>
          <strong>{item.goal}</strong> for {item.users}
        </li>
      ))}
    </ul>
  </>
)}
    </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/status" element={<StatusPage />} />
    </Routes>
  );
}

export default App;
