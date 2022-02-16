import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField, Grid } from '@material-ui/core';

const CustomTextField = ({ name, label }) => {
    const { control } = useFormContext();

    return <Grid item xs={12} sm={6}>
        <Controller
            control={control}
            name={name}
            render={({ field: { name, value = '', onChange }, fieldState: { error } }) => <TextField
                name={name}
                value={value}
                onChange={onChange}
                label={label}
                error={!!error}
                helperText={error ? error.message : null}
                fullWidth
                required
            />}
        />
    </Grid>;
};
export default CustomTextField;