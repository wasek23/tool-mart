import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button, CssBaseline } from '@material-ui/core';

import { commerce } from '../../lib/commerce';
import useStyles from './styles';
import AddressForm from './AddressForm';
import PaymentForm from './PaymentForm';

const steps = ['Shipping Address', 'Payment Details'];

const Checkout = ({ cart, order, captureCheckout, err }) => {
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [shippingData, setShippingData] = useState({});
    const [isFinished, setIsFinished] = useState(false);
    const history = useHistory();

    useEffect(() => {
        if (cart.id) {
            const generateToken = async () => {
                try {
                    const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' });

                    setCheckoutToken(token);
                } catch {
                    if (activeStep !== steps.length) history.push('/');
                }
            };

            generateToken();
        }
    }, [cart, activeStep, history]);

    const prevStep = () => setActiveStep(prevActiveStep => prevActiveStep - 1);
    const nextStep = () => setActiveStep(prevActiveStep => prevActiveStep + 1);

    const next = data => {
        setShippingData(data);
        nextStep();
    }

    const timeOut = () => {
        setTimeout(() => {
            setIsFinished(true);
        }, 3000);
    }

    let Confirmation = () => order.customer ? <>
        <div>
            <Typography variant='h5'>Thank you for your purchase, {order.customer.firstname} {order.customer.lastname}</Typography>
            <Divider className={classes.divider} />
            <Typography variant='subtitle2'>Order ref: {order.customer_reference}</Typography>
        </div>
        <br />
        <Button component={Link} to='/' variant='outlined' type='button'>Back to Home</Button>
    </> : isFinished ? <>
        <div>
            <Typography variant='h5'>Thank you for your purchase</Typography>
            <Divider className={classes.divider} />
        </div>
        <br />
        <Button component={Link} to='/' variant='outlined' type='button'>Back to Home</Button>
    </> : <div className={classes.spinner}>
        <CircularProgress />
    </div>;

    if (err) {
        Confirmation = () => <>
            <Typography variant='h5'>Error: {err}</Typography>
            <br />
            <Button component={Link} to='/' variant='outlined' type='button'>Back to Home</Button>
        </>
    }

    const Form = () => 0 === activeStep ?
        <AddressForm checkoutToken={checkoutToken} next={next} /> :
        <PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} prevStep={prevStep} nextStep={nextStep} captureCheckout={captureCheckout} timeOut={timeOut} />;

    return <>
        <CssBaseline />
        <div className={classes.toolbar} />
        <section className={classes.layout}>
            <Paper className={classes.paper}>
                <Typography variant='h4' align='center'>Checkout</Typography>

                <Stepper activeStep={activeStep} className={classes.stepper}>
                    {steps.map(step => <Step key={step}>
                        <StepLabel>{step}</StepLabel>
                    </Step>)}
                </Stepper>

                {steps.length === activeStep ? <Confirmation /> : checkoutToken && <Form />}
            </Paper>
        </section>
    </>;
};
export default Checkout;