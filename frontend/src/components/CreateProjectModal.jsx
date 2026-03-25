import { useState } from "react";
import { createProject } from "../api";

export default function CreateProjectModal({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;

    try {
      setLoading(true);
      await createProject(name);

      onCreated();   // 🔥 TELL DASHBOARD TO REFRESH
      onClose();     // 🔥 CLOSE MODAL
    } catch (err) {
      alert("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Create Project</h2>

        <input
          type="text"
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleCreate} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
