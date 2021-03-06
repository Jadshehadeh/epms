import React, { useState } from "react";
import { Redirect, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";

import { signIn, authenticate, isAuthenticated } from "../auth/index";

export default function SignIn() {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    loading: false,
    redirectToReferrer: false,
  });

  const { email, password, error, loading, redirectToReferrer } = values;

  const { role } = isAuthenticated();

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    signIn({ email, password }).then((data) => {
      if (data.message) {
        setValues({ ...values, error: data.message, loading: false });
      } else {
        authenticate(data, () => {
          setValues({
            ...values,
            redirectToReferrer: true,
          });
        });
      }
    });
  };

  const showError = () => (
    <Alert
      variant="filled"
      style={{ marginTop: "15px", display: error ? "" : "none" }}
      severity="error"
    >
      {error}
    </Alert>
  );

  const showLoading = () => loading && <CircularProgress />;

  const redirectUser = () => {
    if (redirectToReferrer) {
      if (role && role === "Admin") {
        return <Redirect to="/admin/dashboard" />;
      } else {
        return <Redirect to="/user/dashboard" />;
      }
    }
  };

  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    loading: {
      marginTop: theme.spacing(1),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: theme.spacing(2),
    },
  }));

  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {showError()}
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={handleChange("email")}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleChange("password")}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={clickSubmit}
            className={classes.submit}
          >
            Sign In
          </Button>
          <div className={classes.loading}>{showLoading()}</div>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
          {redirectUser()}
        </form>
      </div>
    </Container>
    // <Card className={classes.root}>
    //   <CardContent>
    //     <form noValidate autoComplete="off">
    //       {showLoading()}
    //       {showError()}
    //       <div>
    //         <TextField
    //           style={{ margin: 20, width: 300 }}
    //           id="outlined-basic"
    //           label="Email"
    //           variant="outlined"
    //           type="email"
    //           onChange={handleChange("email")}
    //           className="form-control"
    //           value={email}
    //         />
    //       </div>
    //       <div>
    //         <TextField
    //           style={{ margin: 20, width: 300 }}
    //           id="outlined-basic"
    //           label="Password"
    //           variant="outlined"
    //           type="password"
    //           onChange={handleChange("password")}
    //           className="form-control"
    //           value={password}
    //         />
    //       </div>
    //       <div>
    //         <Button
    //           style={{
    //             marginLeft: "30%",
    //             marginRight: "30%",
    //             marginTop: "5%",
    //             width: 200,
    //             verticalAlign: "middle",
    //           }}
    //           variant="contained"
    //           color="primary"
    //           onClick={clickSubmit}
    //         >
    //           Sign In
    //         </Button>
    //       </div>
    //       <div style={{ margin: 20 }}>
    //         <Link to="/forgot-password">Forgot Password!</Link>
    //       </div>
    //       {redirectUser()}
    //     </form>
    //   </CardContent>
    // </Card>
  );
}
