import "./Landing.css";
import { Link } from "react-router-dom";
import bild1 from "./Bild1.png";

export default function Landing() {
  return (
    <div className="lp">
      <div className="lp-shell">
        <header className="lp-header">
          <div className="lp-brand">
            <div className="lp-logo" aria-hidden="true">e</div>
            <div className="lp-brandText">
              <div className="lp-brandName">Edu-Exos</div>
              <div className="lp-brandSub">learn smart • stay consistent</div>
            </div>
          </div>

          <nav className="lp-nav">
            <Link className="lp-link" to="/Login">Login</Link>
            <Link className="lp-link lp-linkGhost" to="/register">Register</Link>
          </nav>
        </header>

        <main className="lp-main">
          <section className="lp-left">
            <div className="lp-kicker">Routine • Progress • Focus</div>

            <h1 className="lp-title">
              Learn better with a <span>simple</span> routine.
            </h1>

            <p className="lp-text">
              Kurze Übungen in Mathe, Vokabeln und Konjugation.
              Mit Auto-Level, Timer und Statistiken — ohne unnötigen Stress.
            </p>

            <div className="lp-actions">
              <Link className="lp-btn lp-btnPrimary" to="/register">
                Konto erstellen
              </Link>
              <Link className="lp-btn lp-btnSecondary" to="/login">
                Einloggen
              </Link>
              
            </div>

            <div className="lp-features">
              <div className="lp-feature">
                <div className="lp-featureIcon">⏱️</div>
                <div>
                  <div className="lp-featureTitle">Mathe</div>
                  <div className="lp-featureText">Timer + Level-System</div>
                </div>
              </div>

              <div className="lp-feature">
                <div className="lp-featureIcon">🧠</div>
                <div>
                  <div className="lp-featureTitle">Vokabeln</div>
                  <div className="lp-featureText">Üben & Wiederholen</div>
                </div>
              </div>

              <div className="lp-feature">
                <div className="lp-featureIcon">🔁</div>
                <div>
                  <div className="lp-featureTitle">Konjugation</div>
                  <div className="lp-featureText">Zeiten & Verben</div>
                </div>
              </div>
            </div>

            <div className="lp-micro">
              <div className="lp-pill">Auto-Level</div>
              <div className="lp-pill">Streaks</div>
              <div className="lp-pill">Stats</div>
              <div className="lp-pill">Short sessions</div>
            </div>
          </section>

          <section className="lp-right">
            <div className="lp-imageCard">
              <div className="lp-imageGlow" aria-hidden="true" />
              <img className="lp-img" src={bild1} alt="Learning poster" />
            </div>

            <div className="lp-note">
              <div className="lp-noteTop">
                <div className="lp-noteDot" aria-hidden="true" />
                <div className="lp-noteTitle">Tipp</div>
              </div>

              <div className="lp-noteText">
                Starte als Gast oder erstelle ein Konto, damit deine Sessions gespeichert werden.
              </div>

              <div className="lp-noteActions">
                <Link className="lp-miniLink" to="/register">Account erstellen →</Link>
              </div>
            </div>
          </section>
        </main>

        <footer className="lp-footer">
          <span>© {new Date().getFullYear()} Edu-Exos</span>
          <span className="lp-dot">•</span>
          <span>Simple. Modern. Focused.</span>
        </footer>
      </div>
    </div>
  );
}