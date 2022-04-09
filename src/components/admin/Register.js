import React, {useContext, useEffect, useState} from "react";
import {
    Avatar,
    Container,
    CssBaseline,
    Grid,
    Link,
    makeStyles,
    TextField
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {FirebaseContext, withFirebase} from "../Firebase";
import Alert from "@material-ui/lab/Alert";
import {AlertTitle} from "@material-ui/lab";
import {useHistory, withRouter} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

function Register(props) {
    const classes = useStyles();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const history = useHistory();

    useEffect(() => {
        if (props.firebase.auth.currentUser) {
            history.push("/");
        }
    });

    const onChangeHandler = (event) => {
        const {name, value} = event.currentTarget;

        if(name === 'username') {
            setUsername(value);
        } else if(name === 'password'){
            setPassword(value);
        } else if (name === 'email') {
            setEmail(value);
        }
    };

    const onSubmit = (event) => {
        event.preventDefault();
        setError(null);

        if (/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {
            if (username.length > 3 && password.length > 5) {
                props.firebase.doCreateUserWithEmailAndPassword(email, password).then(authUser => {
                    return props.firebase.user(authUser.user.uid).set({
                        username,
                        email
                    });
                    this.props.history.push("/");
                }).catch(error => {
                    console.log("error");
                    setError(error.message);
                });
            } else {

            }
        } else {
            // Error email validation
            setError("Please enter a valid email address.");
        }
    };

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

                {
                    error !== null &&
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {error}
                    </Alert>
                }

                <form className={classes.form} noValidate onSubmit={onSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={onChangeHandler}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        onChange={onChangeHandler}
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
                        onChange={onChangeHandler}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={username === "" || password === "" || email === ""}
                    >
                        Register
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/login" variant="body2">
                                {"Already have an account? Sign In"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    )
}


export default withFirebase(Register);
