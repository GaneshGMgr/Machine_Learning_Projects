import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Sidebar() {
  const [ userRole, setUserRole ] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      axios
        .get("http://127.0.0.1:8000/api/get_user_role/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setUserRole(response.data.role_id);
        })
        .catch((error) => {
          console.error("Error fetching role:", error);
        });
    } else {
      console.error("No access token found");
    }
  }, []);

  return (
    <div className="sidebar">
      <h2>Fraud Detector</h2>
      <ul>
        <li>
          <Link to="/dashboard">
            <i className="fas fa-home"></i> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/transactionTable">
            <i className="fas fa-briefcase"></i> Transactions Table
          </Link>
        </li>
        <li>
          <Link to="/form">
            <i className="fas fa-file-alt"></i> Form
          </Link>
        </li>
        {userRole === 1 && (
          <li>
            <Link to="/excelFileUpload">
              <i className="fas fa-file-alt"></i> Excel File Upload
            </Link>
          </li>
        )}
        <li>
          <Link to="/profileSetting">
            <i className="fas fa-cog"></i> Profile Setting
          </Link>
        </li>
        <li>
          <Link to="/changePassword">
            <i className="fas fa-cog"></i> Change Password
          </Link>
        </li>
      </ul>
    </div>
  );
}
