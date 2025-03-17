import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-import
import { ThemeMode } from 'config';
import Chip from 'ui-component/extended/Chip';

// third party
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';

// Extiende Day.js con el plugin
dayjs.extend(relativeTime);

// Configura el idioma global a español
dayjs.locale('es');

function calculateRelativeTime(dateString) {
    const inputDate = dayjs(dateString);
    const now = dayjs();
  
    // Verifica si han pasado más de 7 días
    if (now.diff(inputDate, 'day') > 7) {
      return `${inputDate.format('YYYY-MM-DD')}`;
    }
  
    // Si no han pasado 7 días, muestra el tiempo transcurrido
    return `${inputDate.from(now)}`;
  }

const ListItemWrapper = ({ children }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                cursor: 'pointer',
                '&:hover': {
                    bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'primary.light'
                }
            }}
        >
            {children}
        </Box>
    );
};

ListItemWrapper.propTypes = {
    children: PropTypes.node
};

// ==============================|| NOTIFICATION LIST ITEM ||============================== //

const NotificationList = ({ notificationsData, setRead }) => {
    const theme = useTheme();
    const containerSX = { pl: 7 };

    return (
        <List sx={{ width: '100%', maxWidth: { xs: 300, md: 330 }, py: 0 }}>
            {notificationsData.map((notification, index) => 
                <ListItemWrapper key={notification.ID}>
                    {/* {console.log(notification)} */}
                    <ListItem alignItems="center" disablePadding>
                        <ListItemAvatar>
                            <NotificationsActiveIcon />
                        </ListItemAvatar>
                        <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between" sx={{ flex: 1 }}>
                            <Typography variant="h4">Sistema</Typography>
                            <Typography variant="caption">{calculateRelativeTime(notification.CreatedAt)}</Typography>
                        </Stack>
                    </ListItem>
                    <Stack spacing={2} sx={containerSX}>
                        <Typography variant={notification.Seen ? "subtitle2" : "subtitle1"}>{notification.Message}</Typography>
                        {!notification.Seen ? 
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Chip
                                    label="Marcar como leído"
                                    chipcolor="warning"
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        width: 'min-content',
                                        border: 'none',
                                        bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'warning.light'
                                    }}
                                    onClick={() => {setRead(notification.ID)}}
                                />
                            </Stack>
                            : null
                        }
                    </Stack>
                </ListItemWrapper>
            )}
        </List>
    );
};

export default NotificationList;
