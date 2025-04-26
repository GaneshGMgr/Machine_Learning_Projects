import { useState } from "react";
import jwt_decode from 'jwt-decode';
import "../../../public/assets/css/style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Form() {
  const [ formData, setFormData ] = useState({
    step: "",
    type: "",
    amount: "",
    nameOrig: "",
    oldbalanceOrg: "",
    newbalanceOrig: "",
    nameDest: "",
    oldbalanceDest: "",
    newbalanceDest: "",
  });

  async function handleFormSubmission(e) {
    e.preventDefault();


    if (
      !formData.step ||
      !formData.type ||
      !formData.amount ||
      !formData.nameOrig ||
      !formData.oldbalanceOrg ||
      !formData.newbalanceOrig ||
      !formData.nameDest ||
      !formData.oldbalanceDest ||
      !formData.newbalanceDest
    ) {
      toast.error("Please fill in all fields.", { theme: "colored" });
      return;
    }


    console.log("Form data to be sent:", formData);


    async function getAccessToken() {
      let token = localStorage.getItem("access_token");

      if (!token) {
        toast.error("No access token found. Please log in.", { theme: "colored" });
        window.location.href = "/login";
        return null;
      }

      try {
        const decodedToken = jwt_decode(token);
        const currentTime = Date.now() / 1000;


        if (decodedToken.exp < currentTime) {
          const refreshToken = localStorage.getItem("refresh_token");
          if (!refreshToken) {
            toast.error("No refresh token found. Please log in again.", { theme: "colored" });
            window.location.href = "/login";
            return null;
          }

          const refreshResponse = await fetch("http://localhost:8000/api/token/refresh/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: refreshToken }),
          });

          if (!refreshResponse.ok) {
            throw new Error("Failed to refresh token");
          }

          const refreshData = await refreshResponse.json();
          localStorage.setItem("access_token", refreshData.access);
          localStorage.setItem("refresh_token", refreshData.refresh);
          token = refreshData.access;
        }

        return token;
      } catch (error) {
        console.error("Error decoding or refreshing token:", error);
        toast.error("Session expired. Please log in again.", { theme: "colored" });
        window.location.href = "/login";
        return null;
      }
    }

    try {

      const token = await getAccessToken();
      if (!token) return;


      const response = await fetch("http://localhost:8000/api/transactions/predict/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();


      if (result.prediction === 0) {
        toast.success(
          "This transaction is considered safe (Predicted 0).",
          { theme: "colored" }
        );

        setFormData({
          step: "",
          type: "",
          amount: "",
          nameOrig: "",
          oldbalanceOrg: "",
          newbalanceOrig: "",
          nameDest: "",
          oldbalanceDest: "",
          newbalanceDest: "",
        });
      } else if (result.prediction === 1) {
        toast.error(
          "This transaction has been flagged as potentially invalid (Predicted 1).",
          { theme: "colored" }
        );
      } else {
        toast.warn(
          "Unexpected response received. Please try again later.",
          { theme: "colored" }
        );
      }
    } catch (error) {
      toast.error(
        "An error occurred while processing your request. Please try again later.",
        { theme: "colored" }
      );
      console.error("Error:", error);
    }
  }





  return (
    <div className="content">
      <div className="container-fluid">
        <div className="form-container">
          <h3>Report a Transaction</h3>
          <form onSubmit={handleFormSubmission}>
            <div className="row">
              <div className="form-group col-lg-6">
                <label htmlFor="step">Time Step</label>
                <input
                  type="number"
                  id="step"
                  placeholder="step"
                  value={formData.step}
                  onChange={(e) =>
                    setFormData({ ...formData, step: e.target.value })
                  }
                />
              </div>
              <div className="form-group col-lg-6">
                <label htmlFor="type">Transaction Type</label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                >
                  <option value="">Select Transaction Type</option> {/* Default option */}
                  <option value="PAYMENT">PAYMENT</option>
                  <option value="CASH_IN">CASH_IN</option>
                  <option value="DEBIT">DEBIT</option>
                  <option value="CASH_OUT">CASH_OUT</option>
                  <option value="TRANSFER">TRANSFER</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="form-group col-lg-6">
                <label htmlFor="amount">Transaction Amount</label>
                <input
                  type="number"
                  id="amount"
                  placeholder="amount"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                />
              </div>
              <div className="form-group col-lg-6">
                <label htmlFor="nameOrig">Originator AC No.</label>
                <input
                  type="text"
                  id="nameOrig"
                  placeholder="nameOrig"
                  value={formData.nameOrig}
                  onChange={(e) =>
                    setFormData({ ...formData, nameOrig: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="row">
              <div className="form-group col-lg-6">
                <label htmlFor="oldbalanceOrg">Originator Balance Before</label>
                <input
                  type="number"
                  id="oldbalanceOrg"
                  placeholder="oldbalanceOrg"
                  value={formData.oldbalanceOrg}
                  onChange={(e) =>
                    setFormData({ ...formData, oldbalanceOrg: e.target.value })
                  }
                />
              </div>
              <div className="form-group col-lg-6">
                <label htmlFor="newbalanceOrig">Originator Balance After</label>
                <input
                  type="number"
                  id="newbalanceOrig"
                  placeholder="newbalanceOrig"
                  value={formData.newbalanceOrig}
                  onChange={(e) =>
                    setFormData({ ...formData, newbalanceOrig: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="row">
              <div className="form-group col-lg-6">
                <label htmlFor="nameDest">Recipient AC No.</label>
                <input
                  type="text"
                  id="nameDest"
                  placeholder="nameDest"
                  value={formData.nameDest}
                  onChange={(e) =>
                    setFormData({ ...formData, nameDest: e.target.value })
                  }
                />
              </div>
              <div className="form-group col-lg-6">
                <label htmlFor="oldbalanceDest">Recipient Balance Before</label>
                <input
                  type="number"
                  id="oldbalanceDest"
                  placeholder="oldbalanceDest"
                  value={formData.oldbalanceDest}
                  onChange={(e) =>
                    setFormData({ ...formData, oldbalanceDest: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="row">
              <div className="form-group col-lg-6">
                <label htmlFor="newbalanceDest">Recipient Balance After</label>
                <input
                  type="number"
                  id="newbalanceDest"
                  placeholder="newbalanceDest"
                  value={formData.newbalanceDest}
                  onChange={(e) =>
                    setFormData({ ...formData, newbalanceDest: e.target.value })
                  }
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              Submit
            </button>
          </form>
          <ToastContainer />
        </div>
      </div >
    </div >
  );
}
