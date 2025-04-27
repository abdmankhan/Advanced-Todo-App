import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";
import {

// filepath: d:/Semesters/WebDev/L4FullStack/Karms/frontend/src/pages/ResetPassword.jsx
  Container,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";

import { toast } from "react-toastify";
import useAuthStore from "../store/authStore";


const ResetPassword = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuthStore();

  const token = searchParams.get("token");

  const onSubmit = async (data) => {
    if (!token) {
      toast.error("Invalid or missing token");
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, data.password);
      toast.success("Password reset successful");
      navigate("/login");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Password reset failed";
      toast.error(errorMessage);
      console.error("Password reset error:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
          Reset Password
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            variant="outlined"
            margin="normal"
            {...register("password", { required: "Password is required" })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            variant="outlined"
            margin="normal"
            {...register("confirmPassword", { required: "Confirm Password is required" })}
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
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ResetPassword;