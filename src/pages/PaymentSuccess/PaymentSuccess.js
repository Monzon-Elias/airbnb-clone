import React, { Component } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltRight } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import "./PaymentSuccess.css";
import { apiUrl } from "../../api";
import axios from "axios";
import { Link } from "react-router-dom";
import Spinner from "../../utility/Spinner/Spinner";
import moment from "moment";
library.add(faLongArrowAltRight);

class PaymentSuccess extends Component {
  state = { reservationDetails: {}, venueData: {}, waiting: true };

  async componentDidMount() {
    const stripeToken = this.props.match.params.stripeToken;
    const token = this.props.auth.token;
    const data = { stripeToken, token };
    const successUrl = `${apiUrl}/payment/success`;
    const resp = await axios.post(successUrl, data);
    console.log(resp.data);
    this.setState({
      reservationDetails: resp.data.reservationDetails,
      userData: resp.data.userData,
      waiting: false,
    });
  }
  render() {
    if (this.state.waiting) return <Spinner />;
    const rd = this.state.reservationDetails;
    const vd = rd.venueData;
    const ud = this.state.userData;
    console.log(rd);

    return (
      <div className="reservation-success row">
        <h1 className="col m12 center">Start Packing!</h1>
        <div className="resv-details col s8 offset-s2">
          <div className="confirmed col m12 row">
            <FontAwesomeIcon
              icon="long-arrow-alt-right"
              size="1x"
              color="#ED0000"
            />
            Confirmed: {rd.diffDays} in {vd.location}
            <div className="header-text">
              <div>Booked by: {ud.email}</div>
              <div>{moment().format("MMMM Do, YYYY")}</div>
            </div>
          </div>
          <div className="confirmed-detail row">
            <div className="col m5">
              <div className="bordered col">
                <div className="col m12 upper">
                  <div className="left">Check in</div>
                  <div className="right">Check out</div>
                </div>
                <div className="col m12 lower">
                  <div className="left">
                    {moment(this.state.checkIn).format("MMMM Do, YYYY")}
                  </div>
                  <div className="right">
                    {moment(this.state.checkOut).format("MMMM Do, YYYY")}
                  </div>
                </div>
                <div className="col m12 title-text">{vd.title}</div>
                <div className="col m12 details">{vd.details}</div>
              </div>
            </div>

            <div className="col m7">
              <div className="bordered col">
                <div className="col m12 upper charges">
                  <div className="charges-text col m12">Charges</div>
                  <div className="row col m12">
                    <div className="left">
                      {"$" + vd.pricePerNight} x {rd.diffDays} nights
                    </div>
                    <div className="right">{"$" + rd.totalPrice}</div>
                  </div>
                  <div className="row col m12">
                    <div className="left">Discount</div>
                    <div className="right">$0</div>
                  </div>
                  <div className="row col m12 total">
                    <div className="left">TOTAL</div>
                    <div className="right">{"$" + rd.totalPrice}</div>
                  </div>
                </div>
                <div className="col m12 row">
                  To review or make changes to your reservation in the future,
                  visit your <Link to="/account">account page</Link>.
                </div>
                <div className="col m12 resv-image">
                  <img src={vd.imageUrl} />
                </div>
              </div>
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
export default connect(mapStateToProps)(PaymentSuccess);
