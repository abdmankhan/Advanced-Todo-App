import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Container,
  Typography,
  TextField,
  Button,
  Link,
  Box,
} from "@mui/material";
import useAuthStore from "../store/authStore";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const { signup } = useAuthStore();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await signup(data.name, data.email, data.password);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      console.log(`Signup page loaded`);
      navigate("/app");
    }
  }, [user]);
  return (
    <Container
      maxWidth="xs"
      sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}
    >
      <Box sx={{ width: "100%", py: 8 }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Create Account
        </Typography>

        <Box sx={{ mt: 4 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              margin="normal"
              {...register("name", {
                required: "Name is required",
                pattern: {
                  value: /^[A-Za-z\s]+$/, // Allows only letters and spaces
                  message: "Invalid name. Only letters and spaces are allowed",
                },
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              variant="outlined"
              margin="normal"
              {...register("confirmPassword", {
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Link
              component={RouterLink}
              to="/login"
              variant="body2"
              sx={{
                textDecoration: "none",
                color: "primary.main",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Already have an account? Sign In
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;
