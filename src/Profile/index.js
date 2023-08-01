import { Component } from "react";
import SideTabCon from "../sideBar";
import TransactionPopup from "../AddTransaction";
import "./index.css";

class Profile extends Component {
  state = { name: "", email: "", DOB: "", isPopupOpen: false, user: "" };
  componentDidMount() {
    this.getProfileDetails();
  }

  getProfileDetails = async () => {
    const headers = {
      "Content-Type": "application/json",
      "x-hasura-admin-secret":
        "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
      "x-hasura-role": "user",
      "x-hasura-user-id": "1",
    };

    const url = "https://bursting-gelding-24.hasura.app/api/rest/profile";

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
        this.setState({
          name: data.users[0].name,
          email: data.users[0].email,
          DOB: data.users[0].date_of_birth,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  handleAddTransactionClick = () => {
    this.setState({ isPopupOpen: true });
  };

  handleClosePopup = () => {
    this.setState({ isPopupOpen: false });
  };

  render() {
    const { name, email, DOB, isPopupOpen } = this.state;
    return (
      <div className="profile-main-con">
        <SideTabCon />
        <div className="profile-con2">
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

          <div className="profile-con3">
            <img
              src="https://res.cloudinary.com/dlyyekdqr/image/upload/v1690872493/pexels-christina-morillo-1181690_1_kx9lf5.png"
              alt="profile-img"
              className="profile-img"
            />
            <div className="details-con">
              <div className="name-con">
                <p className="name-head">Your Name</p>
                <p className="name">{name}</p>
              </div>

              <div className="name-con">
                <p className="name-head">Username</p>
                <p className="name">{name}</p>
              </div>

              <div className="name-con">
                <p className="name-head">Email</p>
                <p className="name">{email}</p>
              </div>

              <div className="name-con">
                <p className="name-head">Date of Birth</p>
                <p className="name">{DOB}</p>
              </div>
            </div>
          </div>
        </div>

        {isPopupOpen && <TransactionPopup onClose={this.handleClosePopup} />}
      </div>
    );
  }
}

export default Profile;
