import React, {Component} from "react";
import withContext from "../withContext";
import {
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Container,
    Grid,
    withStyles
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const useStyles = (theme) => ({
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

class Product extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            products: []
        }
    }

    componentDidMount() {
        this.setState({loading: true});

        this.listener = this.props.firebase.products().onSnapshot((querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push({...doc.data(), id: doc.id});
            });
            this.setState({loading: false, products: items});
        });
    }

    componentWillUnmount() {
        this.listener();
    }

    ListProduct(items) {
        return items.map((product, idx) =>
            <Grid item key={idx} xs={12} sm={6} md={4}>
                <Card className={this.props.classes.card}>
                    <CardMedia
                        className={this.props.classes.cardMedia}
                        image={product.pictures ? product.pictures[0] : "https://nesgoo.com/seller/no_shop_image.jpg"}
                        title={product.product_name}
                    />
                    <CardContent className={this.props.classes.cardContent}>
                        <Typography gutterBottom variant="h5" component="h2" align="center">
                            {product.product_name}
                        </Typography>
                        <Typography align="justify">
                            {product.product_detail}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button color="primary" fullWidth>
                            View
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
        )
    }

    render() {
        const {classes} = this.props;
        const {loading, products} = this.state;

        return (
            <Container className={classes.cardGrid} >
                {
                    loading ? "Loading ..." :
                        <Grid container spacing={4}>
                            {
                                (products && products.length > 0) ?
                                    this.ListProduct(products) : "No products to be displayed..."
                            }
                        </Grid>
                }
            </Container>
        );
    }
}

export default withContext(withStyles(useStyles)(Product));


