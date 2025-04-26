import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../public/assets/css/style.css";

export default function ProfileSetting() {
  const [ profileData, setProfileData ] = useState({ email: "", username: "" });
  const [ loading, setLoading ] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    // console.log("Token found:", token);

    if (!token) {
      toast.error("No authentication token found!");
      return;
    }

    setLoading(true);
    axios
      .get("http://localhost:8000/api/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // console.log("Data from database:", response.data); 
        setProfileData({
          email: response.data.email,
          username: response.data.username,
        });
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [ name ]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    if (!token) {
      toast.error("No authentication token found!");
      return;
    }

    setLoading(true);
    axios
      .put(
        "http://localhost:8000/api/profile/",
        profileData,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        toast.success("Profile updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="content">
      <div className="container-fluid">
        <div className="form-container">
          <h2>Profile Settings</h2>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="form-group col-lg-6">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="form-group col-lg-6">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={profileData.username}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
