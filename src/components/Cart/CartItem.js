import React from 'react';
import { Typography, Button, Card, CardActions, CardContent, CardMedia } from '@material-ui/core';

import useStyles from './CartItemStyles';

const CartItem = ({ item, updateCartQuantity, removeFromCart }) => {
    const { id, name, image, line_total, quantity } = item;
    const classes = useStyles();

    return <Card>
        <CardMedia image={image.url} alt={name} className={classes.media} />

        <CardContent className={classes.cardContent}>
            <Typography variant='h4'>{name}</Typography>
            <Typography variant='h5'>{line_total.formatted_with_symbol}</Typography>
        </CardContent>

        <CardActions className={classes.cardActions}>
            <div className={classes.buttons}>
                <Button type='button' size='small' onClick={() => updateCartQuantity(id, quantity - 1)}>-</Button>
                <Typography>{quantity}</Typography>
                <Button type='button' size='small' onClick={() => updateCartQuantity(id, quantity + 1)}>+</Button>
            </div>

            <Button variant='contained' type='button' color='secondary' onClick={() => removeFromCart(id)}>Remove</Button>
        </CardActions>
    </Card>;
};
export default CartItem;