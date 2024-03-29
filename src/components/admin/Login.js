import React, {useContext, useEffect, useState} from "react";
import {
    Avatar,
    Checkbox,
    Container,
    CssBaseline,
    FormControlLabel,
    Grid,
    Link,
    makeStyles,
    TextField
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {FirebaseContext, withFirebase} from "../Firebase";
import Alert from '@material-ui/lab/Alert';
import {AlertTitle} from "@material-ui/lab";
import {useHistory, withRouter} from "react-router-dom";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {withAuthentication} from "../Session";

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

function Login(props) {
    const classes = useStyles();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const history = useHistory();

    useEffect(() => {
        if(props.firebase.auth.currentUser) {
            history.push("/");
        }
    })

    const onChangeHandler = (event) => {
        const {name, value} = event.currentTarget;

        if(name === 'username') {
            setUsername(value);
        } else if(name === 'password'){
            setPassword(value);
        }
    };

    const onSubmit = (event) => {
        event.preventDefault();
        setDisabled(true);

        props.firebase.doSignInWithEmailAndPassword(username, password).then(userAuth => {
            history.push("/");
            toast.success('🦄 You have been successfully logged in!', {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }).catch(error => {
            setError(error.message);
            setDisabled(false);
        });
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
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        disabled={disabled}
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
                        disabled={disabled}
                        onChange={onChangeHandler}
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
                        className={classes.submit}
                        disabled={username === "" || password === "" || disabled === true}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/register" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    )
}

export default withFirebase(Login);
