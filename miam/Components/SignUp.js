import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Button, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

class SignUp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };

    this.changeEmail = this.changeEmail.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  changeEmail(event) {
    this.setState({
      email: event.target.value,
    });
  }

  changePassword(event) {
    this.setState({
      password: event.target.value,
    });
  }

  submitForm() {
    const user = {
      email: this.state.email,
      password: this.state.password,
    };
    //this.props.signupUser(user);
  }

  render() {
    return (
      <div className="signupbox col-md-6 col-md-offset-3">
        <div className="emailrow">
          <div>Email</div>
          <input value={this.state.email} onChange={this.changeEmail} />
        </div>
        <div className="passwordrow">
          <div>Password</div>
          <input value={this.state.password} onChange={this.changePassword} />
        </div>
        <div className="loginbutton">
          <button className="submitjob" onClick={this.submitForm}>Submit</button>
        </div>
        <div>
          <Link id="link" to="/signin">Sign In</Link>
        </div>
      </div>
    );
  }
}

export default SignUp;
