import PropTypes from 'prop-types';
import React, { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

// third party
import * as Yup from 'yup';
import { Formik, Form } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import useAuth from 'hooks/useAuth';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// ===============================|| JWT LOGIN ||=============================== //

const JWTLogin = ({ loginProp, ...others }) => {
    const theme = useTheme();

    const { login } = useAuth();

    return (
        <Formik
            enableReinitialize
            initialValues={{
                Email: 'demiancalleros0@gmail.com',
                Password: '12345678',
            }}
            validationSchema={Yup.object().shape({
                Email: Yup.string().max(255).required('El nombre de usuario es obligatorio.'),
                Password: Yup.string().max(255).required('La contraseña es obligatoria.')
            })}
            onSubmit={(values, { setErrors, setStatus, setSubmitting }) => {
                try {
                    login(values.Email, values.Password)
                        .then(() => {
                            setStatus({ success: true });
                            setSubmitting(false);
                        })
                        .catch((err) => {
                            console.error(err);

                            let errorMessage = "Error desconocido";
                            if (err.message === "Cannot read properties of undefined (reading 'status')") {
                                errorMessage = "No hay conexión a Internet";
                            }
                            if (err === "User not found\n") {
                                errorMessage = "Usuario o contraseña incorrectos";
                            }

                            setStatus({ success: false });
                            setErrors({ submit: errorMessage });
                            setSubmitting(false);
                        });
                } catch (err) {
                    console.error(err);
                    setStatus({ success: false });
                    setErrors({ submit: "Error en la autenticación" });
                    setSubmitting(false);
                }
            }}
        >
            {({ errors, touched, handleChange, handleBlur, values }) => {
                const [showPassword, setShowPassword] = useState(false);

                return (
                    <Form>
                        <div style={{ marginBottom: '16px' }}>
                            <TextField
                                fullWidth
                                label="Correo Electrónico"
                                name="Email"
                                value={values.Email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={Boolean(touched.Email && errors.Email)}
                                helperText={touched.Email && errors.Email}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <TextField
                                fullWidth
                                label="Contraseña"
                                type={showPassword ? "text" : "password"}
                                name="Password"
                                value={values.Password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={Boolean(touched.Password && errors.Password)}
                                helperText={touched.Password && errors.Password}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </div>

                        {errors.submit && (
                            <div style={{ color: 'red', marginBottom: '16px' }}>
                                {errors.submit}
                            </div>
                        )}

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
                                    Iniciar Sesión
                                </Button>
                            </AnimateButton>
                        </Box>
                    </Form>
                );
            }}
        </Formik>
    );
};

JWTLogin.propTypes = {
    loginProp: PropTypes.number
};

export default JWTLogin;
