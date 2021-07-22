import React, { Component } from "react";
import "./SearchBox.css";

class SearchBox extends Component {
  state = { where: "", checkIn: "", checkOut: "", guests: 0 };

  changeWhere = (e) => this.setState({ where: e.target.value });
  changeCheckIn = (e) => this.setState({ checkIn: e.target.value });
  changeCheckOut = (e) => this.setState({ checkOut: e.target.value });
  changeGuests = (e) => this.setState({ guests: e.target.value });

  submitSearch = (e) => {
    e.preventDefault();
    this.props.history.push(`/search/${this.state.where}`);
  };
  render() {
    return (
      <div className="home-search-box col m4">
        <h1>Book unique places to stay and things to do</h1>
        <form onSubmit={this.submitSearch} className="search-box-form">
          <div className="col m12">
            <div className="input-field" id="where">
              <input
                type="text"
                onChange={this.changeWhere}
                placeholder="Anywhere"
                value={this.state.where}
              ></input>
            </div>
          </div>

          <div className="col m6">
            <div className="input-field" id="check-in">
              <div className="form-label">From</div>
              <input
                type="date"
                onChange={this.changeCheckIn}
                value={this.state.checkIn}
              ></input>
            </div>
          </div>

          <div className="col m6">
            <div className="input-field" id="check-out">
              <div className="form-label">To</div>
              <input
                type="date"
                onChange={this.changeCheckOut}
                value={this.state.checkOut}
              ></input>
            </div>
          </div>

          <div className="col m12">
            <div className="input-field" id="guests">
              <div className="form-label">Guest/s</div>
              <input
                type="number"
                onChange={this.changeGuests}
                value={this.state.guests}
              ></input>
            </div>
          </div>

          <div className="col m12 submit-btn">
            <div className="input-field" id="submit-btn">
              <input
                className="btn-large waves-effect waves-light red accent-2"
                type="submit"
                onChange={this.changeGuests}
              ></input>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
export default SearchBox;
