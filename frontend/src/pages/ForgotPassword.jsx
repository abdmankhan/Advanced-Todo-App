import React from 'react'
import { Container, Typography, TextField, Button, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useAuthStore from '../store/authStore';

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { forgotPassword } = useAuthStore(); // Assuming you have a forgotPassword function in your store
  const onSubmit = async (data) => {
    // Handle forgot password logic here
    toast.success("Password reset link sent to your email");
    await forgotPassword(data.email); // Call the forgotPassword function from the store
    console.log("Forgot Password Data:", data.email);
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
          Forgot Password
        </Typography>
        <Typography
          variant="body2"
          align="center"
          gutterBottom
          sx={{ color: "text.secondary" }}
        >
          Enter your email to receive a password reset link.
        </Typography>
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
          <Button
            fullWidth
            variant="contained"
            size="large"
            type="submit"
            sx={{ mt: 3 }}
          >
            Submit
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ForgotPassword
