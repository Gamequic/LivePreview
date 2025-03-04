import * as React from 'react';
import clsx from 'clsx';
import { animated, useSpring } from '@react-spring/web';
import { styled, alpha } from '@mui/material/styles';

import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import ArticleIcon from '@mui/icons-material/Article';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FolderRounded from '@mui/icons-material/FolderRounded';
import ImageIcon from '@mui/icons-material/Image';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { useTreeItem2 } from '@mui/x-tree-view/useTreeItem2';
import {
  TreeItem2Checkbox,
  TreeItem2Content,
  TreeItem2IconContainer,
  TreeItem2Label,
  TreeItem2Root,
} from '@mui/x-tree-view/TreeItem2';
import { TreeItem2Icon } from '@mui/x-tree-view/TreeItem2Icon';
import { TreeItem2Provider } from '@mui/x-tree-view/TreeItem2Provider';
import { TreeItem2DragAndDropOverlay } from '@mui/x-tree-view/TreeItem2DragAndDropOverlay';
import { useTheme } from '@mui/material/styles';

// project imports
import LogsService from 'contexts/JWTContext/Logs';

const service = new LogsService();

function DotIcon() {
  return (
    <Box
      sx={{
        width: 6,
        height: 6,
        borderRadius: '70%',
        bgcolor: 'warning.main',
        display: 'inline-block',
        verticalAlign: 'middle',
        zIndex: 1,
        mx: 1,
      }}
    />
  );
}

const StyledTreeItemRoot = styled(TreeItem2Root)(({ theme }) => ({
  color: theme.palette.grey[400],
  position: 'relative',
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: theme.spacing(3.5),
  },
  ...theme.applyStyles('light', {
    color: theme.palette.grey[800],
  }),
}));

const CustomTreeItemContent = styled(TreeItem2Content)(({ theme }) => ({
  flexDirection: 'row-reverse',
  borderRadius: theme.spacing(0.7),
  marginBottom: theme.spacing(0.5),
  marginTop: theme.spacing(0.5),
  padding: theme.spacing(0.5),
  paddingRight: theme.spacing(1),
  fontWeight: 500,
  [`&.Mui-expanded `]: {
    '&:not(.Mui-focused, .Mui-selected, .Mui-selected.Mui-focused) .labelIcon': {
      color: theme.palette.primary.dark,
      ...theme.applyStyles('light', {
        color: theme.palette.primary.main,
      }),
    },
    '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      left: '16px',
      top: '44px',
      height: 'calc(100% - 48px)',
      width: '1.5px',
      backgroundColor: theme.palette.grey[700],
      ...theme.applyStyles('light', {
        backgroundColor: theme.palette.grey[300],
      }),
    },
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: 'white',
    ...theme.applyStyles('light', {
      color: theme.palette.primary.main,
    }),
  },
  [`&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
    ...theme.applyStyles('light', {
      backgroundColor: theme.palette.primary.main,
    }),
  },
}));

const AnimatedCollapse = animated(Collapse);

function TransitionComponent(props) {
  const style = useSpring({
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(0,${props.in ? 0 : 20}px,0)`,
    },
  });

  return <AnimatedCollapse style={style} {...props} />;
}

function CustomLabel({ icon: Icon, expandable, children, onDownload, onSelect, ...other }) {
  return (
    <TreeItem2Label
      {...other}
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
      onClick={expandable ? undefined : onSelect}
    >
      {Icon && (
        <Box
          component={Icon}
          className="labelIcon"
          color="inherit"
          sx={{ mr: 1, fontSize: '1.2rem' }}
        />
      )}
      <Typography>{children}</Typography>
      {expandable && <DotIcon />}
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          onDownload();
        }}
        size="small"
        sx={{ ml: 1 }}
      >
        <DownloadIcon fontSize="small" />
      </IconButton>
    </TreeItem2Label>
  );
}

const isExpandable = (reactChildren) => {
  if (Array.isArray(reactChildren)) {
    return reactChildren.length > 0 && reactChildren.some(isExpandable);
  }
  return Boolean(reactChildren);
};

const getIconFromFileType = (fileType) => {
  switch (fileType) {
    case 'image':
      return ImageIcon;
    case 'pdf':
      return PictureAsPdfIcon;
    case 'doc':
      return ArticleIcon;
    case 'video':
      return VideoCameraBackIcon;
    case 'folder':
      return FolderRounded;
    case 'pinned':
      return FolderOpenIcon;
    case 'trash':
      return DeleteIcon;
    default:
      return ArticleIcon;
  }
};

