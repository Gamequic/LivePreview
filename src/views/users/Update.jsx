import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import MainCard from 'ui-component/cards/MainCard';

// project imports
import { gridSpacing } from 'store/constant';

import UsersUpdate from './UserForums/UsersUpdate';

// assets
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';

// ==============================|| USER PROFILE ||============================== //

const UserUpdate = () => {
    const navigate = useNavigate();
    const { userId } = useParams();

    return (
        <MainCard>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <IconButton onClick={() => {navigate('/users/')}} color="secondary" size="large" aria-label="View">
                        <KeyboardReturnIcon sx={{ fontSize: '1.3rem' }} />
                    </IconButton>
                </Grid>
                <UsersUpdate userId={userId} />
            </Grid>
        </MainCard>
    )
};

export default UserUpdate;
