export default function About() {
  return (
    <section className="about-us-section">
      <div className="container">
        <h1>About Us</h1>
        <p className="intro-text">
          Welcome to [Your Company Name], where innovation meets excellence. We
          are a team of passionate professionals committed to delivering
          exceptional solutions for your business. Our goal is to empower our
          clients with the tools and services they need to thrive in today’s
          fast-paced world.
        </p>

        <div className="about-content">
          <div className="about-item">
            <div className="image-placeholder">
              <img
                src="public/assets/images/mission.png"
                alt="Fraud Detection Illustration"
              ></img>
            </div>
            <h2>Our Mission</h2>
            <p>
              Our mission is to provide high-quality products and services that
              exceed the expectations of our customers. We strive to create a
              lasting impact in the industries we serve by offering solutions
              that are innovative, reliable, and sustainable.
            </p>
          </div>

          <div className="about-item">
          <div className="image-placeholder">
              <img
                src="public/assets/images/vision.png"
                alt="Fraud Detection Illustration"
              ></img>
            </div>
            <h2>Our Vision</h2>
            <p>
              Our vision is to be a global leader in our field, known for our
              commitment to excellence, our innovation, and our ability to
              consistently deliver value to our clients.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
