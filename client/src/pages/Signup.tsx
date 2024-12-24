import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Grid from "@mui/material/Grid";
import * as Yup from "yup";
import { SignUpPayload } from "../models/_models";
import { signUp } from "../services/_requests";
import ToastAlert from "../components/ToastAlert";
import Swal from "sweetalert2";
import Loader from "../components/PageLoader";
import { useNavigate } from "react-router-dom";
import { getToken } from "../components/Helpers.tsx";
import DatePicker from "../components/DateFlatPicker";
import "../../public/assets/custom/custom.css";
import moment from "moment";

// Validation Schema
const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: Yup.number()
    .typeError("Phone number must be numeric")
    .required("Phone number is required"),
  password: Yup.string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  gender: Yup.string()
    .oneOf(["male", "female", "other"], "Invalid gender")
    .required("Gender is required"),
  dateOfBirth: Yup.date()
    .required("Date of birth is required")
    .max(new Date(), "Date of birth cannot be in the future"),
});

const initialValues: SignUpPayload = {
  firstName: "",
  lastName: "",
  phone: "",
  username: "",
  email: "",
  password: "",
  gender: "",
  dateOfBirth: "",
};

const SignUp: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const token = getToken();

  //if user is already logged in, redirect to home page
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  //alert message function
  const showAlertMessage = async (message: string, isError: boolean) => {
    if (isError) {
      Swal.fire({
        toast: true,
        title: message,
        icon: "error",
        width: "25rem",
        position: "top",
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
        showCancelButton: false,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });
    } else {
      await ToastAlert({
        icon: "success",
        title: message,
        timer: 2500,
      });
    }
  };

  // Handle signup function
  const handleSubmit = async (values: SignUpPayload, { resetForm }: any) => {
    setIsLoading(true); // Show loader
    try {
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        username: values.username,
        email: values.email,
        password: values.password,
        gender: values.gender,
        dateOfBirth: values.dateOfBirth,
      };
      const { status, message } = await signUp(payload);

      if (status === 200 || status === 201) {
        await showAlertMessage(message, false);
        resetForm(); // Clear form
        // Redirect to login
        navigate("/login");
      } else {
        throw new Error("Unexpected response from the server");
      }
    } catch (error: any) {
      await showAlertMessage("OOPS!! Something went wrong", true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      {/* <NavBar /> */}
      <Container maxWidth="sm">
        <Box
          sx={{
            mt: 4,
            px: 3,
            py: 4,
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#ffffff",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              mb: 3,
              fontWeight: 700,
              color: theme.palette.primary.main,
            }}
          >
            Sign Up
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, setFieldValue }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="First Name"
                      name="firstName"
                      variant="outlined"
                      error={touched.firstName && Boolean(errors.firstName)}
                      helperText={<ErrorMessage name="firstName" />}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      variant="outlined"
                      error={touched.lastName && Boolean(errors.lastName)}
                      helperText={<ErrorMessage name="lastName" />}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Phone"
                      name="phone"
                      type="tel"
                      variant="outlined"
                      error={touched.phone && Boolean(errors.phone)}
                      helperText={<ErrorMessage name="phone" />}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Username"
                      name="username"
                      variant="outlined"
                      error={touched.username && Boolean(errors.username)}
                      helperText={<ErrorMessage name="username" />}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      variant="outlined"
                      error={touched.email && Boolean(errors.email)}
                      helperText={<ErrorMessage name="email" />}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Password"
                      name="password"
                      type="password"
                      variant="outlined"
                      error={touched.password && Boolean(errors.password)}
                      helperText={<ErrorMessage name="password" />}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Gender"
                      name="gender"
                      select
                      variant="outlined"
                      error={touched.gender && Boolean(errors.gender)}
                      helperText={<ErrorMessage name="gender" />}
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Field>
                  </Grid>
                  <Grid item xs={12}>
                    <DatePicker
                      currDate={moment().format("YYYY-MM-DD")}
                      placeholder="Date of Birth"
                      onDateChange={(selectedDate: any) => {
                        setFieldValue("dateOfBirth", selectedDate);
                      }}
                    />
                    {touched.dateOfBirth && errors.dateOfBirth && (
                      <div style={{ color: "red", fontSize: "12px" }}>
                        {errors.dateOfBirth}
                      </div>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{
                        py: 1.5,
                        backgroundColor: theme.palette.primary.main,
                        "&:hover": {
                          backgroundColor: theme.palette.primary.dark,
                        },
                      }}
                    >
                      Sign Up
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant="body2"
                      sx={{
                        textAlign: "center",
                        color: theme.palette.text.secondary,
                      }}
                    >
                      Already have an account?{" "}
                      <Typography
                        component="a"
                        href="/login"
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: 600,
                          textDecoration: "none",
                        }}
                      >
                        Log In
                      </Typography>
                    </Typography>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Box>
      </Container>
      {!isLoading && <Loader isLoading={false} />}
    </React.Fragment>
  );
};

export default SignUp;
