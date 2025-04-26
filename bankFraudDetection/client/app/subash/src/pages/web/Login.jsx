import React, { useState } from 'react';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../public/assets/css/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [ formData, setFormData ] = useState({
    username: '',
    password: ''
  });
  const [ error, setError ] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [ e.target.name ]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', formData);
      console.log("Access Token:", response.data.access);
      console.log("Refresh Token:", response.data.refresh);

      console.log("Logged in user's role_id:", response.data.role_id);

      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      toast.success("Logged in successfully!");

      navigate('/dashboard');
    } catch (error) {
      console.error("Login Error:", error);
      setError('Invalid credentials');
    }
  };


  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-100 mx-auto overflow-hidden">
        <div className="col-lg-6 d-none d-lg-block p-0">
          <div className="illustration">
            <img
              src="public/assets/images/login.png"
              alt="Illustration"
              className="img-fluid h-100"
            />
          </div>
        </div>
        <div className="col-lg-6 bg-white p-4">
          <h3>Login</h3>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-10">
                <div className="form-group">
                  <label htmlFor="username">Email/Phone Number *</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="form-control"
                    placeholder="Enter Email/Phone Number"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="col-lg-10">
                <div className="form-group">
                  <label htmlFor="password">Password *</label><input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            {error && <p className="text-danger">{error}</p>}
            <div className="forgot-password text-right mb-3">
              <a href="#">Forgot password?</a>
            </div>
            <button type="submit" className="btn btn-primary btn-block mb-3">
              LOGIN
            </button>
            <p className="text-center">
              Don't have an account?{" "}
              <Link to="/register">
                <a href="#">Sign Up</a>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
