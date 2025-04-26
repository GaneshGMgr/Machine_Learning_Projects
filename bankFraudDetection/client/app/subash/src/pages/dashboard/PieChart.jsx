import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';


ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

export default function PieChart({ data }) {
  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        label: "Values",
        data: data.map((item) => item.value),
        backgroundColor: [ "#FF6384", "#36A2EB" ],
        hoverBackgroundColor: [ "#FF6384", "#36A2EB" ],
      },
    ],
  };


  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const total = ctx.dataset.data.reduce((sum, data) => sum + data, 0);
          const percentage = ((value / total) * 100).toFixed(2) + "%";
          return percentage;
        },
        color: "#fff",
        font: {
          weight: "bold",
          size: 16,
        },
        anchor: "center",
        align: "center",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const value = tooltipItem.raw;
            const total = tooltipItem.dataset.data.reduce((sum, data) => sum + data, 0);
            const percentage = ((value / total) * 100).toFixed(2) + "%";
            return tooltipItem.label + ": " + percentage + " (" + value + ")";
          },
        },
      },
    },
  };

  return (
    <div style={{ width: "400px", height: "400px" }}>
      <Pie data={chartData} options={options} />
    </div>
  );
}
