import React, {Component} from "react";
import firebase from 'firebase/app'
import {withAuthentication} from "../Session";
import {
    Container,
    CssBaseline, Divider,
    Grid, GridList, GridListTile, GridListTileBar, IconButton,
    List,
    ListItem, ListItemIcon,
    ListItemText,
    Paper, TextField,
    withStyles
} from "@material-ui/core";
import InboxIcon from '@material-ui/icons/Inbox';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = (theme) => ({
    root: {
        flexGrow: 1,
    },
    buttonRoot: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },

    imageRoot: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
    title: {
        color: theme.palette.primary.light,
    },
    titleBar: {
        background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
});

class ProductList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            selectedIndex: 60,
            products: [],
            // Form
            selectedProduct: {
                product_name: '',
                product_detail: '',
                product_price: 0,
                pictures: [],
            },
            images: [],
            disabled: false
        };

        this.baseState = this.state;
        this.storage = this.props.firebase.storage;
        this.firestore = this.props.firebase.store;
        this.handleChange = this.handleChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.onFileChanged = this.onFileChanged.bind(this);
    }

    componentDidMount() {
        this.setState({loading: true});
        this.listener = this.props.firebase.store.collection("products").onSnapshot((querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push({...doc.data(), id: doc.id});
            });
            this.setState({loading: false, products: items, selectedIndex: 60, selectedProduct: this.baseState.selectedProduct});
        });
    }

    componentWillUnmount() {
        this.listener();
    }

    handleChange = (e) => {
        const data = e.currentTarget.dataset;

        if (data) {
            if (data.id === "add") {
                this.setState({selectedIndex: 60, selectedProduct: this.baseState.selectedProduct, images: []});
            } else {
                this.setState({selectedIndex: Number(data.key), selectedProduct: this.state.products[data.key], images: this.state.products[data.key].pictures});
            }
        }
    }

    onSubmit = (event) => {
        event.preventDefault();

        const data = this.state.selectedProduct;
        const id = data['id'];
        delete data['id'];

        if (this.state.selectedIndex === 60 && id === undefined) {
            this.props.firebase.products().add(this.state.selectedProduct).then((docRef) => {
                // Upload
                 this.state.images.map((image,idx) => {
                    const imgName = `/images/${docRef.id}-${idx}`

                    this.storage.ref(imgName).put(image).on('state_changed', (snapshot) => {
                        // loading
                    }, (err) => {
                        console.log(err);
                    }, () => {
                        this.storage.ref('images').child(`${docRef.id}-${idx}`).getDownloadURL().then(uri => {
                            this.props.firebase.store.collection('products').doc(docRef.id).update({
                                pictures: firebase.firestore.FieldValue.arrayUnion(uri)
                            });
                        });
                    });
                });
            });
        } else {
            this.props.firebase.products().doc(id).set(this.state.selectedProduct).then((docRef) => {
                this.state.images.map((image,idx) => {
                    const uploadTask = this.props.firebase.storage.ref(`/images/${id}-${idx}`).put(image);
                })
            });
        }
    }

    onFileChanged = (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 5) {
            alert("Please don't upload more than 5 files.");
        } else {
            this.setState({images: files});
        }
        console.log(this.state.images);
    }

    onChangeHandler = (event) => {
        this.setState({selectedProduct: {...this.state.selectedProduct, [event.target.name]: event.target.value}});
    }

    handleDelete = (event) => {
        const data = event.currentTarget.dataset;

        if (data.id) {
            this.props.firebase.products().doc(data.id).delete().then({

            });
        }
    }

    render() {
        const {selectedIndex, products, loading, selectedProduct, disabled, images} = this.state;
        const {classes} = this.props;

        return (
            <Container>
                <CssBaseline/>
                <div className={classes.root}>
                    <Grid container spacing={3}>
                        <Grid item xs={4}>
                            <Paper className={classes.paper}>
                                <h2>Products</h2>
                                <ListItem button selected={selectedIndex === 60} data-id="add" onClick={this.handleChange}>
                                    <ListItemIcon>
                                        <InboxIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Add Product" />
                                </ListItem>
                                <Divider />
                                <Typography variant="h6" className={classes.title}>
                                    List
                                </Typography>
                                <List component="nav" aria-label="secondary">
                                    {
                                        (products && products.length > 0) && products.map((product, key) =>
                                            <ListItem key={key} button selected={selectedIndex === key} onClick={this.handleChange} data-key={key} data-id={product.id}>
                                                <ListItemText primary={product.product_name} />
                                            </ListItem>
                                        )
                                    }
                                </List>
                            </Paper>
                        </Grid>
                        <Grid item xs={8}>
                            <Paper className={classes.paper}>
                                <h2>Products</h2>
                                {
                                    loading ? "Loading..." :
                                        <div>
                                            <form className={classes.form} noValidate onSubmit={this.onSubmit}>
                                                <TextField
                                                    id="product_name"
                                                    label="Product Name"
                                                    placeholder="Product Name"
                                                    name="product_name"
                                                    autoComplete="product_name"
                                                    //helperText="Full width!"
                                                    fullWidth
                                                    margin="normal"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    autoFocus
                                                    required
                                                    disabled={disabled}
                                                    onChange={this.onChangeHandler}
                                                    variant="outlined"
                                                    value={selectedProduct && selectedProduct.product_name}
                                                />
                                                <TextField
                                                    id="product_detail"
                                                    label="Product Detail"
                                                    placeholder="Product Detail"
                                                    name="product_detail"
                                                    autoComplete="product_detail"
                                                    //helperText="Full width!"
                                                    fullWidth
                                                    margin="normal"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    required
                                                    disabled={disabled}
                                                    onChange={this.onChangeHandler}
                                                    variant="outlined"
                                                    multiline={true}
                                                    value={selectedProduct && selectedProduct.product_detail}
                                                />
                                                <TextField
                                                    id="product_price"
                                                    label="Product Price"
                                                    placeholder="Product Price"
                                                    name="product_price"
                                                    autoComplete="product_price"
                                                    //helperText="Full width!"
                                                    fullWidth
                                                    margin="normal"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    type="number"
                                                    autoFocus
                                                    required
                                                    disabled={disabled}
                                                    onChange={this.onChangeHandler}
                                                    variant="outlined"
                                                    value={selectedProduct && selectedProduct.product_price}
                                                />
                                                <Button
                                                    variant="contained"
                                                    component="label"
                                                    style={{marginBottom: "15px"}}
                                                >
                                                    Upload File
                                                    <input
                                                        type="file"
                                                        onChange={this.onFileChanged}
                                                        accept="image/*"
                                                        hidden
                                                        required
                                                        multiple
                                                    />
                                                </Button>
                                                <div className={classes.imageRoot}>
                                                    <GridList className={classes.gridList} cols={2.5}>
                                                        {
                                                            (images && images.length > 0) ? images.map((image, idx) => (
                                                                    <GridListTile key={idx}>
                                                                        <img src={image.name ? URL.createObjectURL(image) : image} alt={image.name ? image.name : image} />
                                                                        <GridListTileBar
                                                                            title={image.name ? image.name : image}
                                                                            classes={{
                                                                                root: classes.titleBar,
                                                                                title: classes.title,
                                                                            }}
                                                                            actionIcon={
                                                                                <IconButton aria-label={`star `}>
                                                                                    <StarBorderIcon className={classes.title} />
                                                                                </IconButton>
                                                                            }
                                                                        />
                                                                    </GridListTile>
                                                                ))
                                                                : "takda"
                                                        }
                                                    </GridList>
                                                </div>


                                                <Divider/>

                                                <div className={classes.buttonRoot}>
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        color="primary"
                                                        disabled={selectedProduct && (selectedProduct.product_name === "" || selectedProduct.product_detail === "" || selectedProduct.product_price === "" || disabled === true)}
                                                    >
                                                        Save
                                                    </Button>
                                                    <Button style={{display: (selectedIndex === 60 && "none")}}
                                                            variant="contained" color="secondary"
                                                            onClick={this.handleDelete}
                                                            data-id={selectedProduct && selectedProduct.id}>
                                                        Delete
                                                    </Button>
                                                </div>

                                            </form>
                                        </div>
                                }
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </Container>
        )
    }
}

export default withAuthentication(withStyles(useStyles)(ProductList));
