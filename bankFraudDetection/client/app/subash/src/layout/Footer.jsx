import React from "react";
import "../../public/assets/css/style.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} Fraud Detection System. All rights
            reserved.
          </p>

        </div>
      </div>
    </footer>
  );
}
