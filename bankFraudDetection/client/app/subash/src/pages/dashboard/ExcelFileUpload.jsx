import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../public/assets/css/style.css";
import { useNavigate } from "react-router-dom";

export default function ExcelFileUpload({ userRole }) {
  const navigate = useNavigate();

  const [ file, setFile ] = useState(null);
  const [ uploadStatus, setUploadStatus ] = useState("");
  const [ responseData, setResponseData ] = useState(null);

  function handleFileChange(event) {
    setFile(event.target.files[ 0 ]);
    setUploadStatus("");
  }

  async function handleFormSubmit(event) {
    event.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        setUploadStatus("Uploading...");
        const response = await axios.post(
          "http://localhost:8000/api/transactions/predict_bulk/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setResponseData(response.data);
        setUploadStatus("Upload successful!");
      } catch (error) {
        setUploadStatus("Upload failed. Please try again.");
      }
    } else {
      setUploadStatus("No file selected");
    }
  }

  return (
    <div className="content">
      <div className="container-fluid">
        <div className="form-container">
          <form onSubmit={handleFormSubmit} className="file-upload-form">
            <div className="file-upload">
              <div className="row">
                <div className="form-group col-lg-6">
                  <label htmlFor="fileInput" className="file-label">
                    Choose File
                  </label>
                  <input
                    type="file"
                    id="fileInput"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                </div>
              </div>
            </div>
            <div className="submit-button-container">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
          {uploadStatus && <p>{uploadStatus}</p>}
          {responseData && (
            <div className="response-data">
              <h3>Prediction Results:</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
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
                  {responseData.map((result, index) => (
                    <tr key={index}>
                      <td>{result.id}</td>
                      <td>{result.step}</td>
                      <td>{result.type}</td>
                      <td>{result.amount}</td>
                      <td>{result.nameOrig}</td>
                      <td>{result.oldbalanceOrg}</td>
                      <td>{result.newbalanceOrig}</td>
                      <td>{result.nameDest}</td>
                      <td>{result.oldbalanceDest}</td>
                      <td>{result.newbalanceDest}</td>
                      <td>{result.prediction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
