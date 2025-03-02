import React from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import useAuthStore from "../store/authStore";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <AppBar
      position="static"
      sx={{ bgcolor: "background.paper", boxShadow: 1 }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Typography
            variant="h6"
            component={Link}
            to={user ? "/app" : "/"}
            sx={{
              textDecoration: "none",
              color: "text.primary",
              fontWeight: "bold",
            }}
          >
            MyTaskApp
          </Typography>

          {user && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                component={Link}
                to="/app/tasks"
                color="inherit"
                sx={{ color: "text.primary" }}
              >
                Tasks
              </Button>
              <Button
                component={Link}
                to="/app/tasks-completed"
                color="inherit"
                sx={{ color: "text.primary" }}
              >
                Completed Tasks
              </Button>
              <Button
                component={Link}
                to="/app/add-task"
                color="inherit"
                sx={{ color: "text.primary" }}
              >
                Add Task
              </Button>
              <Button
                component={Link}
                to="/profile"
                color="inherit"
                sx={{ color: "text.primary" }}
              >
                Profile
              </Button>
            </Box>
          )}
        </Box>

        {/* Right Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {user ? (
            <>
              <Avatar
                sx={{ bgcolor: "primary.main" }}
                src={user.avatar}
                alt={user.name}
              />
              <Typography variant="body1" sx={{ color: "text.primary" }}>
                {user.name}
              </Typography>
              <Button
                color="inherit"
                onClick={handleMenuOpen}
                sx={{ color: "text.primary" }}
              >
                ▼
              </Button>
              <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                <MenuItem
                  component={Link}
                  to="/profile"
                  onClick={handleMenuClose}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    logout();
                    handleMenuClose();
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                sx={{ color: "text.primary" }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/signup"
                variant="contained"
                color="primary"
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
