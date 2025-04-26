import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../public/assets/css/style.css";

export default function ChangePassword() {
  const [ passwordData, setPasswordData ] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [ loading, setLoading ] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [ name ]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();


    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("access_token");

    if (!token) {
      toast.error("No authentication token found!");
      setLoading(false);
      return;
    }

    axios
      .put(
        "http://localhost:8000/api/change-password/",
        {
          old_password: passwordData.oldPassword,
          new_password: passwordData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        toast.success("Password changed successfully!");
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      })
      .catch((error) => {
        console.error("Error changing password:", error);
        toast.error("Failed to change password.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="content">
      <div className="container-fluid">
        <div className="form-container">
          <h2>Change Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="form-group col-lg-6">
                <label htmlFor="oldPassword">Old Password:</label>
                <input
                  type="password"
                  id="oldPassword"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className="form-group col-lg-6">
                <label htmlFor="newPassword">New Password:</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>
            <div className="row">
              <div className="form-group col-lg-6">
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
