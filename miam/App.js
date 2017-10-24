import React from "react";
import { StyleSheet, Text, View, TabBarIOS } from "react-native";
import Feed from "./Components/Feed";
import Canvas from "./Components/Canvas";
import LogIn from "./Components/LogIn";
import SignUp from "./Components/SignUp";
import MainFiveTabs from "./Components/MainFiveTabs";
import { AuthRoot } from './router';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: true,
      view: <AuthRoot />,
      kind: "AuthRoot"
    };
  }
  render() {
      return <AuthRoot />;
  }
}
