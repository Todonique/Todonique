import "./CtaButton.css";

const CtaButton = ({ text, onClick, disabled = false }) => {
  return (
    <button
      className="cta-button"
      onClick={onClick}
      disabled={disabled}
      aria-label={text}
    >
      {text}
    </button>
  );
};

export default CtaButton;