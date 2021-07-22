import React, { Component } from "react";
import Login from "./Login";
import "./Login.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import openModal from "../../actions/openModal";
import { apiUrl } from "../../api";
import axios from "axios";
import swal from "sweetalert";
import regAction from "../../actions/regAction";

class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      lowerPartOfForm: (
        <button
          type="button"
          onClick={this.showInputs}
          className="sign-up-button"
        >
          Sign up with email
        </button>
      ),
    };
  }

  changeEmail = (e) => {
    this.setState({ email: e.target.value });
  };
  changePassword = (e) => {
    this.setState({ password: e.target.value });
  };

  showInputs = () => {
    this.setState({
      lowerPartOfForm: (
        <SignUpInputFields
          changeEmail={this.changeEmail}
          changePassword={this.changePassword}
        />
      ),
    });
  };

  submitLogin = async (e) => {
    e.preventDefault();
    //console.log(this.state.email);
    //console.log(this.state.password);
    const url = `${apiUrl}/users/signup`;
    const data = { email: this.state.email, password: this.state.password };

    const resp = await axios.post(url, data);
    const token = resp.data.token;
    console.log(token);
    console.log(resp.data);

    //////////////////////////////
    //resp.data.msg could be:
    //-invalidData
    //-userExists
    //-userAdded

    if (resp.data.msg === "userExists") {
      swal({
        title: "Email Exists",
        text: "Email provided already exists",
        icon: "error",
      });
    } else if (resp.data.msg === "invalidData") {
      swal({
        title: "Invalid Email/Password",
        text: "Please, provide a valid email and/or password",
        icon: "error",
      });
    } else if (resp.data.msg === "userAdded") {
      swal({ title: "Success!", icon: "success" });
      //we call our register action to update our auth reducer!
      this.props.regAction(resp.data);
    }
    // const url2 = `${apiUrl}/users/token-check`
    // const resp2 = await axios.post(url2, {token});
    // console.log(resp2);
  };

  render() {
    //console.log(this.props.auth);
    return (
      <div className="login-form">
        <form onSubmit={this.submitLogin}>
          <button className="facebook-login">Connect With Facebook</button>
          <button className="google-login">Connect With Google</button>
          <div className="login-or center">
            <span>or</span>
            <div className="or-divider"></div>
          </div>
          {this.state.lowerPartOfForm}
          <div className="divider"></div>
          <div>
            Already have an account?{" "}
            <span
              className="pointer"
              onClick={() => {
                this.props.openModal("open", <Login />);
              }}
            ></span>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { auth: state.auth };
};
const mapDispatchToProps = (dispatcher) => {
  return bindActionCreators(
    { openModal: openModal, regAction: regAction },
    dispatcher
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);

//SignUpInputFields Component

const SignUpInputFields = (props) => {
  return (
    <div className="sign-up-wrapper">
      <div className="col m12">
        <div className="input-field" id="email">
          <div className="form-label">Email</div>
          <input
            type="text"
            placeholder="Email"
            onChange={props.changeEmail}
          ></input>
        </div>
      </div>
      <div className="col m12">
        <div className="input-field" id="password">
          <div className="form-label">Password</div>
          <input
            type="password"
            placeholder="Password"
            onChange={props.changePassword}
          ></input>
        </div>
      </div>
      <div className="col m12">
        <button type="submit" className="btn red accent-2">
          Sign Up!
        </button>
      </div>
    </div>
  );
};
