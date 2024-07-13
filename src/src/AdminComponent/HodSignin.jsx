import * as React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import logo from "../AdminComponent/12.png";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import posImage23 from "../images/campus.png";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  Password: yup.string().required("Password is required"),
});

const defaultTheme = createTheme();

export default function HodLogin() {
  //////////////password/////////////////////////////
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  ///////////////////////////////////////////////////////////
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      Password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, event) => {


      try {
        const response = await fetch(process.env.REACT_APP_HOD_SIGN_IN, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        console.log(response, "responseee")

        if (response.ok) {
          const data = await response.json();
          const user = data.UserResponse;

          console.log(data, "sign in")
          sessionStorage.setItem("AnkitHOD", JSON.stringify(user));
          // console.log("Login successful");
          navigate("/dashboard");
        } else {
          swal({
            icon: "error",
            title: "Error",
            text: `Invalid Credentials`,
          });
        }
      } catch (error) {
        swal({
          icon: "error",
          title: "Error",
          text: `Something Went Wrong !!`,
        });
      }
    },
  });
  return (
    <div style={{ width: "100%" }}>
      <div style={{ width: "90%", marginLeft: "5%" }}>
        <ThemeProvider theme={defaultTheme}>
          <Grid
            container
            component="main"
            sx={{ height: "90vh", marginTop: "2%" }}
          >

            <Grid
              borderRadius={2}
              boxShadow={20}
              item
              xs={false}
              sm={4}
              md={7}
              sx={{
                backgroundImage: `url(${posImage23})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundColor: (t) =>
                  t.palette.mode === "light"
                    ? t.palette.grey[50]
                    : t.palette.grey[900],
                backgroundPosition: "center",
              }}
            />
            <Grid
              borderRadius={2}
              boxShadow={20}
              item
              xs={12}
              sm={5}
              md={5}
              component={Paper}
              elevation={6}
              square
            >
              <Box
                sx={{
                  my: 6,
                  mx: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src={logo}
                  alt=""
                  style={{ width: "60px", height: "60px" }}
                />
                <Typography component="h1" variant="h5">
                  HOD SIGN IN
                </Typography>
                <form onSubmit={formik.handleSubmit} noValidate>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    name="email"
                    label="Email Address"
                    autoComplete="off"
                    autoFocus
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.email && formik.errors.email ? true : false
                    }
                    helperText={formik.touched.email && formik.errors.email}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="Password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="off"
                    value={formik.values.Password}
                    onChange={formik.handleChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={
                      formik.touched.Password && formik.errors.Password
                        ? true
                        : false
                    }
                    helperText={
                      formik.touched.Password && formik.errors.Password
                    }
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign In
                  </Button>

                  <Grid container>
                    <Grid item xs>
                      <Link>Forgot password?</Link>
                    </Grid>
                    <Grid item>
                      <p>
                        Dont't have an account{" "}
                        <Link to="/adminregister">Sign Up</Link>
                      </p>
                    </Grid>
                  </Grid>
                </form>
              </Box>
            </Grid>
          </Grid>
        </ThemeProvider>
      </div>
    </div>
  );
}

