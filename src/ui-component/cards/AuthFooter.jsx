// material-ui
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
    <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle2" target="_blank" underline="hover">
            Live Preview - Calleros 
        </Typography>
        <Typography variant="subtitle2" component={Link} href="https://gamequic.github.io/Portafolio/" target="_blank" underline="hover">
            Calleros.com
        </Typography>
    </Stack>
);

export default AuthFooter;
