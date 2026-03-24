
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  Filler
} from "chart.js";

const API_URL = process.env.REACT_APP_API_URL || (window.location.hostname === "localhost" ? "http://localhost:5000" : "")

ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  Filler
);

function DiseaseAnalytics(){
const [chartData,setChartData] = useState({})

useEffect(() => {
  axios.get(`${API_URL}/analytics/diseases`).then((res) => {
    const diseases = res.data.map((d) => d.disease);
    const counts = res.data.map((d) => d.total);
    setChartData({
      labels: diseases,
      datasets: [
        {
          label: "Disease Frequency",
          data: counts,
          backgroundColor: "rgba(25, 118, 210, 0.8)",
          borderColor: "rgb(25, 118, 210)",
          borderWidth: 2,
          fill: true,
        },
      ],
    });
  });
}, []);

return(

<div style={{width:"600px"}}>

<h2>Disease Analytics</h2>

{chartData.labels && <Bar data={chartData}/>}

</div>

)

}

export default DiseaseAnalytics

