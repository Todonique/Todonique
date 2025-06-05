import { useNavigate } from "react-router-dom";
import CtaButton from "../../components/ctaButton.jsx/CtaButton";
import "./LandingPage.css";
import { useEffect } from "react";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleAlreadyLoggedIn = () => {
    if (localStorage.getItem("token")) {
      navigate("/portal");
    }
  };

  useEffect(() => {
    handleAlreadyLoggedIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignInClick = () => {
    navigate("/auth/login");
  };

  const handleRegisterClick = () => {
    navigate("/auth/register");
  };

  return (
    <section className="landing-page">
      <h1 className="landing-page__title">Todonique</h1>
      <p className="landing-page__subheading">Organize your day with ease.</p>
      <section className="landing-page__actions">
        <CtaButton text="Sign In" onClick={handleSignInClick} />
        <CtaButton text="Register" onClick={handleRegisterClick} />
      </section>
    </section>
  );
};

export default LandingPage;