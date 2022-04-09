import React, {Component} from "react";
import withContext from "../withContext";
import {Button, Container, Grid, Typography, withStyles} from "@material-ui/core";

const useStyles = theme => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
});

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            product: []
        }
    }

    render() {
        const { product } = this.state;
        const { classes } = this.props;
        return <main>
            {/* Hero unit */}
            <div className={classes.heroContent}>
                <Container maxWidth="sm">
                    <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                        TIMON STORE
                    </Typography>
                    <Typography variant="h5" align="center" color="textSecondary" paragraph>
                        Something short and leading about the collection below—its contents, the creator, etc.
                        Make it short and sweet, but not too short so folks don&apos;t simply skip over it
                        entirely.
                    </Typography>
                    <div className={classes.heroButtons}>
                        <Grid container spacing={2} justify="center">
                            <Grid item>
                                <Button variant="contained" color="primary">
                                    Main call to action
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="outlined" color="primary">
                                    Secondary action
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                </Container>
            </div>
            {product ? product.map((data,i) => <li key={i}>{data.username}</li>) : "haha"}
        </main>
    }

    componentDidMount() {
        this.props.firebase.db.ref("users").on('value', (snapshot) => {
            this.setState({product: Object.values(snapshot.val())});
        })
    }

    componentWillUnmount() {
        this.props.firebase.db.ref("users").off();
    }
}

export default withContext(withStyles(useStyles)(Home));
