// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

// project imports
import { ThemeMode } from 'config';

// import logoDark from 'assets/images/assets/images/favicon.ico';
import logo from 'assets/images/favicon.ico';

// ==============================|| LOGO SVG ||============================== //

const Logo = ({ main }) => {
    const theme = useTheme();

    return (
        <Box
            component="img"
            src={theme.palette.mode === ThemeMode.DARK ? logo : logo}
            alt="Logo"
            sx={{
                width: {
                    xs: main ? 50 : 100, // Cellphones
                    sm: main ? 50 : 100, // Tablets
                    md: main ? 50 : 100, // Laptops
                },
            }}
        />
    );
};

export default Logo;
