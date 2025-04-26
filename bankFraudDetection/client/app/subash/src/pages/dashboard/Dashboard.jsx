import React, { useEffect, useState } from "react";
import "../../../public/assets/css/style.css";
import BarGraph from "./BarGraph";
import PieChart from "./PieChart";

export default function Dashboard() {
  const [ fraudData, setFraudData ] = useState({ fraud: 0, valid: 0, total_transaction: 0 });
  const [ fraudByTypeData, setFraudByTypeData ] = useState([]);
  const [ loadingFraudData, setLoadingFraudData ] = useState(true);
  const [ loadingFraudByTypeData, setLoadingFraudByTypeData ] = useState(true);
  const [ fraudDataError, setFraudDataError ] = useState(null);
  const [ fraudByTypeError, setFraudByTypeError ] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      setFraudDataError("User not authenticated. Please log in.");
      setLoadingFraudData(false);
      return;
    }

    fetch("http://127.0.0.1:8000/api/get_transaction_data/", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setFraudData(data);
        setLoadingFraudData(false);
      })
      .catch((error) => {
        console.error("Error fetching fraud data:", error);
        setFraudDataError("Failed to fetch fraud data.");
        setLoadingFraudData(false);
      });
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      setFraudByTypeError("User not authenticated. Please log in.");
      setLoadingFraudByTypeData(false);
      return;
    }

    fetch("http://127.0.0.1:8000/api/get_fraud_by_type/", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setFraudByTypeData(data);
        setLoadingFraudByTypeData(false);
      })
      .catch((error) => {
        console.error("Error fetching fraud by type data:", error);
        setFraudByTypeError("Failed to fetch fraud by type data.");
        setLoadingFraudByTypeData(false);
      });
  }, []);

  if (loadingFraudData || loadingFraudByTypeData) return <div>Loading...</div>;
  if (fraudDataError) return <div>{fraudDataError}</div>;
  if (fraudByTypeError) return <div>{fraudByTypeError}</div>;

  const pieData = [
    { label: "Fraud", value: fraudData.fraud },
    { label: "Valid", value: fraudData.valid },
  ];

  return (
    <div className="content">
      <div className="container-fluid">
        <div className="dashboard">
          <div className="card">
            <h3>Total Fraud</h3>
            <p>{fraudData.fraud}</p>
          </div>
          <div className="card">
            <h3>Total Valid Transactions</h3>
            <p>{fraudData.valid}</p>
          </div>
          <div className="card">
            <h3>Total Transactions</h3>
            <p>{fraudData.total_transaction}</p>
          </div>
          <div className="card">
            <h3>Total Transaction Types</h3>
            <p>5</p>
          </div>
        </div>

        <div className="row-container">
          <div className="col-lg-6">
            <div className="chart-container">
              <h3>Bar Graph</h3>
              <BarGraph data={fraudByTypeData} />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="chart-container">
              <h3>Fraud vs Valid Transactions</h3>
              <PieChart data={pieData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}