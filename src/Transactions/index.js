import React, { Component } from "react";
import SideTabCon from "../sideBar";
import { BiDownArrowCircle, BiUpArrowCircle, BiTrash } from "react-icons/bi";
import { LuPencil } from "react-icons/lu";
import TransactionPopup from "../AddTransaction";
import DeletePopup from "../deletePopUp";
import UpdatePopup from "../UpdatePopup";
import "./index.css";

class Transactions extends Component {
  state = {
    allTransactions: [],
    selectedType: "all",
    transactionToDelete: null,
    isPopupOpen: false,
    isEditPopupOpen: false,
    transactionToEdit: null,
  };

  componentDidMount() {
    this.getAllTransactions();
  }

  setTransactionToDelete = (transactionId) => {
    this.setState({ transactionToDelete: transactionId });
  };
  handleAddTransactionClick = () => {
    this.setState({ isPopupOpen: true });
  };

  handleClosePopup = () => {
    this.setState({ isPopupOpen: false });
  };

  handleEditTransactionClick = (transaction) => {
    this.setState({ isEditPopupOpen: true, transactionToEdit: transaction });
  };

  handleDeleteTransaction = async (transactionId) => {
    const deleteUrl =
      "https://bursting-gelding-24.hasura.app/api/rest/delete-transaction";
    const deleteHeaders = {
      "Content-Type": "application/json",
      "x-hasura-admin-secret":
        "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
      "x-hasura-role": "user",
      "x-hasura-user-id": "1",
    };

    const deleteData = {
      id: transactionId,
    };

    try {
      const deleteResponse = await fetch(deleteUrl, {
        method: "DELETE",
        headers: deleteHeaders,
        body: JSON.stringify(deleteData),
      });

      if (deleteResponse.ok) {
        this.setState((prevState) => ({
          allTransactions: prevState.allTransactions.filter(
            (transaction) => transaction.id !== transactionId
          ),
          transactionToDelete: null,
        }));
      } else {
        console.error(
          "Delete request failed with status:",
          deleteResponse.status
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  getAllTransactions = async () => {
    const url =
      "https://bursting-gelding-24.hasura.app/api/rest/all-transactions?limit=50&offset=0";
    const headers = {
      "Content-Type": "application/json",
      "x-hasura-admin-secret":
        "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
      "x-hasura-role": "user",
      "x-hasura-user-id": "1",
    };

    fetch(url, {
      method: "GET",
      headers: headers,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Request failed with status: " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        this.setState({ allTransactions: data.transactions });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  handleListItemClick = (type) => {
    this.setState({ selectedType: type });
  };

  formatDate(inputDateTimeString) {
    const dateTime = new Date(inputDateTimeString);

    const formattedDate = dateTime.toLocaleDateString("en", {
      day: "numeric",
      month: "short",
    });

    const formattedTime = dateTime.toLocaleTimeString("en", {
      hour: "numeric",
      minute: "numeric",
    });

    const formattedDateTime = `${formattedDate}, ${formattedTime}`;

    return formattedDateTime;
  }

  render() {
    const {
      allTransactions,
      selectedType,
      transactionToDelete,
      isPopupOpen,
      isEditPopupOpen,
      transactionToEdit,
    } = this.state;
    console.log(allTransactions);

    const filteredTransactions =
      selectedType === "all"
        ? allTransactions
        : allTransactions.filter(
            (transaction) => transaction.type === selectedType
          );

    return (
      <div className="das-main-con">
        <SideTabCon className="side-con" />
        <div className="trans-con-2">
          <div className="top-head-con">
            <h1 className="Accounts">Transactions</h1>
            <button
              type="button"
              className="add-transaction"
              onClick={this.handleAddTransactionClick}
            >
              + Add Transaction
            </button>
          </div>
          <div>
            <ul className="trans-ul">
              <li
                className={selectedType === "all" ? "active" : "trans-list"}
                onClick={() => this.handleListItemClick("all")}
              >
                All Details
              </li>
              <li
                className={selectedType === "credit" ? "active" : "trans-list"}
                onClick={() => this.handleListItemClick("credit")}
              >
                Credit
              </li>
              <li
                className={selectedType === "debit" ? "active" : "trans-list"}
                onClick={() => this.handleListItemClick("debit")}
              >
                Debit
              </li>
            </ul>
          </div>
          <div>
            <ul className="trans-titles">
              <li className="t1">Transaction Name</li>
              <li className="t1">Category</li>
              <li className="t1">Date</li>
              <li className="t1">Amount</li>
            </ul>
            <ul className="trans-list">
              {filteredTransactions.map((transaction) => (
                <li key={transaction.id}>
                  {transaction.type === "credit" ? (
                    <div className="last-list-item">
                      <div className="arrow-con">
                        <BiUpArrowCircle className="up-arrow" />
                        <h1 className="trans-name">
                          {transaction.transaction_name}
                        </h1>
                      </div>

                      <p className="trans-category">{transaction.category}</p>
                      <p className="trans-date">
                        {this.formatDate(transaction.date)}
                      </p>
                      <p className="trans-credit-balance">
                        +${transaction.amount}
                      </p>
                      <div className="edit-con">
                        <button
                          type="button"
                          className="pencil-btn"
                          onClick={() =>
                            this.handleEditTransactionClick(transaction)
                          }
                        >
                          <LuPencil className="pencil" />
                        </button>
                        <button
                          type="button"
                          className="trash-btn"
                          onClick={() =>
                            this.setTransactionToDelete(transaction.id)
                          }
                        >
                          <BiTrash className="trash" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="last-list-item">
                      <div className="arrow-con">
                        <BiDownArrowCircle className="down-arrow" />
                        <h1 className="trans-name">
                          {transaction.transaction_name}
                        </h1>
                      </div>

                      <p className="trans-category">{transaction.category}</p>
                      <p className="trans-date">
                        {this.formatDate(transaction.date)}
                      </p>
                      <p className="trans-debit-balance">
                        -${transaction.amount}
                      </p>
                      <div className="edit-con">
                        <button
                          type="button"
                          className="pencil-btn"
                          onClick={() =>
                            this.handleEditTransactionClick(transaction)
                          }
                        >
                          <LuPencil className="pencil" />
                        </button>
                        <button
                          type="button"
                          className="trash-btn"
                          onClick={() =>
                            this.setTransactionToDelete(transaction.id)
                          }
                        >
                          <BiTrash className="trash" />
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
          {transactionToDelete && (
            <DeletePopup
              onClose={() => this.setTransactionToDelete(null)}
              onDelete={() => this.handleDeleteTransaction(transactionToDelete)}
            />
          )}

          {isPopupOpen && <TransactionPopup onClose={this.handleClosePopup} />}

          {isEditPopupOpen && (
            <UpdatePopup
              transaction={transactionToEdit}
              onClose={() => this.setState({ isEditPopupOpen: false })}
              onUpdate={(updatedTransaction) =>
                this.handleUpdateTransaction(updatedTransaction)
              }
            />
          )}
        </div>
      </div>
    );
  }
}

export default Transactions;
