import PropTypes from 'prop-types';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from "react-to-print";

// material-ui
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { visuallyHidden } from '@mui/utils';

// project imports
import Chip from 'ui-component/extended/Chip';
import MainCard from 'ui-component/cards/MainCard';
import useConfirm from 'ui-component/confirmDialog/useConfirm';

import UsersService from 'contexts/JWTContext/Users';
import ProfilesService from 'contexts/JWTContext/Profiles';

import permissionManager from 'utils/permissionManager';

// assets
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterListTwoTone';
import PrintIcon from '@mui/icons-material/PrintTwoTone';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

// Service
const service = new UsersService();
const profileService = new ProfilesService();

// table sort
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

const getComparator = (order, orderBy) =>
    order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

// table header options
const headCells = [
    {
        id: 'ID',
        numeric: false,
        label: 'ID',
        align: 'left'
    },
    {
        id: 'Name',
        numeric: true,
        label: 'Nombre',
        align: 'left'
    }
];

// ==============================|| TABLE HEADER ||============================== //

function EnhancedTableHead({ onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, selected, printing }) {
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {/* <TableCell padding="checkbox" sx={{ pl: 3 }}>
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts'
                        }}
                    />
                </TableCell> */}
                {numSelected > 0 && (
                    <TableCell padding="none" colSpan={6}>
                        <EnhancedTableToolbar numSelected={selected.length} />
                    </TableCell>
                )}
                {numSelected <= 0 &&
                    headCells.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.align}
                            padding={headCell.disablePadding ? 'none' : 'normal'}
                            sortDirection={orderBy === headCell.id ? order : false}
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                <TableCell sortDirection={false} align="center" sx={{ pr: 3 }}>
                    Perfiles
                </TableCell>
                { !printing ? 
                <TableCell sortDirection={false} align="center" sx={{ pr: 3 }}>
                    Acciones
                </TableCell> : null
                }
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    selected: PropTypes.array,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
};

// ==============================|| TABLE HEADER TOOLBAR ||============================== //

const EnhancedTableToolbar = ({ numSelected }) => (
    <Toolbar
        sx={{
            p: 0,
            pl: 1,
            pr: 1,
            ...(numSelected > 0 && {
                color: (theme) => theme.palette.secondary.main
            })
        }}
    >
        {numSelected > 0 ? (
            <Typography color="inherit" variant="h4">
                {numSelected} Selected
            </Typography>
        ) : (
            <Typography variant="h6" id="tableTitle">
                Nutrition
            </Typography>
        )}
        <Box sx={{ flexGrow: 1 }} />
        {numSelected > 0 && (
            <Tooltip title="Delete">
                <IconButton size="large">
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        )}
    </Toolbar>
);

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired
};

// ==============================|| CUSTOMER LIST ||============================== //

