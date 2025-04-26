import "../../../public/assets/css/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link } from "react-router-dom";
import React, { useState } from "react";

export default function Dashboard() {
  return (
    <div>
      <section className="hero">
        <div className="container">
          <h1>Protect Your Finances with Advanced Fraud Detection</h1>
          <p>
            Our bank fraud detection system utilizes cutting-edge technology to
            identify and prevent fraudulent activities in real-time. Experience
            peace of mind knowing your transactions are secure.
          </p>
          <div className="buttons">
            <button className="btn-primary">Get Started</button>
            <button className="btn-secondary">Learn More</button>
          </div>
          <div className="image-placeholder">
            <img
              src="public/assets/images/slider.png"
              alt="Fraud Detection Illustration"
            ></img>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Understanding Our Fraud Detection System</h2>
          <p>
            Our fraud detection system employs advanced algorithms to identify
            suspicious activities in real-time. Seamlessly integrated with your
            existing banking infrastructure, it enhances security and protects
            your customers.
          </p>

          <div className="features-grid">
            <div className="feature">
              <img
                src="public/assets/images/integration.png"
                alt="Integration Icon"
              ></img>
              <h3>Integration Made Easy</h3>
              <p>
                Easily connect with your current banking systems without
                disrupting your operations.
              </p>
            </div>
            <div className="feature">
              <img
                src="public/assets/images/real-time.png"
                alt="Monitoring Icon"
              ></img>
              <h3>Real-Time Monitoring</h3>
              <p>
                Detect fraudulent transactions as they happen to minimize
                potential losses.
              </p>
            </div>
            <div className="feature">
              <img
                src="public/assets/images/user-friendly.png"
                alt="User Interface Icon"
              ></img>
              <h3>User-Friendly Interface</h3>
              <p>
                Navigate our system effortlessly with an intuitive design
                tailored for all users.
              </p>
            </div>
            <div className="feature">
              <img
                src="public/assets/images/reporting.png"
                alt="Reporting Icon"
              ></img>
              <h3>Comprehensive Reporting</h3>
              <p>
                Generate detailed reports to analyze trends and improve your
                fraud prevention strategies.
              </p>
            </div>
          </div>

          <div className="center-button">
            <button className="btn-secondary">Learn More</button>
            <Link to="/register">
              <button className="btn-primary">Sign Up</button>
            </Link>

          </div>
        </div>
      </section>

      <section className="testimonial my-5">
        <h2>What our users say?</h2>
        <p>
          Our fraud detection system employs advanced algorithms to identify
          suspicious activities in real-time. Seamlessly integrated with your
          existing banking infrastructure, it enhances security and protects
          your customers.
        </p>
        <div
          id="testimonialCarousel"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            <div className="carousel-item active">
              <div className="d-flex justify-content-center align-items-center flex-column text-center">
                <img
                  src="public/assets/images/testimonial1.png"
                  className="d-block rounded-circle"
                  alt="Testimonial Image"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
                <blockquote className="mt-4">
                  <p>
                    “Since implementing this fraud detection system, our losses
                    have decreased significantly. It's a game changer for our
                    financial security!”
                  </p>
                  <cite>John Doe, CFO, TechCorp</cite>
                </blockquote>
              </div>
            </div>
            <div className="carousel-item">
              <div className="d-flex justify-content-center align-items-center flex-column text-center">
                <img
                  src="public/assets/images/testimonial2.png"
                  className="d-block rounded-circle"
                  alt="Testimonial Image 2"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
                <blockquote className="mt-4">
                  <p>
                    “This system provided us with the best insights and reduced
                    the fraudulent activities drastically!”
                  </p>
                  <cite>Jane Smith, CEO, FinSafe</cite>
                </blockquote>
              </div>
            </div>
            {/* Add more carousel items as needed */}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#testimonialCarousel"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#testimonialCarousel"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </section>

      {/* <div className="container">
        <h1>FAQs</h1>
        <p>
          Here are some common questions about our fraud detection system and
          their answers.
        </p>
        <div className="faq-section">
          <div className="faq">
            <div className="faq-title">What is fraud detection?</div>
            <div className="faq-content">
              Fraud detection refers to the process of identifying and
              preventing fraudulent activities. Our system uses advanced
              algorithms to analyze transactions in real-time, helping protect
              both customers and the bank from potential losses.
            </div>
          </div>

          <div className="faq">
            <div className="faq-title">How does it work?</div>
            <div className="faq-content">
              Our system monitors transactions continuously, flagging any that
              appear suspicious. It utilizes machine learning to adapt and
              improve its detection capabilities, ensuring high accuracy in
              identifying potential fraud.
            </div>
          </div>

          <div className="faq">
            <div className="faq-title">Is it easy to use?</div>
            <div className="faq-content">
              Yes, our fraud detection system is designed with user-friendliness
              in mind. The interface is intuitive, allowing users to navigate
              easily. Comprehensive support and training are also available to
              ensure a smooth experience.
            </div>
          </div>

          <div className="faq">
            <div className="faq-title">What are the benefits?</div>
            <div className="faq-content">
              The primary benefits include enhanced security, reduced financial
              losses, and improved customer trust. By detecting fraud early, we
              can mitigate risks effectively, leading to a safer banking
              experience for everyone.
            </div>
          </div>

          <div className="faq">
            <div className="faq-title">How can I report fraud?</div>
            <div className="faq-content">
              If you suspect fraud, please contact our support team immediately.
              You can reach them via the 'Contact Us' page. We take all reports
              seriously and will investigate promptly.
            </div>
          </div>

          <div className="faq">
            <div className="faq-title">Is my data safe?</div>
            <div className="faq-content">
              Absolutely, we prioritize the security of your data. Our system
              employs state-of-the-art encryption and security measures. You can
              trust that your information is protected at all times.
            </div>
          </div>

          <div className="faq">
            <div className="faq-title">Can I customize alerts?</div>
            <div className="faq-content">
              Yes, our system allows for customizable alert settings. You can
              choose the types of notifications you wish to receive, ensuring
              you stay informed according to your preferences.
            </div>
          </div>

          <div className="faq">
            <div className="faq-title">What if I need help?</div>
            <div className="faq-content">
              If you need help, our customer support team is here for you. You
              can contact us through the 'Contact Us' page. We aim to respond
              quickly and resolve your issues.
            </div>
          </div>

          <div className="faq">
            <div className="faq-title">How often is it updated?</div>
            <div className="faq-content">
              Our fraud detection system is updated regularly to incorporate new
              data and trends. This ensures that we are always prepared to
              combat emerging threats. Continuous improvement is a core aspect
              of our service.
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}
