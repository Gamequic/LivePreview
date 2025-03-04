import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Table, TableHead, TableBody, TableRow, TableCell, Checkbox, TableContainer, Paper } from "@mui/material";

// third party
import * as Yup from 'yup';
import { Formik, Form } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import useAuth from 'hooks/useAuth';
import isDevMode from 'utils/isDevMode';

import UsersService from 'contexts/JWTContext/Users';
import ProfilesService from 'contexts/JWTContext/Profiles';
import UisService from 'contexts/JWTContext/UI';
import UosService from 'contexts/JWTContext/UO';

// Service
const service = new UsersService();
const profilesService = new ProfilesService();
const uisService = new UisService();
const uosService = new UosService();

const UsersUpdate = ({ userId }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState({});
    const [name, setName] = useState({ Name: "Ingresa tu matricula para encontrar tu nombre.", valid: isDevMode });
    const [profilesData, setProfilesData] = useState([]);
    const [uisData, setUisData] = useState([]);
    const [selectedProfiles, setSelectedProfiles] = useState([]);
    const [selectedUis, setSelectedUis] = useState([]);
    const [uosData, setUosData] = useState([]);
    const [selectedUos, setSelectedUos] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            const userData = await service.getUser(userId);
            setUser(userData);

            // Get profiles
            const profiles = await profilesService.getProfiles();
            const updatedProfiles = profiles.map(profileObj => ({
                ...profileObj,
                profile_id: profileObj.id,
                label: profileObj.profile
            }));
            setProfilesData(updatedProfiles);

            // Find the initial profiles
            const profilesFilter = [];
            for (let profile in userData.profiles) {
                let ProfileId = userData.profiles[profile].profile_id
                const Profile = updatedProfiles.filter(obj => obj.id === ProfileId)[0];
                profilesFilter.push({
                    ...Profile
                })
            }
            setSelectedProfiles(profilesFilter);


            // Get uis
            const uis = await uisService.getUIs();
            const updatedUis = uis.map(uisObj => ({
                ...uisObj,
                ui_id: uisObj.id,
                label: uisObj.nombre
            }));
            setUisData(updatedUis);

            // Find the initial uis
            const uisFilter = [];
            for (let ui in userData.uis) {
                let uiId = userData.uis[ui].ui_id
                const UI = updatedUis.filter(obj => obj.id === uiId)[0];
                uisFilter.push({
                    ...UI
                })
            }
            setSelectedUis(uisFilter);

            // Get uos
            const uos = await uosService.getUOs();
            const updatedUos = uos.map(uosObj => ({
                ...uosObj,
                uo_id: uosObj.id,
                label: uosObj.unidad_operativa
            }));
            setUosData(updatedUos);

            // Find the initial uis
            const uosFilter = [];
            for (let uo in userData.uos) {
                let uoId = userData.uos[uo].uo_id
                const UO = updatedUos.filter(obj => obj.id === uoId)[0];
                uosFilter.push({
                    ...UO
                })
            }
            setSelectedUos(uosFilter);

        };

        fetchUserData();
    }, [userId]);

    // Validación del formulario
    const validationSchema = Yup.object().shape({
        matricula: Yup.string().max(255).required('La matricula es obligatoria.'),
        email: Yup.string().email('El correo tiene que ser válido.').max(255).required('El correo es obligatorio.'),
        name: Yup.string().max(255).required('El nombre es obligatorio.'),
        password: Yup.string().max(255)
    });

    const handleChangeProfiles = (event, newValue) => {
        let tempUser = { ...user };
    
        tempUser.profiles = newValue.map(profileData => {
            let existingProfile = undefined;
            try {
                existingProfile = user.profiles.find(profile => profile.profile_id === profileData.id);
            } catch (error) {
                let existingProfile = undefined;
            }
    
            if (existingProfile) {
                return {
                    ...existingProfile,
                    ...profileData,
                    profile_id: profileData.id,
                    priv_export: existingProfile.priv_export,
                    priv_print: existingProfile.priv_print,
                    priv_hard_delete: existingProfile.priv_hard_delete,
                    priv_soft_delete: existingProfile.priv_soft_delete,
                    priv_update: existingProfile.priv_update,
                    priv_read: existingProfile.priv_read,
                    priv_create: existingProfile.priv_create
                };
            }
    
            return {
                ...profileData,
                profile_id: profileData.id,
                priv_export: false,
                priv_print: false,
                priv_hard_delete: false,
                priv_soft_delete: false,
                priv_update: false,
                priv_read: false,
                priv_create: false
            };
        });
    
        setUser(tempUser);
        setSelectedProfiles(newValue);
    };

    const handleChangeUis = (event, newValue) => {
        setSelectedUis(newValue);
    };

    const handleChangeUos = (event, newValue) => {
        setSelectedUos(newValue);
    };

    const handleCheckboxTable = (event, profileId, permission) => {
        const updatedUser = { ...user };
        const profile = updatedUser.profiles.find(filterProfile => filterProfile.profile_id === profileId);
        if (profile) {
            profile[permission] = event.target.checked;
        }
        setUser(updatedUser);
    };    
    
    return (
        <>
            <Grid item xs={12} sm={6}>
                <Formik
                    enableReinitialize
                    initialValues={{
                        matricula: user.matricula || '',
                        email: user.email || '',
                        name: user.name || name.Name,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        const submitValues = {
                            ...values,
                            password: values.password === "" ? null : values.password
                        }

                        service.updateUser(userId, submitValues, user.profiles, selectedUis, selectedUos)
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
                                        name="name"
                                        value={values.name}
                                        disabled={!isDevMode}
                                        onChange={(e) => {
                                            setName({ Name: e.target.value, valid: true });
                                            handleChange(e);
                                        }}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.name && errors.name)}
                                        helperText={touched.name && errors.name}
                                    />
                                </div>

                                <div style={{ marginBottom: '16px' }}>
                                    <TextField
                                        fullWidth
                                        label="Correo Electrónico"
                                        name="email"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.email}
                                        error={Boolean(touched.email && errors.email)}
                                        helperText={touched.email && errors.email}
                                    />
                                </div>

                                <div style={{ marginBottom: '16px' }}>
                                    <TextField
                                        fullWidth
                                        label="Contraseña ( Dejar en blanco si no va a ver cambios )"
                                        name="password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.password}
                                        error={Boolean(touched.password && errors.password)}
                                        helperText={touched.password && errors.password}
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
                <Grid sx={{ mt: 2 }} item>
                    {uisData.length > 0 ? (
                        <Autocomplete
                            multiple
                            options={uisData}
                            getOptionLabel={(option) => option.label}
                            value={selectedUis}
                            onChange={handleChangeUis}
                            defaultValue={selectedUis}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderInput={(params) => <TextField label="Unidades" {...params} />}
                        />
                    ) : (
                        <p>Cargando</p>
                    )}
                </Grid>
                <Grid sx={{ mt: 2 }} item>
                    {uosData.length > 0 ? (
                        <Autocomplete
                            multiple
                            options={uosData}
                            getOptionLabel={(option) => option.label}
                            value={selectedUos}
                            onChange={handleChangeUos}
                            defaultValue={selectedUos}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderInput={(params) => <TextField label="Delegacion" {...params} />}
                        />
                    ) : (
                        <p>Cargando</p>
                    )}
                </Grid>
            </Grid>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                    <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Crear</TableCell>
                        <TableCell>Leer</TableCell>
                        <TableCell>Editar</TableCell>
                        <TableCell>Borrar</TableCell>
                        <TableCell>Borrar permanentemente</TableCell>
                        <TableCell>Imprimir</TableCell>
                        <TableCell>Exportar</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {user && user.profiles ? (
                            user.profiles.map((profile, index) => (
                                <TableRow key={index}>
                                    <TableCell>{profile.profile}</TableCell>
                                    <TableCell>
                                        <Checkbox
                                            checked={profile.priv_create}
                                            onChange={(e) => handleCheckboxTable(e, profile.profile_id, "priv_create")}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Checkbox
                                            checked={profile.priv_read}
                                            onChange={(e) => handleCheckboxTable(e, profile.profile_id, "priv_read")}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Checkbox
                                            checked={profile.priv_update}
                                            onChange={(e) => handleCheckboxTable(e, profile.profile_id, "priv_update")}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Checkbox
                                            checked={profile.priv_soft_delete}
                                            onChange={(e) => handleCheckboxTable(e, profile.profile_id, "priv_soft_delete")}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Checkbox
                                            checked={profile.priv_hard_delete}
                                            onChange={(e) => handleCheckboxTable(e, profile.profile_id, "priv_hard_delete")}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Checkbox
                                            checked={profile.priv_print}
                                            onChange={(e) => handleCheckboxTable(e, profile.profile_id, "priv_print")}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Checkbox
                                            checked={profile.priv_export}
                                            onChange={(e) => handleCheckboxTable(e, profile.profile_id, "priv_export")}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <p>Cargando</p>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default UsersUpdate;
