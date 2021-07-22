import React, { Component } from "react";
import "./SingleFullVenue.css";
import axios from "axios";
import { apiUrl } from "../api";
import Point from "./Point";
import Login from "../pages/Login/Login";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import openModal from "../actions/openModal";
import moment from "moment";
import swal from "sweetalert";
import loadScript from "../utilityFunctions/loadScript";

class SingleFullVenue extends Component {
  state = {
    singleVenue: {},
    points: [],
    checkIn: "",
    checkOut: "",
    numberOfGuests: 1,
  };

  async componentDidMount() {
    const vId = this.props.match.params.vid;
    const url = `${apiUrl}/venue/${vId}`;
    const axiosResp = await axios.get(url);
    const singleVenue = axiosResp.data;
    console.log(singleVenue);

    const pointsUrl = `${apiUrl}/points/get`;
    const axiosRespPoints = await axios.get(pointsUrl);
    console.log(axiosRespPoints);
    const points = singleVenue.points.split(",").map((point, i) => {
      return <Point key={i} pointDesc={axiosRespPoints.data} point={point} />;
    });
    this.setState({ singleVenue, points });
  }

  changeNumberOfGuests = (e) => {
    this.setState({ numberOfGuests: e.target.value });
  };
  changeCheckIn = (e) => {
    this.setState({ checkIn: e.target.value });
  };
  changeCheckOut = (e) => {
    this.setState({ checkOut: e.target.value });
  };
  reserveNow = async (e) => {
    const startDayMoment = moment(this.state.checkIn);
    const endDayMoment = moment(this.state.checkOut);
    const diffDays = endDayMoment.diff(startDayMoment, "days");
    if (diffDays < 1) {
      swal({
        title: "Check our date must be after check in date",
        icon: "error",
      });
    } else if (isNaN(diffDays)) {
      swal({
        title: "Please, make sure your dates are valid",
        icon: "error",
      });
    } else {
      const pricePerNight = this.state.singleVenue.pricePerNight;
      const totalPrice = pricePerNight * diffDays;
      const scriptUrl = "https://js.stripe.com/v3";
      const stripePublicKey =
        "pk_test_5198HtPL5CfCPYJ3X8TTrO06ChWxotTw6Sm2el4WkYdrfN5Rh7vEuVguXyPrTezvm3ntblRX8TpjAHeMQfHkEpTA600waD2fMrT";
      await loadScript(scriptUrl);
      const stripe = window.Stripe(stripePublicKey);
      const stripeSessionUrl = `${apiUrl}/payment/create-session`;
      const data = {
        venueData: this.state.singleVenue,
        totalPrice,
        diffDays,
        pricePerNight,
        checkIn: this.state.checkIn,
        checkOut: this.state.checkOut,
        token: this.props.auth.token,
        currency: "USD",
      };
      const sessionVar = await axios.post(stripeSessionUrl, data);
      //console.log(sessionVar.data)
      stripe
        .redirectToCheckout({ sessionId: sessionVar.data.id })
        .then((result) => console.log(result));
    }
  };

  render() {
    const sv = this.state.singleVenue;
    console.log(sv);
    return (
      <div className="row single-venue">
        <div className="col s12 center">
          <img src={sv.imageUrl} />
        </div>
        <div className="col s8 location-details offset-s2">
          <div className="col s8 left-details">
            <div className="location">{sv.location}</div>
            <div className="title">{sv.title}</div>
            <div className="guests">{sv.guests}</div>

            <div className="divider"></div>

            {this.state.points}

            <div className="details">{sv.details}</div>
            <div className="amenities">{sv.amenities}</div>
          </div>

          <div className="col s4 right-details">
            <div className="price-per-day">
              ${sv.pricePerNight} <span>per day</span>
            </div>
            <div className="rating">{sv.rating}</div>
            <div className="col s6">
              Check-In
              <input
                type="date"
                onChange={this.changeCheckIn}
                value={this.state.checkIn}
              />
            </div>
            <div className="col s6">
              Check-Out
              <input
                type="date"
                onChange={this.changeCheckOut}
                value={this.state.checkOut}
              />
            </div>

            <div className="col s12">
              <select
                className="browser-default"
                onChange={this.changeNumberOfGuests}
                value={this.state.numberOfGuests}
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guest</option>
                <option value="3">3 Guest</option>
                <option value="4">4 Guest</option>
                <option value="5">5 Guest</option>
                <option value="6">6 Guest</option>
                <option value="7">7 Guest</option>
                <option value="8">8 Guest</option>
              </select>
            </div>
            <div className="col s12 center">
              {this.props.auth.token ? (
                <button onClick={this.reserveNow} className="btn red accent-2">
                  Reserve
                </button>
              ) : (
                <div>
                  You must{" "}
                  <span
                    className="text-link"
                    onClick={() => {
                      this.props.openModal("open", <Login />);
                    }}
                  >
                    Log in
                  </span>{" "}
                  to reserve
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { auth: state.auth };
};
const mapDispatchToProps = (dispatcher) => {
  return bindActionCreators({ openModal }, dispatcher);
};
export default connect(mapStateToProps, mapDispatchToProps)(SingleFullVenue);
