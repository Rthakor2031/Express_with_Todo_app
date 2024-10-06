import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  // Initial state for the form inputs
  const initialState = {
    title: '',
    completed: false,
    image: 'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?cs=srgb&dl=pexels-pixabay-277390.jpg&fm=jpg',
    price: '',
    id: '',
  };

  const [input, setInput] = useState(initialState); // State for form inputs
  const [todos, setTodos] = useState([]); // State for storing fetched todos

  // Handle changes in input fields
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value, // Handle checkbox value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, completed, image, price, id } = input;

    if (!title || !image || !price || !id) {
      alert('Please fill in all required fields');
      return;
    }

    // Prepare data to send to the backend
    const todoData = {
      title,
      completed,
      image,
      price: parseFloat(price), // Ensure price is a number
      id,
    };

    // Send POST request to add a new todo item
    axios.post('http://localhost:5000/add', todoData)
      .then((res) => {
        console.log('Todo added:', res);
        alert('Todo added successfully');
        setInput(initialState); // Reset form after submission
        getData(); // Fetch updated todo list
      })
      .catch((err) => console.log('Error adding todo:', err));
  };

  const getData = () => {
    axios.get('http://localhost:5000/getall')
      .then((res) => {
        setTodos(res.data); // Update todos state with fetched data
      })
      .catch((err) => console.log('Error fetching todos:', err));
  };

  const handleUpdate = (todo) => {
    // Update form input with the selected todo's data
    setInput({
      title: todo.title,
      completed: todo.completed,
      image: todo.image,
      price: todo.price,
      id: todo.id,
    });
  };

  const handleDelete = (id) => {
    // Send DELETE request to remove the todo
    axios.delete(`http://localhost:5000/delete/${id}`)
      .then((res) => {
        console.log('Todo deleted:', res);
        alert('Todo deleted successfully');
        getData(); // Fetch updated todo list
      })
      .catch((err) => console.log('Error deleting todo:', err));
  };

  const handleToggleComplete = (id, completed) => {
    // Send PUT request to toggle completion status
    axios.put(`http://localhost:5000/update/${id}`, { completed: !completed })
      .then((res) => {
        console.log('Todo updated:', res);
        alert('Todo updated successfully');
        getData(); // Fetch updated todo list
      })
      .catch((err) => console.log('Error updating todo:', err));
  };

  useEffect(() => {
    getData(); // Fetch todos when component mounts
  }, []);

  return (
    <div className="container mt-5">
      <h2>Add Todo Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title:</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={input.title}
            onChange={handleInputChange}
            placeholder="Enter todo title"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Completed:</label>
          <input
            type="checkbox"
            className="form-check-input"
            name="completed"
            checked={input.completed}
            onChange={handleInputChange}
          />
          <label className="form-check-label">Mark as completed</label>
        </div>

        <div className="mb-3">
          <label className="form-label">Image URL:</label>
          <input
            type="text"
            className="form-control"
            name="image"
            value={input.image}
            onChange={handleInputChange}
            placeholder="Enter image URL"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Price:</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={input.price}
            onChange={handleInputChange}
            placeholder="Enter price"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Custom ID:</label>
          <input
            type="text"
            className="form-control"
            name="id"
            value={input.id}
            onChange={handleInputChange}
            placeholder="Enter custom ID"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Add Todo</button>
      </form>

      <h3 className="mt-5">Todo List</h3>
      <ul className="list-group">
        {todos.length > 0 ? (
          todos.map(todo => (
            <li key={todo.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h5>{todo.title}</h5>
                <p>Price: ${todo.price}</p>
                <p>Image: <img src={todo.image} alt={todo.title} height="50" /></p>
                <p>Status: {todo.completed ? "Completed" : "Pending"}</p>
              </div>
              <div>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleUpdate(todo)}>Update</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(todo.id)}>Delete</button>
                <button className="btn btn-secondary btn-sm" onClick={() => handleToggleComplete(todo.id, todo.completed)}>
                  {todo.completed ? "Mark as Pending" : "Mark as Completed"}
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="list-group-item">No todos available</li>
        )}
      </ul>
    </div>
  );
};

export default App;
