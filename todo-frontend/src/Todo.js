import { useEffect, useState } from "react";

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDesciption] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDesciption] = useState("");

  const apiUrl = "https://todo-backend-lg4s.onrender.com";

  useEffect(() => {
    getItems();
  }, []);

  const getItems = () => {
    fetch(apiUrl + "/todos")
      .then((res) => res.json())
      .then((res) => {
        if (Array.isArray(res)) {
          setTodos(res);
        } else {
          console.error("Unexpected response:", res);
          setTodos([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setTodos([]);
      });
  };

  const handleSubmit = () => {
    setError("");
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiUrl + "/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed");
          }
          return res.json();
        })
        .then((newTodo) => {
          setTodos([...todos, newTodo]);
          setTitle("");
          setDesciption("");
          setMessage("Item added successfully");
          setTimeout(() => setMessage(""), 3000);
        })
        .catch(() => setError("Unable to create Todo item"));
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDesciption(item.description);
  };

  const handleUpdate = () => {
    setError("");
    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      fetch(apiUrl + "/todos/" + editId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed");
          }
          return res.json();
        })
        .then((updatedTodoFromServer) => {
          const updatedTodos = todos.map((item) =>
            item._id === editId ? updatedTodoFromServer : item
          );
          setTodos(updatedTodos);
          setEditTitle("");
          setEditDesciption("");
          setMessage("Item updated successfully");
          setTimeout(() => setMessage(""), 3000);
          setEditId(null);
        })
        .catch(() => setError("Unable to update Todo item"));
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditTitle("");
    setEditDesciption("");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure want to delete?")) {
      fetch(apiUrl + "/todos/" + id, { method: "DELETE" })
        .then((res) => {
          if (!res.ok && res.status !== 204) {
            throw new Error("Failed");
          }
          const updatedTodos = todos.filter((item) => item._id !== id);
          setTodos(updatedTodos);
        })
        .catch(() => setError("Unable to delete Todo item"));
    }
  };

  return (
    <div>
      <h1>Todo List</h1>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDesciption(e.target.value)}
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>

      <div>
        {todos.map((item) => (
          <div key={item._id}>
            {editId === item._id ? (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDesciption(e.target.value)}
                />
                <button onClick={handleUpdate}>Update</button>
                <button onClick={handleEditCancel}>Cancel</button>
              </>
            ) : (
              <>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
