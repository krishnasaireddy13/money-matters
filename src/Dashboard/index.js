import { Component } from "react";
import SideTabCon from "../sideBar";
import { BiDownArrowCircle, BiUpArrowCircle, BiTrash } from "react-icons/bi";
import { LuPencil } from "react-icons/lu";
import { Chart } from "react-google-charts";
import TransactionPopup from "../AddTransaction";
import DeletePopup from "../deletePopUp";
import UpdatePopup from "../UpdatePopup";
import "./index.css";

class Dashboard extends Component {
  state = {
    lastTransaction: [],
    credit: 0,
    debit: 0,
    userId: "",
    last7Days: [],
    data: [],
    chartData: [],
    creditSum: 0,
    debitSum: 0,
    isPopupOpen: false,
    transactionToDelete: null,
    isEditPopupOpen: false,
    transactionToEdit: null,
  };

  componentDidMount() {
    this.getUserId();
    this.getCreditDebit();
    this.LastTransactions();
    this.Last7Days();
    this.convertDataForChart();
  }

  handleAddTransactionClick = () => {
    this.setState({ isPopupOpen: true });
  };

  handleClosePopup = () => {
    this.setState({ isPopupOpen: false });
  };

  setTransactionToDelete = (transactionId) => {
    this.setState({ transactionToDelete: transactionId });
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
          lastTransaction: prevState.lastTransaction.filter(
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

  LastTransactions = async () => {
    const url =
      "https://bursting-gelding-24.hasura.app/api/rest/all-transactions?limit=5&offset=0";
    const headers = {
      "Content-Type": "application/json",
      "x-hasura-admin-secret":
        "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
      "x-hasura-role": "admin",
    };

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });

      if (response.ok) {
        const data = await response.json();
        this.setState({ lastTransaction: data.transactions });
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  getUserId = async () => {
    const ProfileUrl =
      "https://bursting-gelding-24.hasura.app/api/rest/get-user-id";

    try {
      const profileResponse = await fetch(ProfileUrl, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-hasura-admin-secret":
            "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
        },
        body: JSON.stringify({
          email: "jane.doe@gmail.com",
          password: "janedoe@123",
        }),
      });

      const data = await profileResponse.json();
      const id = data.get_user_id[0].id.toString();
      this.setState({ userId: id });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  getCreditDebit = async () => {
    const url =
      "https://bursting-gelding-24.hasura.app/api/rest/credit-debit-totals";
    const headers = {
      "Content-Type": "application/json",
      "x-hasura-admin-secret":
        "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
      "x-hasura-role": "user",
      "x-hasura-user-id": "1",
    };

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        this.setState({
          debit: data.totals_credit_debit_transactions[0].sum,
          credit: data.totals_credit_debit_transactions[1].sum,
        });
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  Last7Days = async () => {
    const url =
      "https://bursting-gelding-24.hasura.app/api/rest/daywise-totals-7-days";
    const headers = {
      "Content-Type": "application/json",
      "x-hasura-admin-secret":
        "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
      "x-hasura-role": "user",
      "x-hasura-user-id": "1",
    };

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });

      if (response.ok) {
        const data = await response.json();
        this.setState({
          last7Days: data.last_7_days_transactions_credit_debit_totals,
        });
        this.convertDataForChart();
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
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

  convertDataForChart() {
    const { last7Days } = this.state;

    const chartData = [["Date", "Credit", "Debit"]];
    const dateMap = new Map();
    let creditSum = 0;
    let debitSum = 0;

    last7Days.forEach((item) => {
      const date = new Date(item.date.split("T")[0]);
      const formattedDate = date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
      const type = item.type === "credit" ? 1 : 2;

      if (dateMap.has(formattedDate)) {
        dateMap.get(formattedDate)[type] += item.sum;
      } else {
        dateMap.set(formattedDate, [formattedDate, 0, 0]);
        dateMap.get(formattedDate)[type] = item.sum;
      }

      if (item.type === "credit") {
        creditSum += item.sum;
      } else {
        debitSum += item.sum;
      }
    });

    dateMap.forEach((value) => {
      chartData.push(value);
    });

    this.setState({ chartData, creditSum, debitSum });
  }

  handleEditTransactionClick = (transaction) => {
    this.setState({ isEditPopupOpen: true, transactionToEdit: transaction });
  };

  render() {
    const {
      credit,
      debit,
      lastTransaction,
      isPopupOpen,
      chartData,
      creditSum,
      debitSum,
      transactionToDelete,
      isEditPopupOpen,
      transactionToEdit,
    } = this.state;
    return (
      <div className="das-main-con">
        <SideTabCon className="side-con" />
        <div className="das-con1">
          <div className="das-con2">
            <h1 className="Accounts">Accounts</h1>
            <button
              type="button"
              onClick={this.handleAddTransactionClick}
              className="add-transaction"
            >
              + Add Transaction
            </button>
          </div>

          <div className="dahboard-scroll">
            <div className="das-con3">
              <div className="credit-con">
                <div className="credit-con1">
                  <h1 className="credit-balance">${credit}</h1>
                  <p className="credit-p">Credit</p>
                </div>

                <img
                  src="https://res.cloudinary.com/dlyyekdqr/image/upload/v1690777136/Group_ptczxi.png"
                  className="credit-img"
                  alt="credit"
                />
              </div>
              <div className="debt-con">
                <div className="debt-con1">
                  <h1 className="debt-balance">${debit}</h1>
                  <p className="debt-p">Dedit</p>
                </div>
                <img
                  src="https://res.cloudinary.com/dlyyekdqr/image/upload/v1690777136/Group_1_lhlx62.png"
                  className="debt-img"
                  alt="debt"
                />
              </div>
            </div>

            <div className="last-trans-con">
              <h1 className="last-transaction">Last Transaction</h1>
              <div className="last-list-container">
                <ul className="last-ul">
                  {lastTransaction.map((transaction) => (
                    <li key={transaction.id}>
                      {transaction.type === "credit" ? (
                        <div className="last-list-item">
                          <div className="arrow-con">
                            <BiUpArrowCircle className="up-arrow" />
                            <h1 className="trans-name">
                              {transaction.transaction_name}
                            </h1>
                          </div>

                          <p className="trans-category">
                            {transaction.category}
                          </p>
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

                          <p className="trans-category">
                            {transaction.category}
                          </p>
                          <p className="trans-date">
                            {this.formatDate(transaction.date)}
                          </p>
                          <p className="trans-debit-balance">
                            -${transaction.amount}
                          </p>
                          <div className="edit-con">
                            <button type="button" className="pencil-btn">
                              <LuPencil className="pencil" />
                            </button>
                            <button type="button" className="trash-btn">
                              <BiTrash className="trash" />
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="graph-main-con">
              <h1 className="graph-head">Debit & Credit Overview</h1>
              <div className="graph-con">
                <Chart
                  chartType="ColumnChart"
                  width="100%"
                  height="400px"
                  data={chartData}
                  options={{
                    title: `$${debitSum} Debited & $${creditSum} in this week`,
                    chartArea: { width: "70%" },
                    hAxis: {
                      title: "Date",
                    },
                    vAxis: {
                      title: "Amount",
                    },
                    colors: ["#4D78FF", "#fcaa0b", "#4D78FF"],
                  }}
                  className="graph"
                />
              </div>
            </div>

            {isPopupOpen && (
              <TransactionPopup onClose={this.handleClosePopup} />
            )}

            {isEditPopupOpen && (
              <UpdatePopup
                transaction={transactionToEdit}
                onClose={() => this.setState({ isEditPopupOpen: false })}
                onUpdate={(updatedTransaction) =>
                  this.handleUpdateTransaction(updatedTransaction)
                }
              />
            )}

            {transactionToDelete && (
              <DeletePopup
                onClose={() => this.setTransactionToDelete(null)}
                onDelete={() =>
                  this.handleDeleteTransaction(transactionToDelete)
                }
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
