import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import Grid from '@mui/system/Unstable_Grid';
import MainCard from 'ui-component/cards/MainCard';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { PieChart, pieArcLabelClasses  } from '@mui/x-charts/PieChart';
import Divider from '@mui/material/Divider';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

import OSLogo from './AdaptiveLogo/OsLogo';
import Gauge from './AdaptiveLogo/GaugePointer';

const WebSocketMetrics = () => {
    const [ usageCPU, setUsageCPU ] = useState([]);
    const [ dateCPU, setDateCPU ] = useState([]);

    const [metrics, setMetrics] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let ws;
        setLoading(true);
    
        try {
            ws = new WebSocket(import.meta.env.VITE_APP_API_WEBSOCKET + 'api/serverStats/');
    
            ws.onopen = () => {
                console.log('Conexión WebSocket abierta');
                setIsConnected(true);
                setLoading(false);
    
                const pingInterval = setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ type: 'ping' }));
                    }
                }, 30000);
    
                ws.onclose = () => {
                    clearInterval(pingInterval);
                    console.log('Conexión WebSocket cerrada');
                    setIsConnected(false);
                };
            };
    
            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setMetrics(data);
    
                // Agregar nuevo punto a la gráfica
                addDataPoint(data.cpuUsage);
            };
    
            ws.onerror = (error) => {
                console.error('Error en WebSocket:', error);
                setIsConnected(false);
                setLoading(false);
            };
        } catch (error) {
            console.error('Error inicializando WebSocket:', error);
            setIsConnected(false);
            setLoading(false);
        }
    
        return () => {
            if (ws) ws.close();
        };
    }, []);
    
    // Función para agregar un nuevo punto al dataset del CPU usage
    const addDataPoint = (cpuUsage) => {
        const currentTime = new Date().toLocaleTimeString('en-US', { hour12: true });
    
        setUsageCPU((prevUsageCPU) => {
            const updatedUsageCPU = [...prevUsageCPU, parseFloat(cpuUsage.toFixed(2))];
            return updatedUsageCPU.slice(-20); // Mantener solo los últimos 10 puntos
        });
    
        setDateCPU((prevDateCPU) => {
            const updatedDateCPU = [...prevDateCPU, currentTime];
            return updatedDateCPU.slice(-20); // Mantener solo los últimos 10 puntos
        });
    };
    

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {loading && <CircularProgress />}

            {!loading && (
                <>
                    {isConnected ? (
                        metrics ? (
                            <Box>
                                <MainCard title="Métricas del Sistema">
                                    <OSLogo osName={metrics.os.details} />
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                            <Typography variant="body2">CPU: {parseFloat(metrics.cpuUsage.toFixed(2))}%</Typography>
                                            <SparkLineChart
                                                data={usageCPU}
                                                xAxis={{
                                                    scaleType: 'band',
                                                    data: dateCPU,
                                                }}
                                                yAxis={{
                                                    valueFormatter: (value) => `${value}%`, // Agrega el % a los valores del eje Y
                                                }}
                                                height={100}
                                                showTooltip
                                                tooltip={{
                                                    valueFormatter: (value) => `${value}%`, // Formatea el tooltip con %
                                                }}
                                                showHighlight
                                            />
                                        </Grid>
                                        <Grid
                                            item 
                                            xs={12} 
                                            sm={6} 
                                            md={6} 
                                            lg={6} 
                                            container 
                                            justifyContent="center" 
                                            alignItems="center"
                                        >
                                            <Gauge
                                                total={metrics.totalMemory}
                                                used={metrics.memoryUsage}
                                            />
                                        </Grid>
                                    </Grid>
                                </MainCard>

                                <Divider style={{margin: '4px'}}>Interfaces de red</Divider>

                                {/* Mostrar interfaces de red */}
                                <Box>
                                    <Grid container spacing={2}>
                                        {metrics.network.interfaces.map((iface, index) => (
                                            <Grid item marginTop={1} xs={12} sm={6} md={6} lg={6} key={index}>
                                                <MainCard title={iface.name}>
                                                    <PieChart
                                                        sx={{
                                                            [`& .${pieArcLabelClasses.root}`]: {
                                                                fontWeight: 'bold',
                                                            },
                                                        }}
                                                        series={[
                                                            {
                                                                arcLabel: (item) => `${item.value}%`,
                                                                arcLabelMinAngle: 35,
                                                                arcLabelRadius: '60%',
                                                                data: [
                                                                    { 
                                                                        id: 0, 
                                                                        value: parseFloat((100 * (iface.bytesSent / (iface.bytesSent + iface.bytesRecv))).toFixed(2)), 
                                                                        label: parseFloat((iface.bytesSent / 1048576).toFixed(2)) + " MB Enviados" 
                                                                    },
                                                                    { 
                                                                        id: 1, 
                                                                        value: parseFloat((100 * (iface.bytesRecv / (iface.bytesSent + iface.bytesRecv))).toFixed(2)), 
                                                                        label: parseFloat((iface.bytesRecv / 1048576).toFixed(2)) + " MB Recibidos" 
                                                                    },
                                                                ],
                                                            },
                                                        ]}
                                                        width={window.innerWidth < 768 ? 300 : 500} // Ajusta el tamaño dinámicamente según el ancho de la pantalla
                                                        height={window.innerWidth < 768 ? 300 : 200} // Ajusta el tamaño dinámicamente según el ancho de la pantalla
                                                    />
                                                    
                                                    <Box
                                                        display="flex"
                                                        flexDirection="row"
                                                        justifyContent="space-between"
                                                        alignItems="center"
                                                    >
                                                        <Box
                                                            display="flex"
                                                            flexDirection="row"
                                                            alignItems="center"
                                                        >
                                                            <ArrowUpwardIcon></ArrowUpwardIcon>
                                                            <Typography variant="body2">
                                                                {parseFloat(iface.readSpeed.toFixed(2))} KB/s
                                                            </Typography>
                                                        </Box>
                                                        <Box
                                                            display="flex"
                                                            flexDirection="row"
                                                            alignItems="center"
                                                        >
                                                            <ArrowDownwardIcon></ArrowDownwardIcon>
                                                            <Typography variant="body2">
                                                                {parseFloat(iface.writeSpeed.toFixed(2))} KB/s
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </MainCard>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>

                                <Divider style={{margin: '4px'}}>Unidades de almacenamiento</Divider>

                                {/* Mostrar gráficos de discos */}
                                <Box>
                                    <Grid container spacing={2}>
                                        {metrics.diskDetails.map((disk, index) => (
                                            <Grid item marginTop={1} xs={12} sm={6} md={6} lg={6} key={index}>
                                                <MainCard title={"Unidad: " + disk.mountpoint} sx={{ marginBottom: 2 }}>
                                                    <Typography variant="body2">
                                                        {(disk.free/1024).toFixed(2)} GB disponibles de {(disk.total/1024).toFixed(2)} GB
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Box sx={{ width: '100%', mr: 1 }}>
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={(disk.used / disk.total) * 100}
                                                                sx={{ height: 10, marginTop: 1 }}
                                                            />
                                                        </Box>
                                                        <Box sx={{ minWidth: 35 }}>
                                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                                {((disk.used / disk.total) * 100).toFixed(2)}%
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    <Box
                                                        display="flex"
                                                        flexDirection="row"
                                                        justifyContent="space-between"
                                                        alignItems="center"
                                                    >
                                                        <Box
                                                            display="flex"
                                                            flexDirection="row"
                                                            alignItems="center"
                                                        >
                                                            <ArrowUpwardIcon></ArrowUpwardIcon>
                                                            <Typography variant="body2">
                                                                {parseFloat((metrics.diskSpeeds[disk.mountpoint]?.readSpeed || 0).toFixed(2))} KB/s
                                                            </Typography>
                                                        </Box>
                                                        <Box
                                                            display="flex"
                                                            flexDirection="row"
                                                            alignItems="center"
                                                        >
                                                            <ArrowDownwardIcon></ArrowDownwardIcon>
                                                            <Typography variant="body2">
                                                                {parseFloat((metrics.diskSpeeds[disk.mountpoint]?.writeSpeed || 0).toFixed(2))} KB/s
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </MainCard>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            </Box>
                        ) : (
                            <Typography variant="body2">Esperando métricas...</Typography>
                        )
                    ) : (
                        <Typography variant="body2" color="error">
                            No conectado al WebSocket
                        </Typography>
                    )}
                </>
            )}

            <Button
                variant="contained"
                color="primary"
                onClick={() => window.location.reload()}
                disabled={isConnected || loading}
            >
                Reconectar
            </Button>
        </Box>
    );
};

export default WebSocketMetrics;
