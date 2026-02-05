import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { 
  ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, 
  Container, Box, Button, TextField, Card, Grid, Drawer, List, ListItem, ListItemText 
} from '@mui/material';

// Configuración del Tema Oscuro (Ministerio de Sonido)
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#FFD700' }, // Dorado
    background: { default: '#0A0A0A', paper: '#161616' },
    text: { primary: '#FFFFFF' }
  },
});

// --- COMPONENTE PORTADA (HOME) ---
const Home = ({ config, onSaveConfig }) => {
  const [editMode, setEditMode] = useState(false);
  const [tempConfig, setTempConfig] = useState(config);

  return (
    <Box sx={{ textAlign: 'center', py: 5 }}>
      {/* Portada Hero */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2, fontSize: { xs: '2.5rem', md: '4rem' } }}>
          {config.titular || 'MINISTERIO DE SONIDO'}
        </Typography>
        <Typography variant="h5" color="primary" sx={{ mb: 4 }}>
          Excelencia en Audio Profesional
        </Typography>
      </Box>

      {/* Misión y Visión */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" color="primary">Nuestra Misión</Typography>
            <Typography variant="body1">{config.mision || 'Definir misión en ajustes...'}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" color="primary">Nuestra Visión</Typography>
            <Typography variant="body1">{config.vision || 'Definir visión en ajustes...'}</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Botón Modo Administrador */}
      <Button variant="outlined" onClick={() => setEditMode(!editMode)}>
        {editMode ? 'Cerrar Edición' : 'Modo Administrador'}
      </Button>

      {editMode && (
        <Box sx={{ mt: 4, p: 3, border: '1px solid #333', borderRadius: 2 }}>
          <TextField fullWidth label="Titular" value={tempConfig.titular} onChange={(e) => setTempConfig({...tempConfig, titular: e.target.value})} sx={{ mb: 2 }} />
          <TextField fullWidth multiline rows={3} label="Misión" value={tempConfig.mision} onChange={(e) => setTempConfig({...tempConfig, mision: e.target.value})} sx={{ mb: 2 }} />
          <TextField fullWidth multiline rows={3} label="Visión" value={tempConfig.vision} onChange={(e) => setTempConfig({...tempConfig, vision: e.target.value})} sx={{ mb: 2 }} />
          <Button variant="contained" color="primary" onClick={() => { onSaveConfig(tempConfig); setEditMode(false); }}>Guardar Cambios</Button>
        </Box>
      )}
    </Box>
  );
};

// --- APP PRINCIPAL ---
export default function App() {
  const [config, setConfig] = useState({});
  const [agenda, setAgenda] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: c } = await supabase.from('config').select('*').single();
    if (c) setConfig(c);
    const { data: a } = await supabase.from('agenda').select('*');
    if (a) setAgenda(a);
    const { data: i } = await supabase.from('inventario').select('*');
    if (i) setInventario(i);
    const { data: s } = await supabase.from('staff').select('*');
    if (s) setStaff(s);
  };

  const saveConfig = async (newConfig) => {
    const { error } = await supabase.from('config').upsert([newConfig]);
    if (!error) setConfig(newConfig);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #333' }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#FFD700' }}>MS</Typography>
            <Button component={Link} to="/" color="inherit">Inicio</Button>
            <Button component={Link} to="/agenda" color="inherit">Agenda</Button>
            <Button component={Link} to="/inventario" color="inherit">Inventario</Button>
          </Toolbar>
        </AppBar>

        <Container sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<Home config={config} onSaveConfig={saveConfig} />} />
            <Route path="/agenda" element={<Typography variant="h4">📅 Módulo Agenda (Listo para datos)</Typography>} />
            <Route path="/inventario" element={<Typography variant="h4">📦 Módulo Inventario (Listo para datos)</Typography>} />
          </Routes>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}
