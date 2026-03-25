const API_URL = "http://localhost:5000/api";

export async function fetchProjects() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/projects`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to load projects");
  }

  return res.json();
}

export async function createProject(name) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    throw new Error("Failed to create project");
  }

  return res.json();
}
