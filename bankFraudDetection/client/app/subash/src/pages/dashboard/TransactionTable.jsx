import "../../../public/assets/css/style.css";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TransactionTable() {
  const [ transactions, setTransactions ] = useState([]);
  const [ errorMessage, setErrorMessage ] = useState("");

  const TYPE_MAPPING = {
    0: "PAYMENT",
    1: "CASH_IN",
    2: "DEBIT",
    3: "CASH_OUT",
    4: "TRANSFER",
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    fetch("http://localhost:8000/api/transactions/", {

      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            if (errorMessage !== data.message) {
              toast.error(data.message || `HTTP error! Status: ${response.status}`);
            }
            throw new Error(data.message || `HTTP error! Status: ${response.status}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        setTransactions(data);
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
      });
  }, [ errorMessage ]);

  return (
    <div className="content">
      <div className="container-fluid">
        <div className="table-container">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Time Step</th>
                <th>Transaction Type</th>
                <th>Transaction Amount</th>
                <th>Originator Name</th>
                <th>Originator Balance Before</th>
                <th>Originator Balance After</th>
                <th>Recipient Name</th>
                <th>Recipient Balance Before</th>
                <th>Recipient Balance After</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.step}</td>
                  <td>{TYPE_MAPPING[ transaction.type ]}</td>
                  <td>{transaction.amount}</td>
                  <td>{transaction.nameOrig}</td>
                  <td>{transaction.oldbalanceOrg}</td>
                  <td>{transaction.newbalanceOrig}</td>
                  <td>{transaction.nameDest}</td>
                  <td>{transaction.oldbalanceDest}</td>
                  <td>{transaction.newbalanceDest}</td>
                  <td>{transaction.isFraud ? "Fraud" : "Not Fraud"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