const CustomerList = () => {
    const navigate = useNavigate();
    const tableRef = React.useRef();

    const [ printing, setPrinting ] = React.useState(false);

    const print = useReactToPrint({
        contentRef: tableRef
    });
    const handlePrint = () => {
        setPrinting(true)
    }

    React.useEffect(() => {
        if (printing) {
            print();
            setPrinting(false);
        }
    }, [printing]);

    const { openConfirmDialog, ConfirmDialogComponent } = useConfirm();

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [search, setSearch] = React.useState('');
    const [rows, setRows] = React.useState([]);
    const [profiles, setProfiles] = React.useState([]);

    async function fetchData() {
        const usersData = await service.getUsers();
        setRows(usersData);
        const profilesData = await profileService.getProfiles();
        setProfiles(profilesData);
    }

    React.useEffect(() => {
        fetchData();
    }, []);

    const handleSearch = (event) => {
        const newString = event?.target.value;
        setSearch(newString || '');

        if (newString) {
            const newRows = rows.filter((row) => {
                let matches = true;

                const properties = ['id', 'name', 'email', 'matricula'];
                let containsQuery = false;

                properties.forEach((property) => {
                    if (row[property].toString().toLowerCase().includes(newString.toString().toLowerCase())) {
                        containsQuery = true;
                    }
                });

                if (!containsQuery) {
                    matches = false;
                }
                return matches;
            });
            setRows(newRows);
        } else {
            fetchData();
        }
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            if (selected.length > 0) {
                setSelected([]);
            } else {
                const newSelectedId = rows.map((n) => n.name);
                setSelected(newSelectedId);
            }
            return;
        }
        setSelected([]);
    };

    const handleDelete = ({userId, hard}) => {
        try {
            if (hard) {
                service.hardDeleteUser(userId);
            } else {
                service.softDeleteUser(userId);
            }
        } catch (error) {
            throw new Error(error);
        }
        const tempRows = rows.filter(item => item.id !== userId);
        setRows(tempRows)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        event?.target.value && setRowsPerPage(parseInt(event?.target.value, 10));
        setPage(0);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <>
            <MainCard content={false}>
                <CardContent>
                    <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" />
                                        </InputAdornment>
                                    )
                                }}
                                onChange={handleSearch}
                                placeholder="Buscar usuarios"
                                value={search}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
                            {permissionManager({ profiles: [1,2,3], permission: 'create'}) ? 
                            <Tooltip title="Agregar usuario">
                                <IconButton onClick={() => {navigate('/users/create/')}} size="large">
                                    <AddCircleOutlineIcon />
                                </IconButton>
                            </Tooltip> : null 
                            }
                            <Tooltip title="Exportar">
                                <IconButton onClick={service.exportUsers} size="large">
                                    <FileDownloadIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Print">
                                <IconButton onClick={handlePrint} size="large">
                                    <PrintIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </CardContent>

                {/* table */}
                <div ref={tableRef}>
                    <TableContainer>
                        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                            <EnhancedTableHead
                                printing={printing}
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={rows.length}
                                selected={selected}
                            />
                            <TableBody>
                                {stableSort(rows, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        /** Make sure no display bugs if row isn't an OrderData object */
                                        if (typeof row === 'number') return null;
                                        // const isItemSelected = isSelected(row.name);
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover
                                                // role="checkbox"
                                                // aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={index}
                                                // selected={isItemSelected}
                                            >
                                                {/* <TableCell padding="checkbox" sx={{ pl: 3 }} onClick={(event) => handleClick(event, row.name)}>
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            'aria-labelledby': labelId
                                                        }}
                                                    />
                                                </TableCell> */}
                                                <TableCell
                                                    component="th"
                                                    id={labelId}
                                                    scope="row"
                                                    // onClick={(event) => handleClick(event, row.name)}
                                                    // sx={{ cursor: 'pointer' }}
                                                >{row.ID}</TableCell>
                                                <TableCell>{row.Name}</TableCell>
                                                <TableCell align="center">
                                                    {Array.isArray(row.Profiles) && row.Profiles.length > 0 ? (
                                                        row.Profiles.map((profileData, profileIndex) => (
                                                            <Chip key={profileIndex} label={profiles.find(item => item.id === profileData)?.name} size="small" chipcolor="success" />
                                                        ))
                                                    ) : (
                                                        <p>No hay perfiles disponibles</p>
                                                    )}
                                                </TableCell>
                                                <TableCell align="center" sx={{ pr: 3 }}>
                                                    {permissionManager({ profiles: [1,2,3], permission: 'update'}) ? 
                                                    <Tooltip title="Editar perfil">
                                                        <IconButton
                                                            color="secondary"
                                                            size="large"
                                                            aria-label="View"
                                                            onClick={() => {navigate('/users/update/'+row.id)}}
                                                            disabled = {!permissionManager({ profiles: [1,2,3], permission: 'update'})}
                                                        >
                                                            <EditTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                                        </IconButton>
                                                    </Tooltip> : null
                                                    }

                                                    {permissionManager({ profiles: [1,2,3], permission: 'soft_delete'}) ? 
                                                    <Tooltip title="Enviar a la papelera">
                                                        <IconButton
                                                            color="secondary"
                                                            size="large"
                                                            aria-label="View"
                                                            onClick={() => openConfirmDialog(() => {handleDelete({userId: row.id, hard: false})}, ('¿Estás segura de que quieres enviar a la usuario ' + row.name + ' en la papelera?'))}
                                                            disabled = {!permissionManager({ profiles: [1,2,3], permission: 'soft_delete'})}
                                                        >
                                                            <DeleteIcon sx={{ fontSize: '1.3rem' }} />
                                                        </IconButton>
                                                    </Tooltip> : null
                                                    }

                                                    {permissionManager({ profiles: [1,2,3], permission: 'hard_delete'}) ? 
                                                    <Tooltip title="Eliminar de forma permanente">
                                                        <IconButton
                                                            color="secondary"
                                                            size="large"
                                                            aria-label="View"
                                                            onClick={() => openConfirmDialog(() => {handleDelete({userId: row.id, hard: true})}, ('¿Está seguro de que desea eliminar el usuario ' + row.name + ' de forma permanente?'))}
                                                            disabled = {!permissionManager({ profiles: [1,2,3], permission: 'hard_delete'})}
                                                        >
                                                            <DeleteForeverIcon sx={{ fontSize: '1.3rem' }} />
                                                        </IconButton>
                                                    </Tooltip> : null
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                {emptyRows > 0 && (
                                    <TableRow sx={{ height: 53 * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

                {/* table pagination */}
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </MainCard>

            {ConfirmDialogComponent}
        </>
    );
};

export default CustomerList;
