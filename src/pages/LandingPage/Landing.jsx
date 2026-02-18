import "./landing.css";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="landing">
      {/* HERO */}
      <section className="hero">
        <img
          className="hero-img"
          src="Bild1.png"
          alt="Abstract Online E-learning"
        />

        <div className="hero-box">
          <h2 className="hero-title">Learn. Understand. Grow.</h2>
          <p className="hero-text">
            Welcome to our learning platform — a place where knowledge becomes
            simple, clear, and practical. Here, you can explore topics step by
            step and understand how things work in the real world. We focus on
            learning by understanding, not just memorizing.
          </p>
        </div>
      </section>

      {/* 3 CARDS */}
      <section className="cards">
        <article className="card card-left">
          <div className="card-icon">💎</div>
          <h3 className="card-title">A good foundation</h3>
          <p className="card-text">
            Learning website is designed to be easy to use and accessible for
            everyone. Clear navigation, a clean layout, and mobile compatibility
            allow learners to focus on their studies without distractions.
          </p>
        </article>

        <article className="card">
          <div className="card-icon">🔬</div>
          <h3 className="card-title">High quality content</h3>
          <p className="card-text">
            Lessons are well structured, up to date, and explained in a simple
            and logical way. Interactive elements such as quizzes and practical
            exercises help learners stay engaged.
          </p>
        </article>

        <article className="card card-right">
          <div className="card-icon">🧠</div>
          <h3 className="card-title">E-learning Platform</h3>
          <p className="card-text">
            The learning website supports flexible and personalized learning.
            Users can learn at their own pace, track progress, and follow
            learning paths adapted to their level and goals.
          </p>
        </article>
      </section>

      {/* CTA */}
      <div className="cta">
        <Link className="cta-btn" to="/dashboard">
          Let&apos;s Study
        </Link>
      </div>
    </div>
  );
}