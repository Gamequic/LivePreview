import * as React from 'react';

// material-ui
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { DataGrid } from '@mui/x-data-grid';

// project import
import UsersService from 'contexts/JWTContext/Users';
import ProfilesService from 'contexts/JWTContext/Profiles';

const service = new UsersService();
const profilesService = new ProfilesService();

export default function Crud({ selectionModel, setSelectionModel }) {
    const [rows, setRows] = React.useState([]);
    const [filteredRows, setFilteredRows] = React.useState([]);
    const [searchText, setSearchText] = React.useState('');
    const [profiles, setProfiles] = React.useState([]);

    const handleGetUbicaciones = async () => {
        const Users = await service.getUsers();
        setRows(Users);
        setFilteredRows(Users);

        // get profiles
        const profilesData = await profilesService.getProfiles();
        setProfiles(profilesData);
    };

    React.useEffect(() => {
        handleGetUbicaciones();
    }, []);

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchText(value);
    
        const searchInObject = (obj, depth = 0) => {
            if (depth > 2 || obj === null || typeof obj !== "object") {
                return false;
            }
    
            return Object.values(obj).some((field) => {
                if (typeof field === "object" && field !== null) {
                    return searchInObject(field, depth + 1);
                }
                return String(field).toLowerCase().includes(value);
            });
        };
    
        const filtered = rows.filter((row) => searchInObject(row));
    
        setFilteredRows(filtered);
    };

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            type: 'number',
            flex: 0.25,
            align: 'left',
            headerAlign: 'left',
            minWidth: 124,
        },
        {
            field: 'Name',
            headerName: 'Nombre',
            flex: 1,
            minWidth: 250,
            align: 'left',
            headerAlign: 'left',
        },
        {
            field: 'Profiles',
            headerName: 'Perfiles',
            flex: 0.5,
            minWidth: 124,
            align: 'left',
            headerAlign: 'left',
            valueGetter: (params) => params.map(p => profiles.find(item => item.id === p)?.name).join(', ') || ''
        }
    ];

    return (
        <>
            <Stack spacing={2} sx={{ p: 2 }}>
                <TextField
                    fullWidth
                    label="Buscar en Usuarios"
                    value={searchText}
                    onChange={handleSearch}
                    variant="outlined"
                />
            </Stack>
            <Box sx={{ width: '100%' }}>
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    checkboxSelection
                    onRowSelectionModelChange={(newSelection) => setSelectionModel(newSelection)}
                    selectionModel={selectionModel || []}
                    autoHeight
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 25]}
                    pagination
                />
            </Box>
        </>
    );
}