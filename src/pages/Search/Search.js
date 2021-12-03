import axios from "axios";
import React, { Component } from "react";
import { apiUrl } from "../../api";
import Spinner from "../../utility/Spinner/Spinner";
import "../Home/Home.css";
import Cities from "../../utility/City/Cities";
import Activities from "../../utility/Activity/Activities";
import Venues from "../../utility/Venue/Venues";

class Search extends Component {
  state = { activities: [], cities: [], venues: [], apiResp: false };

  async componentDidMount() {
    const searchTerm = this.props.match.params.searchTerm;
    const url = `${apiUrl}/search/${searchTerm}`;
    const resp = await axios.get(url);
    this.setState({
      activities: resp.data.activities,
      cities: resp.data.cities,
      venues: resp.data.venues,
      apiResp: true,
    });
  }
  render() {
    if (!this.state.apiResp) return <Spinner />;
    return (
      <div className="container-fluid lower-fold">
        <div className="row">
          <div className="col s12">
            <Cities
              cities={this.state.cities}
              header="Cities Matching your Search"
            />
          </div>
          <div className="col s12">
            <Activities
              activities={this.state.activities}
              header="Activities Matching your Search"
            />
          </div>
          <div className="col s12">
            <Venues
              venues={this.state.venues}
              header="Venues Matching your Search"
            />
          </div>
        </div>
      </div>
    );
  }
}
export default Search;
