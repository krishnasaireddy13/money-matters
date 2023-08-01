import React from "react";
import "./index.css";

const DeletePopup = ({ onClose, onDelete }) => {
  return (
    <div className="popup">
      <div className="delete-confirmation-popup">
        <p className="delete-head">Are you sure you want to Delete?</p>
        <p className="delete-p">
          This transaction will be deleted immediately. You can’t undo this
          action.
        </p>
        <div>
          <button onClick={() => onDelete()} className="btn-confirm">
            Yes, Delete
          </button>
          <button onClick={() => onClose()} className="btn-cancel">
            No Thanks
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
