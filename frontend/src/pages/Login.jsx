import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Container,
  Typography,
  TextField,
  Button,
  Link,
  Divider,
  Box,
} from "@mui/material";
import { Google } from "@mui/icons-material";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { Navigate, Link as RouterLink } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";


const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuthStore();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      // console.log(`Logged in as ${user}`);  // Didn't work here because zustand updates are asynchroneous, the 'user' object is not updated immediately after login

      
    } finally {
      setLoading(false);
    }
  };

  // log the user object after login
  useEffect(() => {
    if(user){
      // console.log(`Logged in as ${user.email}`);
      toast.success(`Logged in as ${user.name}`);
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
          Welcome Back
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Google />}
            sx={{ mb: 2 }}
            // onClick={handleGoogleLogin} (Implement later)
          >
            Continue with Google
          </Button>

          <Divider sx={{ my: 3 }}>OR</Divider>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              {...register("email", { required: "Email is required" })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              {...register("password", { required: "Password is required" })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Link component={RouterLink} to="/forgot-password" variant="body2">
              Forgot password?
            </Link>
            <Link component={RouterLink} to="/signup" variant="body2">
              Don't have an account? Sign Up
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
