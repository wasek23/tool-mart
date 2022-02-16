import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { Button, Grid, Typography } from '@material-ui/core';

import { commerce } from '../../lib/commerce';

import CustomTextField from './CustomTextField';
import CustomSelectField from './CustomSelectField';

const AddressForm = ({ checkoutToken, next }) => {
    const methods = useForm();

    const [shippingCountries, setShippingCountries] = useState([]);
    const [shippingCountry, setShippingCountry] = useState('');
    const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
    const [shippingSubdivision, setShippingSubdivision] = useState('');
    const [shippingOptions, setShippingOptions] = useState([]);
    const [shippingOption, setShippingOption] = useState('');

    const fetchShippingCountries = async checkoutTokenId => {
        const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId);
        setShippingCountries(countries);
        setShippingCountry(Object.keys(countries)[0]);
    }
    const fetchShippingSubdivisions = async (checkoutTokenId, countryCode) => {
        const { subdivisions } = await commerce.services.localeListShippingSubdivisions(checkoutTokenId, countryCode);
        setShippingSubdivisions(subdivisions);
        setShippingSubdivision(Object.keys(subdivisions)[0]);
    }
    const fetchShippingOptions = async (checkoutTokenId, country, region = null) => {
        const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region });
        setShippingOptions(options);
        setShippingOption(options[0].id);
    }

    useEffect(() => {
        checkoutToken && fetchShippingCountries(checkoutToken.id);
    }, [checkoutToken]);
    useEffect(() => {
        checkoutToken && shippingCountry && fetchShippingSubdivisions(checkoutToken.id, shippingCountry);
    }, [checkoutToken, shippingCountry]);
    useEffect(() => {
        checkoutToken && shippingCountry && shippingSubdivision && fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision);
    }, [checkoutToken, shippingCountry, shippingSubdivision]);

    return <>
        <Typography variant='h6' gutterBottom>Shipping Address</Typography>

        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(data => next({ ...data, shippingCountry, shippingSubdivision, shippingOption }))}>
                <Grid container spacing={3}>
                    <CustomTextField name='firstName' label='First Name' />
                    <CustomTextField name='lastName' label='Last Name' />
                    <CustomTextField name='email' label='Email' />
                    <CustomTextField name='address' label='Address' />
                    <CustomTextField name='city' label='City' />
                    <CustomTextField name='zip' label='ZIP / Postal code' />

                    <CustomSelectField label='Shipping Country' value={shippingCountry} onChange={e => setShippingCountry(e.target.value)} options={
                        Object.entries(shippingCountries).map(([code, name]) => ({ id: code, label: name }))
                    } />

                    <CustomSelectField label='Shipping Subdivision' value={shippingSubdivision} onChange={e => setShippingSubdivision(e.target.value)} options={
                        Object.entries(shippingSubdivisions).map(([code, name]) => ({ id: code, label: name }))
                    } />

                    <CustomSelectField label='Shipping Options' value={shippingOption} onChange={e => setShippingOption(e.target.value)} options={
                        shippingOptions.map(opt => ({ id: opt.id, label: `${opt.description} - ${opt.price.formatted_with_symbol}` }))
                    } />
                </Grid>

                <br />

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button component={Link} to='/cart' variant='outlined'>Back to Cart</Button>
                    <Button type='submit' variant='contained' color='primary'>Next</Button>
                </div>
            </form>
        </FormProvider>
    </>;
};
export default AddressForm;