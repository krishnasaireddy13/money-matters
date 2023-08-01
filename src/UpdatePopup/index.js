import React, { Component } from "react";
import { AiOutlineClose } from "react-icons/ai";
import "./index.css";

class UpdatePopup extends Component {
  state = {
    transactionName: "",
    type: "",
    category: "",
    amount: "",
    date: "",
    isSubmitted: false,
    msg: "",
  };

  componentDidMount() {
    const { transaction } = this.props;
    this.setState({
      transactionName: transaction.transaction_name,
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      date: transaction.date.split("T")[0],
    });
  }

  handleNameChange = (e) => {
    this.setState({ transactionName: e.target.value });
  };

  handleAmountChange = (e) => {
    this.setState({ amount: e.target.value });
  };

  handleCategoryChange = (e) => {
    this.setState({ category: e.target.value });
  };

  handleDateChange = (e) => {
    this.setState({ date: e.target.value });
  };

  handleTypeChange = (e) => {
    this.setState({ type: e.target.value });
  };

  onUpdateFormSubmit = async (e) => {
    e.preventDefault();
    const { transactionName, type, category, amount, date } = this.state;
    const { transaction } = this.props;
    const updatedTransaction = {
      id: transaction.id,
      transaction_name: transactionName,
      type: type.toLowerCase(),
      category: category.toLowerCase(),
      amount: parseFloat(amount),
      date,
    };
    try {
      const response = await fetch(
        "https://bursting-gelding-24.hasura.app/api/rest/update-transaction",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-hasura-admin-secret":
              "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
            "x-hasura-role": "user",
            "x-hasura-user-id": "1",
          },
          body: JSON.stringify(updatedTransaction),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update transaction");
      }

      this.setState({
        isSubmitted: true,
        msg: "Transaction updated successfully!",
      });

      this.props.onUpdate(updatedTransaction);
    } catch (error) {
      console.error("Error updating transaction:", error.message);
    }
  };

  handleClose = () => {
    this.setState({ isSubmitted: false, msg: "" });
    this.props.onClose();
  };

  render() {
    const { onClose } = this.props;
    const { transactionName, msg, isSubmitted, date, category, amount, type } =
      this.state;
    return (
      <div className="popup">
        <div className="popup-content">
          <div className="popup-main-head">
            <div>
              <h1 className="add-trans">Update Transaction</h1>
              <p className="add-p">You can update your transaction here</p>
            </div>
            <button
              type="button"
              className="closeButton"
              onClick={() => {
                onClose();
                this.handleClose();
              }}
            >
              <AiOutlineClose className="close-icon" />
            </button>
          </div>

          {isSubmitted ? (
            <div className="msg-con">
              <h1 className="add-trans">{msg}</h1>
            </div>
          ) : (
            <div>
              <p className="add-msg">{msg}</p>
              <form className="add-form" onSubmit={this.onUpdateFormSubmit}>
                <label className="text-label" htmlFor="transactionName">
                  Transaction Name
                </label>
                <input
                  type="text"
                  className="text-input"
                  id="transactionName"
                  name="transactionName"
                  value={transactionName}
                  onChange={this.handleNameChange}
                />
                <label className="text-label" htmlFor="type">
                  Transaction Type
                </label>
                <select
                  id="type"
                  className="add-select"
                  name="type"
                  value={type}
                  onChange={this.handleTypeChange}
                >
                  <option value="">Select Transaction type</option>
                  <option value="Credit">Credit</option>
                  <option value="Debit">Debit</option>
                </select>
                <label htmlFor="category" className="text-label">
                  Category
                </label>
                <select
                  id="category"
                  className="add-select"
                  name="category"
                  value={category}
                  onChange={this.handleCategoryChange}
                >
                  <option value="">Select</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Transfer">Transfer</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Food">Food</option>
                </select>
                <label className="text-label" htmlFor="amount">
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  className="text-input"
                  name="amount"
                  value={amount}
                  onChange={this.handleAmountChange}
                />
                <label htmlFor="date" className="text-label">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  className="text-input"
                  name="date"
                  value={date}
                  onChange={this.handleDateChange}
                />
                <button className="form-submit" type="submit">
                  Update Transaction
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default UpdatePopup;
