import "./ui.css";

const isNewProduct = (isNew) => isNew === true || isNew === 1;

const StatusBadge = ({ isNew }) => {
  const statusIsNew = isNewProduct(isNew);

  return (
    <span
      className={`ui-status-badge${
        statusIsNew ? " ui-status-badge--new" : " ui-status-badge--used"
      }`}
    >
      {statusIsNew ? "новый" : "Б / У"}
    </span>
  );
};

export default StatusBadge;
