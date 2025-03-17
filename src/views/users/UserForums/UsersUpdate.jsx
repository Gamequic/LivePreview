import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

// third party
import * as Yup from 'yup';
import { Formik, Form } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import useAuth from 'hooks/useAuth';
import isDevMode from 'utils/isDevMode';

import UsersService from 'contexts/JWTContext/Users';
import ProfilesService from 'contexts/JWTContext/Profiles';

// Service
const service = new UsersService();
const profileService = new ProfilesService();

const UsersUpdate = ({ userId }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState({});
    const [name, setName] = useState("");
    const [profilesData, setProfilesData] = useState([]);
    const [selectedProfiles, setSelectedProfiles] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            const userData = await service.getUser(userId);
            setUser(userData);

            // Get profiles
            const profilesData = await profileService.getProfiles();
            profilesData.forEach(profile => {
                profile.label = profile.name;
            });
            setProfilesData(profilesData);

            // Find the initial profiles
            const profilesFilter = [];
            userData.Profiles.forEach(profileID => { 
                const Profile = profilesData.filter(obj => obj.id === profileID)[0];
                profilesFilter.push({
                    ...Profile,
                    profile_id: Profile,
                    label: Profile.name
                })
            });
            setSelectedProfiles(profilesFilter);
        };

        fetchUserData();
    }, [userId]);

    // Validación del formulario
    const validationSchema = Yup.object().shape({
        Email: Yup.string().email('El correo tiene que ser válido.').max(255).required('El correo es obligatorio.'),
        Name: Yup.string().max(255).required('El nombre es obligatorio.'),
        Password: Yup.string().max(255)
    });

    const handleChangeProfiles = (event, newValue) => {
        let tempUser = { ...user };

        // Recorer la lista de objetos de newValue para crear una lista de unicamente los id
        let profilesListId  = newValue.map(profile => profile.id);

        tempUser.Profiles = profilesListId;
    
        setUser(tempUser);
        setSelectedProfiles(newValue);
    };
    
    return (
        <>
            <Grid item xs={12} sm={6}>
                <Formik
                    enableReinitialize
                    initialValues={{
                        Password: user.Password || '',
                        Email: user.Email || '',
                        Name: user.Name || '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        const submitValues = {
                            ...values,
                            Profiles: user.Profiles,
                            Password: values.Password === "" ? null : values.Password,
                            ID: Number(userId)
                        }

                        console.log(submitValues);

                        service.updateUser(submitValues)
                        setSubmitting(false);
                        navigate('/users');
                        window.location.reload();
                    }}
                >
                    {({ errors, touched, handleChange, handleBlur, setFieldValue, values }) => {
                        return (
                            <Form>

                                {/* Campo de nombre */}
                                <div style={{ marginBottom: '16px' }}>
                                    <TextField
                                        fullWidth
                                        label="Nombre"
                                        name="Name"
                                        value={values.Name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.Name && errors.Name)}
                                        helperText={touched.Name && errors.Name}
                                    />
                                </div>

                                <div style={{ marginBottom: '16px' }}>
                                    <TextField
                                        fullWidth
                                        label="Correo Electrónico"
                                        name="Email"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.Email}
                                        error={Boolean(touched.Email && errors.Email)}
                                        helperText={touched.Email && errors.Email}
                                    />
                                </div>

                                <div style={{ marginBottom: '16px' }}>
                                    <TextField
                                        fullWidth
                                        label="Contraseña ( Dejar en blanco si no va a ver cambios )"
                                        name="Password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.Password}
                                        error={Boolean(touched.Password && errors.Password)}
                                        helperText={touched.Password && errors.Password}
                                    />
                                </div>

                                <Box sx={{ mt: 2 }}>
                                    <AnimateButton>
                                        <Button
                                            disableElevation
                                            fullWidth
                                            size="large"
                                            type="submit"
                                            variant="contained"
                                            color="secondary"
                                        >
                                            Enviar
                                        </Button>
                                    </AnimateButton>
                                </Box>
                            </Form>
                        );
                    }}
                </Formik>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Grid item>
                    {profilesData.length > 0 ? (
                        <Autocomplete
                            multiple
                            options={profilesData}
                            getOptionLabel={(option) => option.label}
                            value={selectedProfiles}
                            onChange={handleChangeProfiles}
                            defaultValue={selectedProfiles}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderInput={(params) => <TextField label="Perfiles" {...params} />}
                        />
                    ) : (
                        <p>Cargando</p>
                    )}
                </Grid>
            </Grid>
        </>
    );
};

export default UsersUpdate;
