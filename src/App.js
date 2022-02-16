import React, { useState, useEffect } from 'react';

import { commerce } from './lib/commerce';
import { Navbar, Products, Cart, Checkout } from './components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const App = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [order, setOrder] = useState({});
    const [errMessage, setErrMessage] = useState('');

    const fetchProducts = async () => {
        const { data } = await commerce.products.list();
        setProducts(data);
    }

    const fetchCart = async () => {
        setCart(await commerce.cart.retrieve());
    }

    const addToCart = async (productId, quantity) => {
        const { cart } = await commerce.cart.add(productId, quantity);
        setCart(cart);
    }

    const updateCartQuantity = async (productId, quantity) => {
        const { cart } = await commerce.cart.update(productId, { quantity });
        setCart(cart);
    }

    const removeFromCart = async productId => {
        const { cart } = await commerce.cart.remove(productId);
        setCart(cart);
    }

    const emptyCart = async () => {
        const { cart } = await commerce.cart.empty();
        setCart(cart);
    }

    const refreshCart = async () => {
        const newCart = await commerce.cart.refresh();
        setCart(newCart);
    }

    const captureCheckout = async (checkoutTokenId, newOrder) => {
        try {
            const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);

            setOrder(incomingOrder);
            refreshCart();
        } catch (err) {
            setErrMessage(err.data.error.message);
        }
    }

    useEffect(() => {
        fetchProducts();
        fetchCart();
    }, []);

    return <Router>
        <Navbar totalItems={cart.total_items} />

        <Switch>
            <Route exact path='/'>
                <Products products={products} addToCart={addToCart} />
            </Route>

            <Route exact path='/cart'>
                <Cart cart={cart} updateCartQuantity={updateCartQuantity} removeFromCart={removeFromCart} emptyCart={emptyCart} />
            </Route>

            <Route exact path='/checkout'>
                <Checkout cart={cart} order={order} captureCheckout={captureCheckout} err={errMessage} />
            </Route>
        </Switch>
    </Router >;
};
export default App;