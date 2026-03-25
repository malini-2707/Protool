const API_URL = "http://127.0.0.1:5000/api";

// ✅ FETCH PROJECTS
export const fetchProjects = async () => {
  const res = await fetch(`${API_URL}/projects`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to load projects");
  }

  return res.json();
};

// ✅ CREATE PROJECT
export const createProject = async (name) => {
  const res = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    throw new Error("Failed to create project");
  }

  return res.json();
};
