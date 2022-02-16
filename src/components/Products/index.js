import React from 'react';
import { Grid } from '@material-ui/core';

import useStyles from './styles';
import Product from '../Product';

const Products = ({ products, addToCart }) => {
    const classes = useStyles();

    return <section className={`${classes.content} products`}>
        <div className={classes.toolbar}></div>
        <Grid container justifyContent='center' spacing={4}>
            {products.map(product => (
                <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                    <Product product={product} addToCart={addToCart} />
                </Grid>
            ))}
        </Grid>
    </section>;
};
export default Products;