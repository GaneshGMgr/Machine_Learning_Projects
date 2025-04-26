import React from "react";
import { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../public/assets/css/style.css";

export default function Contact() {
  const [ name, setName ] = useState({
    fullname: "",
    email: "",
    phone_number: "",
    subject: "",
    message: "",
  });

  function handleFormSubmission(e) {
    e.preventDefault();
    console.log(name);
  }

  return (
    <div>
      <section className="contact-info">
        <h2>Get in Touch</h2>
        <p>
          If you have any questions or would like to reach out to us, please use
          the form below or contact us directly through the information
          provided.
        </p>
        <div className="contact-details">
          <div className="contact-card">
            <div className="icon-container">
              <img
                src="../../../public/assets/images/call.png"
                alt="Phone Icon"
              />
            </div>
            <p>
              <strong>Phone:</strong> +977 9822974337
            </p>
          </div>

          <div className="contact-card">
            <div className="icon-container">
              <img
                src="../../../public/assets/images/envelope.png"
                alt="Email Icon"
              />
            </div>
            <p>
              <strong>Email:</strong> subash@gmail.com
            </p>
          </div>

          <div className="contact-card">
            <div className="icon-container">
              <img
                src="../../../public/assets/images/location.png"
                alt="Location Icon"
              />
            </div>
            <p>
              <strong>Address:</strong> Kathmandu, Nepal
            </p>
          </div>
        </div>
      </section>

      <section className="contact-form mt-4">
        <h2>Contact Form</h2>
        <form action="#" method="post">
          <div className="row">
            <div className="col-lg-6">
              <label for="name">Full Name</label>
              <input
                type="text"
                id="name"
                className="form-control"
                value={name.fullname}
                onChange={(e) => setName({ ...name, fullname: e.target.value })}
                required
              ></input>
            </div>

            <div className="col-lg-6">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={name.email}
                onChange={(e) => setName({ ...name, email: e.target.value })}
                required
              ></input>
            </div>
          </div>

          <div className="row">
            <div className="form-group col-lg-6">
              <label for="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={name.phone_number}
                onChange={(e) =>
                  setName({ ...name, phone_number: e.target.value })
                }
                className="form-control"
                required
              ></input>
            </div>

            <div className="form-group col-lg-6">
              <label for="subject">Subject</label>
              <input
                type="text"
                id="subject"
                s
                value={name.subject}
                onChange={(e) => setName({ ...name, subject: e.target.value })}
                className="form-control"
                required
              ></input>
            </div>
          </div>

          <div className="form-group">
            <label for="message">Message</label>
            <textarea
              id="message"
              value={name.message}
              onChange={(e) => setName({ ...name, message: e.target.value })}
              className="form-control"
              rows="5"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn btn-primary mt-3"
            style={{ display: "inline-block", width: "77px" }}
            onClick={(e) => handleFormSubmission(e)}
          >
            Submit
          </button>
        </form>
      </section>
    </div>
  );
}
