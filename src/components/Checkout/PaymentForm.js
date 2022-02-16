import React, { } from 'react';
import { Typography, Button, Divider } from '@material-ui/core';
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import Review from './Review';

const stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE_PK}`);

const PaymentForm = ({ shippingData, checkoutToken, prevStep, nextStep, captureCheckout, timeOut }) => {
    const onSubmit = async (e, elements, stripe) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        const cardElement = elements.getElement(CardElement, {
            hidePostalCode: true
        });
        const { err, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: cardElement });

        if (err) {
            console.log('[error]', err);
        } else {
            const orderData = {
                line_items: checkoutToken.live.line_items,
                customer: {
                    firstname: shippingData.firstName,
                    lastname: shippingData.lastName,
                    email: shippingData.email
                },
                shipping: {
                    name: 'Primary',
                    street: shippingData.address,
                    town_city: shippingData.city,
                    postal_zip_code: shippingData.zip,
                    county_state: shippingData.shippingSubdivision,
                    country: shippingData.shippingCountry
                },
                fulfillment: { shipping_method: shippingData.shippingOption },
                // payment: {
                //     gateway: 'stripe',
                //     stripe: {
                //         payment_method_id: paymentMethod.id
                //     }
                // }
                payment: {
                    gateway: 'test_gateway',
                    card: {
                        number: '4242 4242 4242 4242',
                        expiry_month: paymentMethod.card.exp_month,
                        expiry_year: paymentMethod.card.exp_year,
                        cvc: '123',
                        postal_zip_code: shippingData.zip
                        // postal_zip_code: paymentMethod.billing_details.address.postal_code
                    },
                }
            }

            captureCheckout(checkoutToken.id, orderData);

            timeOut();

            nextStep();
        }
    }

    return <>
        <Review checkoutToken={checkoutToken} />
        <Divider />

        <Typography variant='h6' gutterBottom style={{ margin: '20px 0' }}>Payment Method</Typography>
        <Typography variant='body2'>Demo Card Number: 4242 4242 4242 4242</Typography>
        <Typography variant='body2'>Demo CVC Number: 123</Typography>
        <br />

        <Elements stripe={stripePromise}>
            <ElementsConsumer>
                {({ elements, stripe }) => <form onSubmit={e => onSubmit(e, elements, stripe)}>
                    <CardElement options={{ hidePostalCode: true }} />
                    <br /><br />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant='outlined' onClick={prevStep}>Back</Button>
                        <Button type='submit' variant='contained' disabled={!stripe} color='primary'>Pay {checkoutToken.live.subtotal.formatted_with_symbol}</Button>
                    </div>
                </form>}
            </ElementsConsumer>
        </Elements>
    </>;
};
export default PaymentForm;