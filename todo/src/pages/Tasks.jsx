import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  Grid, Button, TextField, Card, CardContent, CardActions, IconButton, Typography, Select, MenuItem,
  Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'todo' });
  const [editTask, setEditTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recent');
  const token = localStorage.getItem('token');

  const statusColumns = ['todo', 'in-progress', 'done'];

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, [token]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleAddTask = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/tasks`, newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks([...tasks, response.data]);
      setOpenAddModal(false);
      setNewTask({ title: '', description: '', status: 'todo' });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleEditTask = async () => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/tasks/${editTask._id}`, editTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.map((task) => (task._id === editTask._id ? response.data : task)));
      setOpenEditModal(false);
      setEditTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/tasks/${taskToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task._id !== taskToDelete._id));
      setOpenDeleteConfirm(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleViewDetails = (task) => {
    setSelectedTask(task);
    setOpenDetailsModal(true);
  };

  const filteredTasks = (status) => {
    let filtered = tasks.filter((task) => task.status === status);
    if (search) {
      filtered = filtered.filter((task) => task.title.toLowerCase().includes(search.toLowerCase()));
    }
    if (sort === 'recent') {
      return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  };

  const moveTask = async (taskId, newStatus) => {
    const taskToMove = tasks.find((t) => t._id === taskId);
    if (taskToMove.status === newStatus) return;

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/tasks/${taskId}`,
        { ...taskToMove, status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTasks(tasks.map((t) => (t._id === taskId ? response.data : t)));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpenAddModal(true)}>
            Add Task
          </Button>
        </div>
        <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
          <TextField
            label="Search"
            variant="outlined"
            value={search}
            onChange={handleSearchChange}
          />
          <Select value={sort} onChange={(e) => setSort(e.target.value)}>
            <MenuItem value="recent">Recent</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
          </Select>
        </div>

        <Grid container spacing={3}>
          {statusColumns.map((status) => (
            <Grid item xs={4} key={status}>
              <Typography variant="h5" align="center">{status.toUpperCase()}</Typography>
              <TaskColumn
                status={status}
                tasks={filteredTasks(status)}
                moveTask={moveTask}
                setEditTask={setEditTask}
                setOpenEditModal={setOpenEditModal}
                setOpenDeleteConfirm={setOpenDeleteConfirm}
                setTaskToDelete={setTaskToDelete}
                handleViewDetails={handleViewDetails}
              />
            </Grid>
          ))}
        </Grid>

        {/* Add Task Modal */}
        <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)}>
          <DialogTitle>Add Task</DialogTitle>
          <DialogContent>
            <TextField fullWidth label="Title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
            <TextField fullWidth multiline label="Description" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddModal(false)}>Cancel</Button>
            <Button onClick={handleAddTask} color="primary">Add Task</Button>
          </DialogActions>
        </Dialog>

        {/* Edit Task Modal */}
        {editTask && (
          <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogContent>
              <TextField fullWidth label="Title" value={editTask.title} onChange={(e) => setEditTask({ ...editTask, title: e.target.value })} />
              <TextField fullWidth multiline label="Description" value={editTask.description} onChange={(e) => setEditTask({ ...editTask, description: e.target.value })} />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
              <Button onClick={handleEditTask} color="primary">Save Changes</Button>
            </DialogActions>
          </Dialog>
        )}

        {/* View Task Details Modal */}
        {selectedTask && (
          <Dialog open={openDetailsModal} onClose={() => setOpenDetailsModal(false)}>
            <DialogTitle>Task Details</DialogTitle>
            <DialogContent>
              <Typography variant="h6">Title: {selectedTask.title}</Typography>
              <Typography variant="body1">Description: {selectedTask.description}</Typography>
              <Typography variant="body1">Status: {selectedTask.status}</Typography>
              <Typography variant="caption">Created at: {new Date(selectedTask.createdAt).toLocaleString()}</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDetailsModal(false)}>Close</Button>
            </DialogActions>
          </Dialog>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteConfirm} onClose={() => setOpenDeleteConfirm(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete this task?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteConfirm(false)}>Cancel</Button>
            <Button onClick={handleDeleteTask} color="secondary">Delete</Button>
          </DialogActions>
        </Dialog>
      </div>
    </DndProvider>
  );
};

const TaskColumn = ({ status, tasks, moveTask, setEditTask, setOpenEditModal, setOpenDeleteConfirm, setTaskToDelete, handleViewDetails }) => {
  const [, drop] = useDrop({
    accept: 'TASK',
    drop: (item) => moveTask(item.id, status),
  });

  return (
    <div ref={drop} style={{ minHeight: '100px' }}>
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          setEditTask={setEditTask}
          setOpenEditModal={setOpenEditModal}
          setOpenDeleteConfirm={setOpenDeleteConfirm}
          setTaskToDelete={setTaskToDelete}
          handleViewDetails={handleViewDetails}
        />
      ))}
    </div>
  );
};

const TaskCard = ({ task, setEditTask, setOpenEditModal, setOpenDeleteConfirm, setTaskToDelete, handleViewDetails }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task._id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Card>
        <CardContent>
          <Typography variant="h6">{task.title}</Typography>
          <Typography variant="body2">{task.description}</Typography>
          <Typography variant="caption">Created at: {new Date(task.createdAt).toLocaleString()}</Typography>
        </CardContent>
        <CardActions>
          <IconButton onClick={() => { setEditTask(task); setOpenEditModal(true); }}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => { setTaskToDelete(task); setOpenDeleteConfirm(true); }}>
            <DeleteIcon />
          </IconButton>
          <Button variant="contained" color="primary" onClick={() => handleViewDetails(task)}>View Details</Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default Tasks;
