import React from 'react';
import { Container, Typography, Button, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';

import useStyles from './styles';
import CartItem from './CartItem';

const Cart = ({ cart, updateCartQuantity, removeFromCart, emptyCart }) => {
    const { line_items, subtotal } = cart;
    const classes = useStyles();

    const EmptyCart = () => <Typography variant='subtitle1'>
        You have no items in your shopping cart, <Link to='/' className={classes.link}>start adding some!</Link>
    </Typography>;

    const FilledCart = () => <>
        <Grid container spacing={3}>
            {line_items.map(item => <Grid item xs={12} sm={4} key={item.id}>
                <CartItem item={item} updateCartQuantity={updateCartQuantity} removeFromCart={removeFromCart} />
            </Grid>)}
        </Grid>

        <div className={classes.cardDetails}>
            <Typography variant='h4'>Subtotal: {subtotal.formatted_with_symbol}</Typography>

            <div>
                <Button className={classes.emptyButton} size='large' type='button' variant='contained' color='secondary' onClick={emptyCart}>Empty Cart</Button>

                <Button component={Link} to='/checkout' className={classes.checkoutButton} size='large' type='button' variant='contained' color='primary'>Checkout</Button>
            </div>
        </div>
    </>;


    if (!line_items) return 'Loading...';

    return <Container>
        <div className={classes.toolbar}></div>

        <Typography className={classes.title} variant='h3' gutterBottom>Your Shopping Cart</Typography>

        {line_items && 0 !== line_items.length ? <FilledCart /> : <EmptyCart />}
    </Container>;
};
export default Cart;