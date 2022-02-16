import React from 'react';
import { InputLabel, Select, MenuItem, Grid } from '@material-ui/core';

const CustomSelectField = ({ label, value = '', onChange, options }) => <Grid item xs={12} sm={6}>
    <InputLabel>{label}</InputLabel>
    <Select value={value} onChange={e => onChange(e)} fullWidth defaultValue=''>
        {options.map(item => <MenuItem key={item.id} value={item.id}>{item.label}</MenuItem>)}
    </Select>
</Grid>;
export default CustomSelectField;