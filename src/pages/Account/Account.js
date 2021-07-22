import React, { Component } from "react";
import "./Account.css";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { apiUrl } from "../../api";
import axios from "axios";
import moment from "moment";
import AccountSideBar from "./AccountSideBar";
import Bookings from "./Bookings";
import ChangePassword from "./ChangePassword";

class Account extends Component {
  state = { pastBookings: [], upcomingBookings: [] };

  async componentDidMount() {
    const accountUrl = `${apiUrl}/users/getBookings`;
    const data = { token: this.props.auth.token };
    const resp = await axios.post(accountUrl, data);
    console.log(resp.data);
    let pastBookings = [];
    let upcomingBookings = [];
    resp.data.forEach((booking) => {
      const today = moment(); //point of reference to know what is past & future
      const checkOutDate = moment(booking.checkOut);
      const diffDays = checkOutDate.diff(today, "days");
      if (diffDays < 0) pastBookings.push(booking);
      else upcomingBookings.push(booking);
    });
    this.setState({ pastBookings, upcomingBookings });
  }

  render() {
    const { pastBookings, upcomingBookings } = this.state;
    return (
      <div className="account container-fluid">
        <AccountSideBar />
        <div className="row">
          <div className="col s8 offset-s3">
            <Route
              exact
              path="/account"
              render={() => <h2>Choose an option on the left!</h2>}
            />
            <Route exact path="/account/reservations/confirmed">
              <Bookings
                type="upcoming"
                bookings={upcomingBookings}
                token={this.props.auth.token}
              />
            </Route>
            <Route exact path="/account/reservations/past">
              <Bookings type="past" bookings={pastBookings} />
            </Route>
            <Route
              exact
              path="/account/change-pass"
              component={ChangePassword}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { auth: state.auth };
};
// const mapDispatchToProps = (dispatcher) => {
//   return bindActionCreators(
//     { openModal: openModal },
//     dispatcher
//   );
// };

export default connect(mapStateToProps)(Account);
