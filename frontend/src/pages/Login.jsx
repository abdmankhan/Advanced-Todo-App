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
  const { login, user, googleLogin } = useAuthStore();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      // console.log(`Logged in as ${user}`);  // Didn't work here because zustand updates are asynchroneous, the 'user' object is not updated immediately after login

      
    } catch(error) {
      toast.error("Login failed");
      console.error("Login failed:", error);
    }
    finally {
      setLoading(false);
    }
  };

  // Google login
  const handleGoogleLogin = async (credentialResponse) => {
    setLoading(true);
    try {
      await googleLogin(credentialResponse.credential);
    } catch (error) {
      toast.error("Google login failed");
      console.error("Google login error:", error);
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
  }, [user, navigate]);

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
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => {
              toast.error("Google login failed");
            }}
            useOneTap
            auto_select
            render={({ onClick, disabled }) => (
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Google />}
                sx={{ mb: 2 }}
                onClick={onClick}
                disabled={disabled}
              >
                Continue with Google
              </Button>
            )}
          />

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


// src/components/Login.js
// src/components/Login.js
// import React from "react";
// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { auth } from "../firebase";

// const Login = () => {
//   const handleGoogleSignIn = async () => {
//     const provider = new GoogleAuthProvider();
//     try {
//       const result = await signInWithPopup(auth, provider);
//       const idToken = await result.user.getIdToken();
//       // Send idToken to your backend for further processing
//     } catch (error) {
//       console.error("Google Sign-In Error:", error);
//     }
//   };

//   return (
//     <button onClick={handleGoogleSignIn}>Sign in with Google</button>
//   );
// };

// export default Login;
