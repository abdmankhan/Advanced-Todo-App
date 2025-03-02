import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Edit, Delete, MoreVert } from "@mui/icons-material";
import TaskForm from "./TaskForm";
import taskService from "../services/taskService";

const TaskItem = ({ task, onDelete, onUpdate }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDelete = async () => {
    try {
      await taskService.deleteTask(task._id);
      onDelete(task._id);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const priorityColors = {
    low: "success",
    medium: "warning",
    high: "error",
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        {showEdit ? (
          <TaskForm
            initialData={task}
            onSuccess={(updatedTask) => {
              onUpdate(updatedTask);
              setShowEdit(false);
            }}
          />
        ) : (
          <>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">{task.title}</Typography>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <MoreVert />
              </IconButton>
            </Stack>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={() => setShowEdit(true)}>
                <Edit sx={{ mr: 1 }} /> Edit
              </MenuItem>
              <MenuItem onClick={handleDelete}>
                <Delete sx={{ mr: 1 }} /> Delete
              </MenuItem>
            </Menu>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {task.description}
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Chip
                label={`Due: ${new Date(task.dueDate).toLocaleDateString()}`}
                variant="outlined"
              />
              <Chip
                label={task.priority}
                color={priorityColors[task.priority]}
                variant="outlined"
              />
            </Stack>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskItem;
