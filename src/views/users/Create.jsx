import { useParams, useNavigate } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MainCard from 'ui-component/cards/MainCard';

// project imports
import { gridSpacing } from 'store/constant';

import UsersCreate from './UserForums/UsersCreate';

// assets
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';

// ==============================|| USER PROFILE ||============================== //

const UserCreate = () => {
    const navigate = useNavigate();

    return (
        <MainCard>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <IconButton onClick={() => {navigate('/users/')}} color="secondary" size="large" aria-label="View">
                        <KeyboardReturnIcon sx={{ fontSize: '1.3rem' }} />
                    </IconButton>
                </Grid>
                <UsersCreate/>
            </Grid>
        </MainCard>
    )
};

export default UserCreate;
