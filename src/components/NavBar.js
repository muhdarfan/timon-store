import React, {useEffect} from 'react'
import AppBar from '@material-ui/core/AppBar'
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {ClickAwayListener, CssBaseline, Grow, Link, MenuItem, MenuList, Paper, Popper} from "@material-ui/core";
import {Route, Switch, useHistory} from "react-router-dom";
import Home from "./Home";
import Login from "./admin/Login";
import Product from "./Product";
import Register from "./admin/Register";
import Profile from "./admin/Profile";
import {withAuthentication} from "./Session";
import ProductList from "./admin/ProductList";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    paper: {
        marginRight: theme.spacing(2),
    },
    bg: {
        background: 'linear-gradient(45deg, #3AB249 30%, #1e2926 90%)'
    }
}));

const NavBar = (props) => {
    const classes = useStyles();
    const {firebase, authUser} = props;
    const anchorRef = React.useRef(null);
    const [open, setOpen] = React.useState(false);
    const history = useHistory();

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    return(
        <div>
            <CssBaseline />
            <AppBar position="static" className={classes.bg}>
                <Toolbar>
                    {
                        /*
                        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                        </IconButton>
                         */
                    }
                    <Typography variant="h6" className={classes.title}>
                        <Link href="/" color="inherit">TIMON STORE</Link>
                    </Typography>
                    <Button href="/product" color="inherit">PRODUCT</Button>
                    { authUser === null ? <Button href="/login" color="inherit">Login</Button> : <div>
                        <Button
                            ref={anchorRef}
                            aria-controls={open ? 'menu-list-grow' : undefined}
                            aria-haspopup="true"
                            color="inherit"
                            onClick={handleToggle}
                        >
                            { props.userData && props.userData.username }
                        </Button>
                        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                                >
                                    <Paper>
                                        <ClickAwayListener onClickAway={handleClose}>
                                            <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                                <MenuItem href="/profile">Profile</MenuItem>
                                                <MenuItem onClick={() => { firebase.doSignOut(); history.push("/login"); }}>Logout</MenuItem>
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    </div> }

                </Toolbar>
            </AppBar>

            <div style={{padding: "20px"}}>
                <Switch >
                    <Route exact path="/" component={Home} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/register" component={Register} />
                    <Route exact path="/profile" component={Profile} />
                    <Route exact path="/admin/product" component={ProductList} />
                    <Route exact path="/product" component={Product} />
                </Switch>
            </div>
        </div>
    )
}
export default withAuthentication(NavBar);
