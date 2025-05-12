import React, { useState, useEffect } from "react";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import { Box, Typography, Slider, Paper } from "@mui/material";

const HeatmapPage = () => {
  const [timeFrame, setTimeFrame] = useState(15);
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/correlation?minutes=${timeFrame}`);
        const data = await response.json();

        // Nivo expects data in specific format
        const formattedData = data.stocks.map((stock, i) => {
          const row = { stock };
          data.stocks.forEach((colStock, j) => {
            row[colStock] = data.matrix[i][j];
          });
          return row;
        });

        setHeatmapData(formattedData);
      } catch (error) {
        console.error("Error fetching correlation data:", error);
      }
    };

    fetchData();
  }, [timeFrame]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Stock Correlation Heatmap
      </Typography>

      <Box sx={{ width: 300, mb: 3 }}>
        <Typography gutterBottom>Time Frame: {timeFrame} minutes</Typography>
        <Slider
          value={timeFrame}
          onChange={(e, newValue) => setTimeFrame(newValue)}
          min={5}
          max={60}
          step={5}
          valueLabelDisplay="auto"
        />
      </Box>

      <Paper elevation={3} sx={{ height: 500 }}>
        <ResponsiveHeatMap
          data={heatmapData}
          keys={heatmapData.length > 0 ? Object.keys(heatmapData[0]).filter(k => k !== "stock") : []}
          indexBy="stock"
          margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
          colors={{
            type: "diverging",
            scheme: "red_yellow_blue",
            divergeAt: 0.5,
            minValue: -1,
            maxValue: 1,
          }}
          axisTop={{
            orient: "top",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
          }}
          axisLeft={{
            orient: "left",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
          }}
          cellOpacity={1}
          cellBorderColor={{ from: "color", modifiers: [["darker", 0.4]] }}
          labelTextColor={{ from: "color", modifiers: [["darker", 1.8]] }}
          animate={true}
        />
      </Paper>
    </Box>
  );
};

export default HeatmapPage;
