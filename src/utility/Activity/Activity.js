import React, { Component } from "react";
import "./Activity.css";
//import { Link } from "react-router-dom"; link was wrapping the activity div

class Activity extends Component {
  render() {
    console.log(this.props.activity);
    const { activityType, cost, id, image, rating, title, totalRatings } =
      this.props.activity;
    return (
      <div className="activity">
        <img src={image}></img>
        <div className="activity-type">{activityType}</div>
        <div className="title">{title}</div>
        <div className="cost">Form ${cost}/person</div>
        <div className="rating">
          <i className="material-icons">star</i>
          {rating} ({totalRatings})
        </div>
      </div>
    );
  }
}
export default Activity;
