import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const TYPE_MAPPING = {
  0: 'PAYMENT',
  1: 'CASH_IN',
  2: 'DEBIT',
  3: 'CASH_OUT',
  4: 'TRANSFER',
};

export default function BarGraph({ data }) {
  const mappedLabels = data.map((item) => TYPE_MAPPING[ item.type ] || "Unknown");

  const chartData = {
    labels: mappedLabels,
    datasets: [
      {
        label: "Fraud Transactions",
        data: data.map((item) => item.fraud_count),
        backgroundColor: "rgba(255, 99, 132, 0.6)", // Fraud color
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Valid Transactions",
        data: data.map((item) => item.valid_count),
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Valid color
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
