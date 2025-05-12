import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const Stock = () => {
  const [timeFrame, setTimeFrame] = useState('15');
  const [stockData, setStockData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/stocks?minutes=${timeFrame}`);
        const data = await response.json();
        setStockData(data);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };
    
    fetchData();
  }, [timeFrame]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Stock Price Analysis</Typography>
      
      <FormControl sx={{ minWidth: 120, mb: 3 }}>
        <InputLabel>Time Frame</InputLabel>
        <Select
          value={timeFrame}
          onChange={(e) => setTimeFrame(e.target.value)}
          label="Time Frame"
        >
          <MenuItem value="15">15 minutes</MenuItem>
          <MenuItem value="30">30 minutes</MenuItem>
          <MenuItem value="60">1 hour</MenuItem>
        </Select>
      </FormControl>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={stockData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#8884d8" 
            activeDot={{ r: 8 }} 
          />
          <Line 
            type="monotone" 
            dataKey="average" 
            stroke="#82ca9d" 
            strokeDasharray="5 5" 
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default Stock;