const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {
  const { id, itemId, label, disabled, children, setLogData, ...other } = props;

  const {
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getCheckboxProps,
    getLabelProps,
    getGroupTransitionProps,
    getDragAndDropOverlayProps,
    status,
    publicAPI,
  } = useTreeItem2({ id, itemId, children, label, disabled, rootRef: ref });

  const item = publicAPI.getItem(itemId);
  const expandable = isExpandable(children);
  const icon = expandable ? FolderRounded : getIconFromFileType(item.fileType);

  const handleDownload = async () => {
    const logData = await service.getZipLog(itemId.replace(/\\/g, '%2F')); // Asegúrate de reemplazar las barras invertidas por %2F

    // Función para generar el nombre del archivo
    const generateFileName = (itemId) => {
      const parts = itemId.split(/\\|\//); // Separar por '\\' o '/'
      
      if (itemId.endsWith('.log')) {
        // Si es un archivo .log, incluir año, mes, día y el nombre del archivo
        const dayAndFile = parts[2]; // Por ejemplo: "2025-01-17.log"
        return `${dayAndFile}`;
      } else if (parts.length === 2) {
        // Si es el año y mes
        const year = parts[0];
        const month = parts[1];
        return `${year}-${month}.zip`;
      } else if (parts.length === 1) {
        // Si es solo el año
        return `${parts[0]}.zip`;
      }

      // Valor por defecto si no se cumplen las condiciones
      return 'unknown';
    };

    // Generar el nombre del archivo basado en itemId
    const fileName = generateFileName(itemId);

    // Descargar el archivo
    const downloadFile = (data, fileName) => {
      const blob = new Blob([data], { type: 'application/octet-stream' }); // Tipo genérico para archivos binarios
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a'); // Crear un enlace temporal
      a.href = url;
      a.download = fileName; // Nombre del archivo para la descarga
      document.body.appendChild(a);
      a.click(); // Simular un clic para iniciar la descarga
      document.body.removeChild(a); // Limpiar el DOM
      window.URL.revokeObjectURL(url); // Liberar memoria del navegador
    };

    // Llamar a la función de descarga
    downloadFile(logData, fileName);
  };

  const handleSelect = async () => {
    if (label.endsWith('.log')) {
      const logData = await service.getLog(label.slice(0, -4));
      setLogData(logData);
    }
  };

  return (
    <TreeItem2Provider itemId={itemId}>
      <StyledTreeItemRoot {...getRootProps(other)}>
        <CustomTreeItemContent
          {...getContentProps({
            className: clsx('content', {
              'Mui-expanded': status.expanded,
              'Mui-selected': status.selected,
              'Mui-focused': status.focused,
              'Mui-disabled': status.disabled,
            }),
          })}
        >
          <TreeItem2IconContainer {...getIconContainerProps()}>
            <TreeItem2Icon status={status} />
          </TreeItem2IconContainer>
          <TreeItem2Checkbox {...getCheckboxProps()} />
          <CustomLabel
            {...getLabelProps({
              icon,
              expandable: expandable && status.expanded,
              onDownload: handleDownload,
              onSelect: handleSelect,
            })}
          />
          <TreeItem2DragAndDropOverlay {...getDragAndDropOverlayProps()} />
        </CustomTreeItemContent>
        {children && <TransitionComponent {...getGroupTransitionProps()} />}
      </StyledTreeItemRoot>
    </TreeItem2Provider>
  );
});

export default function FileExplorer() {
  const [logs, setLogs] = React.useState([]);
  const [logData, setLogData] = React.useState('Selecciona un log para visualizarlo');

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Detectar pantallas pequeñas

  const handleGetItemLogs = async () => {
    const data = await service.getLogs();
    setLogs(data);
  };

  React.useEffect(() => {
    handleGetItemLogs();
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isSmallScreen ? 'column' : 'row', // Apila los elementos en pantallas pequeñas
        height: '100%',
        overflow: 'hidden',
        maxHeight: '80vh',
      }}
    >
      {/* Mostrar el RichTreeView solo si logData tiene el valor inicial en pantallas pequeñas */}
      {(logData === 'Selecciona un log para visualizarlo' || !isSmallScreen) && (
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
          }}
        >
          <RichTreeView
            items={logs}
            defaultExpandedItems={['1', '1.1']}
            defaultSelectedItems="1.1"
            sx={{
              height: '100%',
              flexGrow: 1,
              maxWidth: 400,
              overflowY: 'auto',
            }}
            slots={{
              item: (props) => <CustomTreeItem {...props} setLogData={setLogData} />,
            }}
          />
        </Box>
      )}

      {/* Mostrar el Typography solo si logData tiene un valor diferente en pantallas pequeñas */}
      {(logData !== 'Selecciona un log para visualizarlo' || !isSmallScreen) && (
        <Box
          sx={{
            flex: 2,
            padding: 2,
            borderLeft: isSmallScreen ? 'none' : '1px solid',
            borderColor: 'divider',
            overflowY: 'auto',
            height: '100%',
            maxHeight: '100vh',
          }}
        >
          <IconButton
            onClick={() => {
              setLogData('Selecciona un log para visualizarlo');
            }}
            aria-label="delete"
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          <Typography variant="h6">Logs Viewer</Typography>
          <Typography
            component="pre"
            sx={{
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              backgroundColor: 'background.paper',
              padding: 1,
              borderRadius: 1,
              height: '100%',
              overflowY: 'auto',
              overflowX: 'auto',
              scrollbarWidth: 'thin',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#888',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#555',
              },
            }}
          >
            {logData}
          </Typography>
        </Box>
      )}
    </Box>
  );
}