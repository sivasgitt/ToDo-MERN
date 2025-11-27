import { useEffect, useState } from "react";

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDesciption] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(-1);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDesciption] = useState("");

  const apiUrl = "http://localhost:8000";

  useEffect(() => {
    getItems();
  }, []);

  const getItems = () => {
    fetch(apiUrl + "/todos")
      .then((res) => res.json())
      .then((res) => setTodos(res));
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
          if (res.ok) {
            setTodos([...todos, { title, description }]);
            setTitle("");
            setDesciption("");
            setMessage("Item added successfully");
            setTimeout(() => setMessage(""), 3000);
          } else {
            setError("Unable to create Todo item");
          }
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
          if (res.ok) {
            const updatedTodos = todos.map((item) => {
              if (item._id === editId) {
                item.title = editTitle;
                item.description = editDescription;
              }
              return item;
            });
            setTodos(updatedTodos);
            setEditTitle("");
            setEditDesciption("");
            setMessage("Item updated successfully");
            setTimeout(() => setMessage(""), 3000);
            setEditId(-1);
          } else {
            setError("Unable to update Todo item");
          }
        })
        .catch(() => setError("Unable to update Todo item"));
    }
  };

  const handleEditCancel = () => setEditId(-1);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure want to delete?")) {
      fetch(apiUrl + "/todos/" + id, { method: "DELETE" }).then(() => {
        const updatedTodos = todos.filter((item) => item._id !== id);
        setTodos(updatedTodos);
      });
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="text-center p-3 mb-4 bg-info text-dark rounded">
        <h1 className="fw-bold">To-Do Project with DBMS</h1>
      </div>

      {/* Add Item Section */}
      <div className="card shadow-sm p-4 mb-4">
        <h3 className="mb-3">Add Item</h3>
        {message && <p className="text-success">{message}</p>}
        <div className="row g-2">
          <div className="col-md-4">
            <input
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              className="form-control"
              type="text"
            />
          </div>
          <div className="col-md-6">
            <input
              placeholder="Description"
              onChange={(e) => setDesciption(e.target.value)}
              value={description}
              className="form-control"
              type="text"
            />
          </div>
          <div className="col-md-2 d-grid">
            <button className="btn btn-dark" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
        {error && <p className="text-danger mt-2">{error}</p>}
      </div>

      {/* Tasks Section */}
      <div className="card shadow-sm p-4">
        <h3 className="mb-3">Tasks</h3>
        <ul className="list-group">
          {todos.map((item) => (
            <li
              key={item._id}
              className="list-group-item bg-info d-flex justify-content-between align-items-center my-2"
            >
              <div className="flex-grow-1">
                {editId === -1 || editId !== item._id ? (
                  <>
                    <span className="fw-bold">{item.title}</span>
                    <br />
                    <span>{item.description}</span>
                  </>
                ) : (
                  <div className="row g-2">
                    <div className="col-md-5">
                      <input
                        placeholder="Title"
                        onChange={(e) => setEditTitle(e.target.value)}
                        value={editTitle}
                        className="form-control"
                        type="text"
                      />
                    </div>
                    <div className="col-md-5">
                      <input
                        placeholder="Description"
                        onChange={(e) => setEditDesciption(e.target.value)}
                        value={editDescription}
                        className="form-control"
                        type="text"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="d-flex gap-2">
                {editId === -1 ? (
                  <>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={handleUpdate}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={handleEditCancel}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
