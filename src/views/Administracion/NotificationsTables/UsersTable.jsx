import * as React from 'react';

// material-ui
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { DataGrid } from '@mui/x-data-grid';

// project import
import UsersService from 'contexts/JWTContext/Users';

const service = new UsersService();

export default function Crud() {
    const [rows, setRows] = React.useState([]);
    const [filteredRows, setFilteredRows] = React.useState([]);
    const [searchText, setSearchText] = React.useState('');
    const [selectionModel, setSelectionModel] = React.useState([]);

    const handleGetUbicaciones = async () => {
        const Users = await service.getUsers();
        console.log(Users);
        setRows(Users);
        setFilteredRows(Users);
    };

    React.useEffect(() => {
        handleGetUbicaciones();
    }, []);

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchText(value);

        const filtered = rows.filter((row) =>
            Object.values(row).some((field) =>
                String(field).toLowerCase().includes(value)
            )
        );
        setFilteredRows(filtered);
    };

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            type: 'number',
            flex: 1,
            align: 'left',
            headerAlign: 'left',
            minWidth: 124,
        },
        {
            field: 'name',
            headerName: 'Nombre',
            flex: 1.5,
            minWidth: 250,
            align: 'left',
            headerAlign: 'left',
        },
        {
            field: 'profiles',
            headerName: 'Perfiles',
            flex: 0.5,
            minWidth: 124,
            align: 'left',
            headerAlign: 'left',
            valueGetter: (params) => params.map(p => p.profile).join(', ') || ''
        },
        {
            field: 'uis',
            headerName: 'Unidad Informativa',
            flex: 0.5,
            minWidth: 124,
            align: 'left',
            headerAlign: 'left',
            valueGetter: (params) => params.row?.uis ? params.row.uis.map(u => u.name).join(', ') : ''
        },
        {
            field: 'uos',
            headerName: 'Delegación',
            flex: 0.5,
            minWidth: 124,
            align: 'left',
            headerAlign: 'left',
            valueGetter: (params) => params.row?.uos ? params.row.uos.map(uo => uo.name).join(', ') : ''
        },
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
                    selectionModel={selectionModel}
                    autoHeight
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 25]}
                    pagination
                />
            </Box>
        </>
    );
}
