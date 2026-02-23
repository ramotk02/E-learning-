import "./Landing.css";
import { Link } from "react-router-dom";
import bild1 from "./Bild1.png";

export default function Landing() {
  return (
    <div className="landing">
      <section className="hero">
        <div className="poster">
          <img className="poster-img" src={bild1} alt="E-learning" />
          <div className="poster-glow" />
        </div>

        <div className="hero-box">
          <h2 className="hero-title">
            Learn. Understand. <span>Grow.</span>
          </h2>

          <p className="hero-text">
            Welcome to our learning platform — a place where knowledge becomes
            simple, clear, and practical. Here, you can explore topics step by
            step and understand how things work in the real world. We focus on
            learning by understanding, not just memorizing.
          </p>

          <div className="hero-actions">
            <Link className="btn btn-primary" to="/dashboard">
              Let&apos;s Study
            </Link>

            {/* ✅ Login route */}
            <Link className="btn btn-secondary" to="/login">
              Login
            </Link>
          </div>
        </div>
      </section>

      <section className="cards">
        <article className="card card-left">
          <div className="card-top">
            <span className="card-icon"></span>
            <h3 className="card-title">A good foundation</h3>
          </div>
          <p className="card-text">
            Learning website is designed to be easy to use and accessible for everyone.
            Clear navigation and mobile compatibility allow learners to focus without distractions.
          </p>
        </article>

        <article className="card">
          <div className="card-top">
            <span className="card-icon"></span>
            <h3 className="card-title">High quality content</h3>
          </div>
          <p className="card-text">
            Lessons are well structured, up to date and explained in a simple way.
            Interactive elements such as quizzes keep learners engaged.
          </p>
        </article>

        <article className="card card-right">
          <div className="card-top">
            <span className="card-icon"></span>
            <h3 className="card-title">E-learning Platform</h3>
          </div>
          <p className="card-text">
            The platform supports flexible and personalized learning.
            Users can learn at their own pace, track progress and reach goals.
          </p>
        </article>
      </section>
    </div>
  );
}