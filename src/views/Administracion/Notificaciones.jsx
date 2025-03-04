// material-ui
import { Grid, Box } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import UsersTable from './NotificationsTables/UsersTable';

// ==============================|| SAMPLE PAGE ||============================== //

const Notificaciones = () => {
    return (
        <Grid
            container
            spacing={2}
            sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'row',
                height: '100%',
            }}
            >
            <Grid
                item
                xs={12}
                md={8}
                sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                height: '100%',
                }}
            >
                <MainCard
                    title="Usuarios"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                        overflow: 'hidden',
                    }}
                >
                    <UsersTable />
                </MainCard>
            </Grid>
            <Grid
                item
                xs={12}
                md={4}
                sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                height: '100%',
                }}
            >
                <MainCard
                title="Notificaciones"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    overflow: 'hidden',
                }}
                >
                <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                    Contenido de Notificaciones
                </Box>
                </MainCard>
            </Grid>
        </Grid>
    );
};
    

export default Notificaciones;
