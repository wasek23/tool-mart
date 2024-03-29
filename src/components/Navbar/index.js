import React from 'react';

import { AppBar, Toolbar, IconButton, Badge, Typography } from '@material-ui/core';
import { ShoppingCart } from '@material-ui/icons';
import { Link, useLocation } from 'react-router-dom';

import useStyles from './styles';

import logo from '../../img/logo.png';

const Navbar = ({ totalItems }) => {
    const classes = useStyles();
    const location = useLocation();

    return <>
        <AppBar position='fixed' className={classes.appBar} color='inherit'>
            <Toolbar>
                <Typography component={Link} to='/' variant='h6' className={classes.title} color='inherit'>
                    <img src={logo} alt='ToolMart' height='25px' className={classes.image} />
                    Tool Mart
                </Typography>

                <div className={classes.grow}></div>

                {'/cart' !== location.pathname && <div className={classes.button}>
                    <IconButton component={Link} to='/cart' aria-label='Show cart items' color='inherit'>
                        <Badge badgeContent={totalItems} color='secondary'>
                            <ShoppingCart />
                        </Badge>
                    </IconButton>
                </div>}
            </Toolbar>
        </AppBar>
    </>;
};
export default Navbar;