import Task from '../models/Task.js'
import asyncHandler from 'express-async-handler'


// Create Task
const createTask = asyncHandler( async (req, res) => {
  const {title, description, dueDate, priority} = req.body;
  const task = await Task.create({
    title,
    description,
    dueDate,
    priority,
    userId: req.user._id
  })
  res.status(201).json(task)
})

// Get all tasks
const getTasks = asyncHandler (async (req, res) => {
  const tasks = await Task.find({userId : req.user._id});
  
  
  res.status(201).json(tasks)
})

// Get task by ID
const getTaskById = asyncHandler ( async (req, res) => {
  const task = await Task.findById(req.params.id)
  res.json(task)
})

// Update task
const updateTask = asyncHandler (async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new : true})
  res.json(task)
})

// Delete task
const deleteTask = asyncHandler ( async (req, res) => {
  await Task.findOneAndDelete(req.params.id);
  res.json({message : 'Task Deleted'})

})

export { createTask, getTasks, getTaskById, updateTask, deleteTask }