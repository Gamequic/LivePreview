import React from 'react';

// material-ui
import { Grid, Box, Button } from '@mui/material';
import TextField from '@mui/material/TextField';

// formik
import { Formik, Form, Field } from 'formik';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import UsersTable from './NotificationsTables/UsersTable';
import notificationService from 'contexts/JWTContext/Notifications';

const service = new notificationService();

// ==============================|| SAMPLE PAGE ||============================== //

const Notificaciones = () => {
    const [selectionModel, setSelectionModel] = React.useState([]);

    // Función que manejará el envío de la notificación
    const handleSendNotification = (values, { resetForm }) => {
        selectionModel.forEach((id) => {
            service.PostNotificaciones({ message: values.message, user_id: id });
        });
        resetForm();
    };

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
                    <UsersTable
                        selectionModel={selectionModel}
                        setSelectionModel={setSelectionModel}
                    />
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
                        <Formik
                            initialValues={{ message: '' }}
                            onSubmit={handleSendNotification}
                        >
                            {({ handleSubmit }) => (
                                <Form>
                                    <Field
                                        as={TextField}
                                        fullWidth
                                        label="Mensaje de notificación"
                                        name="message"
                                        variant="outlined"
                                        margin="normal"
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        type="submit"
                                    >
                                        Enviar Notificación
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </Box>
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default Notificaciones;