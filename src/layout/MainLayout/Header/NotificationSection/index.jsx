import { useEffect, useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import NotificationList from './NotificationList';
import { ThemeMode } from 'config';
import NotificationService from 'contexts/JWTContext/Notifications';

// assets
import { IconBell } from '@tabler/icons-react';
import useAuth from 'hooks/useAuth';
import logo from 'assets/images/favicon.ico';

const service = new NotificationService();

// notification status options
const status = [
    {
        value: 'all',
        label: 'Todas las notificaciones'
    },
    {
        value: 'unread',
        label: 'No leído'
    },
    {
        value: 'read',
        label: 'Leído'
    },
];

// ==============================|| NOTIFICATION ||============================== //

const NotificationSection = () => {
    const theme = useTheme();
    const downMD = useMediaQuery(theme.breakpoints.down('md'));

    const { user } = useAuth();

    const [notifications, setNotifications] = useState([]);
    const [filteredNotifications, setFilteredNotifications] = useState([]);

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');
    

    // Traer todas las notificaciones previas
    const handleGetNotificacions = async ( ) => {

        // Traer las notificaciones pasadas
        const NotificationData = await service.getNotificacions(user.id);
        setNotifications(NotificationData);
        setFilteredNotifications(NotificationData);

        // Pedir permiso para mandar notificaciones
        requestNotificationPermission();

        // Iniciar conexion para traer notificaiones en vivo
        const { cleanup } = service.WebSocketNotifications(user.id, handleOnNotification);
        
        // Devuelve la función de limpieza
        return cleanup;
    }
    useEffect(() => {
        // Variable para almacenar la función de limpieza del WebSocket
        let cleanup;
      
        // Función asincrónica para inicializar las notificaciones
        const initializeNotifications = async () => {
          // Llama a la función que obtiene las notificaciones iniciales y establece la conexión al WebSocket
          cleanup = await handleGetNotificacions();
        };
      
        // Ejecuta la función asincrónica para iniciar el proceso
        initializeNotifications();
      
        // Retorna la función de limpieza
        // Esto se ejecutará automáticamente cuando el componente se desmonte o el efecto se actualice
        return () => {
          // Si la conexión al WebSocket fue establecida, llama a la función de limpieza
          if (cleanup) {
            cleanup(); // Cierra el WebSocket de forma segura
          }
        };
      }, []); // Dependencias vacías aseguran que este efecto se ejecute solo una vez, al montar el componente       

    // Function para pedir permiso al navegador para mandar notificaiones
    function requestNotificationPermission() {
        if ("Notification" in window) {
          Notification.requestPermission()
        }
    }

    // Agrega la notificacion en vivo a la lista y lanza una del sistema
    const handleOnNotification = (newNotification) => {
        const parsedNotification = typeof newNotification === "string" 
            ? JSON.parse(newNotification) 
            : newNotification;

        // Agregarlo a la lista de notificaciones
        setFilteredNotifications((prevItems) => [parsedNotification, ...prevItems]);
        setNotifications((prevItems) => [parsedNotification, ...prevItems]);

        // Mandar notificacion al navegador, solo si esta permitido
        if (Notification.permission === "granted") {
            new Notification("Live Preview - Calleros", {
                body: parsedNotification.message,
                icon: logo,
            });
        }
    }

    /**
     * anchorRef is used on different componets and specifying one type leads to other components throwing an error
     * */
    const anchorRef = useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    const ReadMessage = (messageId) => {
        // Crea una copia del array de notificaciones y actualiza el elemento con el ID especificado
        const updatedNotifications = notifications.map((item) =>
            item.id === messageId ? { ...item, read: true } : item
        );
        // Actualiza el estado con las notificaciones modificadas
        setNotifications(updatedNotifications);
    
        // Si necesitas actualizar las notificaciones filtradas también
        const updatedFilteredNotifications = filteredNotifications.map((item) =>
            item.id === messageId ? { ...item, read: true } : item
        );
        setFilteredNotifications(updatedFilteredNotifications);

        // Indicar a la base de datos que se leyo el mensaje
        service.ReadMessage(messageId);
    };
    

    const handleChange = (event) => {
        event?.target.value && setValue(event?.target.value);
        if ( event?.target.value === 'unread' ) {
            setFilteredNotifications(notifications.filter(item => item.read === false))
        } else if ( event?.target.value === 'read' ) {
            setFilteredNotifications(notifications.filter(item => item.read === true))
        } else {
            setFilteredNotifications(notifications);
        }
    };

    return (
        <>
            <Box sx={{ ml: 2 }}>
                <Avatar
                    variant="rounded"
                    sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.mediumAvatar,
                        transition: 'all .2s ease-in-out',
                        bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'secondary.light',
                        color: theme.palette.mode === ThemeMode.DARK ? 'warning.dark' : 'secondary.dark',
                        '&[aria-controls="menu-list-grow"],&:hover': {
                            bgcolor: theme.palette.mode === ThemeMode.DARK ? 'warning.dark' : 'secondary.dark',
                            color: theme.palette.mode === ThemeMode.DARK ? 'grey.800' : 'secondary.light'
                        }
                    }}
                    ref={anchorRef}
                    aria-controls={open ? 'menu-list-grow' : undefined}
                    aria-haspopup="true"
                    onClick={handleToggle}
                    color="inherit"
                >
                    {notifications.filter(obj => !obj.read).length > 0 ? 
                        <Badge
                            color="secondary"
                            badgeContent={notifications.filter(obj => !obj.read).length}
                            max={999}
                            sx={{
                            "& .MuiBadge-badge": {
                                top: 4, // Ajusta la posición vertical
                                right: 4, // Ajusta la posición horizontal
                                transform: "scale(1) translate(50%, -50%)", // Ajusta la escala y posición
                            },
                            }}
                        >
                            <IconBell stroke={1.5} size="20px" />
                        </Badge>
                        :
                        <IconBell stroke={1.5} size="20px" />
                    }
                </Avatar>
            </Box>

            <Popper
                placement={downMD ? 'bottom' : 'bottom-end'}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                modifiers={[
                    {
                        name: 'offset',
                        options: {
                            offset: [downMD ? 5 : 0, 20]
                        }
                    }
                ]}
            >
                {({ TransitionProps }) => (
                    <ClickAwayListener onClickAway={handleClose}>
                        <Transitions position={downMD ? 'top' : 'top-right'} in={open} {...TransitionProps}>
                            <Paper>
                                {open && (
                                    <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                        <Grid container direction="column" spacing={2}>
                                            <Grid item xs={12}>
                                                <Grid container alignItems="center" justifyContent="space-between" sx={{ pt: 2, px: 2 }}>
                                                    <Grid item>
                                                        <Stack direction="row" spacing={2}>
                                                            <Typography variant="subtitle1">Todas las notificaciones</Typography>
                                                            {notifications.filter(obj => !obj.read).length > 0 ? 
                                                                <Chip
                                                                    size="small"
                                                                    label={notifications.filter(obj => !obj.read).length}
                                                                    sx={{ color: 'background.default', bgcolor: 'warning.dark' }}
                                                                />: null
                                                            }
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <PerfectScrollbar
                                                    style={{ height: '100%', maxHeight: 'calc(100vh - 205px)', overflowX: 'hidden' }}
                                                >
                                                    <Grid container direction="column" spacing={2}>
                                                        <Grid item xs={12}>
                                                            <Box sx={{ px: 2, pt: 0.25 }}>
                                                                <TextField
                                                                    id="outlined-select-currency-native"
                                                                    select
                                                                    fullWidth
                                                                    value={value}
                                                                    onChange={handleChange}
                                                                    SelectProps={{
                                                                        native: true
                                                                    }}
                                                                >
                                                                    {status.map((option) => (
                                                                        <option key={option.value} value={option.value}>
                                                                            {option.label}
                                                                        </option>
                                                                    ))}
                                                                </TextField>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={12} p={0}>
                                                            <Divider sx={{ my: 0 }} />
                                                        </Grid>
                                                    </Grid>
                                                    <NotificationList notificationsData={filteredNotifications} setRead={ReadMessage} />
                                                </PerfectScrollbar>
                                            </Grid>
                                        </Grid>
                                    </MainCard>
                                )}
                            </Paper>
                        </Transitions>
                    </ClickAwayListener>
                )}
            </Popper>
        </>
    );
};

export default NotificationSection;
