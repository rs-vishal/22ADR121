import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container } from '@mui/material';
import Stock from './components/Stock';
import Heatmap from './components/HeatmapPage';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            Stock Prices
          </Button>
          <Button color="inherit" component={Link} to="/correlation">
            Correlation Heatmap
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Stock />} />
          <Route path="/correlation" element={<Heatmap/>} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;