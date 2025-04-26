import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "../../../public/assets/css/style.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Register() {
  const navigate = useNavigate();
  const [ formData, setFormData ] = useState({
    fullname: "",
    address: "",
    email: "",
    password: ""
  });

  const [ formErrors, setFormErrors ] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [ e.target.name ]: e.target.value
    });
    setFormErrors({ ...formErrors, [ e.target.name ]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/register/", {
        username: formData.fullname,
        email: formData.email,
        password: formData.password,
      });
      console.log("User registered successfully:", response.data);
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.data) {
        setFormErrors(error.response.data);
      } else if (error.request) {
        console.error("No response received from server:", error.request);
      } else {
        console.error("Error in setting up request:", error.message);
      }
    }
  };

  return (
    <div className="container-fluid vh-107 d-flex align-items-center justify-content-center">
      <div className="row w-100 mx-auto overflow-hidden">
        <div className="col-lg-6 d-none d-lg-block p-0">
          <div className="illustration">
            <img
              src="public/assets/images/signup.png"
              alt="Illustration"
              className="img-fluid h-100"
            />
          </div>
        </div>
        <div className="col-lg-6 bg-white p-4">
          <h3>Register</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullname">Full Name *</label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                className="form-control"
                placeholder="Enter Name"
                required
                onChange={handleChange}
              />
              {formErrors.fullname && <div className="text-danger">{formErrors.fullname}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="address">Address*</label>
              <input
                type="text"
                id="address"
                name="address"
                className="form-control"
                placeholder="Enter Address"
                required
                onChange={handleChange}
              />
              {formErrors.address && <div className="text-danger">{formErrors.address}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="Enter Email"
                required
                onChange={handleChange}
              />
              {formErrors.email && <div className="text-danger">{formErrors.email[ 0 ]}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                placeholder="Enter Password"
                required
                onChange={handleChange}
              />
              {formErrors.password && <div className="text-danger">{formErrors.password[ 0 ]}</div>}
            </div>
            <button type="submit" className="btn btn-primary btn-block mb-3">
              Register
            </button>
            <p className="text-center">
              Already have an account?{" "}
              <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
