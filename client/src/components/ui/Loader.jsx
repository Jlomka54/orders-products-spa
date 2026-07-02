import "./ui.css";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="ui-loader" role="status">
      <span className="ui-loader__spinner" aria-hidden="true" />
      <span className="ui-loader__text">{text}</span>
    </div>
  );
};

export default Loader;
