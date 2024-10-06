const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todolist', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Define the Todo Schema
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Title of the todo item
  completed: { type: Boolean, default: false }, // Completion status
  image: { type: String }, // Field for image URL
  price: { type: Number, required: true }, // Field for price (ensure it's a number)
  id: { type: String, required: true, unique: true }, // Custom id field (if needed, usually MongoDB generates _id)
});

// Create the Todo model using the schema
const Todo = mongoose.model('Todo', todoSchema);

// Routes
app.get('/getall', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching todos' });
  }
});

app.post('/add', async (req, res) => {
  const { title, image, price, id } = req.body;

  if (!title || !price || !id) {
    return res.status(400).json({ message: 'Please provide title, price, and id.' });
  }

  const newTodo = new Todo({
    title,
    image,
    price,
    id,
  });

  try {
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ message: 'Error saving todo' });
  }
});

app.put('/update/:id', async (req, res) => {
  const { title, completed, image, price } = req.body;

  try {
    const updatedTodo = await Todo.findOneAndUpdate(
      { id: req.params.id }, // Use the custom id for updating
      { title, completed, image, price }, // Update the fields
      { new: true, runValidators: true } // Return the updated document and run validators
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ message: 'Error updating todo' });
  }
});

app.delete('/delete/:id', async (req, res) => {
  try {
    const deletedTodo = await Todo.findOneAndDelete({ id: req.params.id });

    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting todo' });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
