import "./ui.css";

const ErrorMessage = ({ message }) => {
  return (
    <div className="ui-error-message" role="alert">
      {message}
    </div>
  );
};

export default ErrorMessage;
