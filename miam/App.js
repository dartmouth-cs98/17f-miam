import React from "react";
import { StyleSheet, Text, View, TabBarIOS } from "react-native";
import Feed from "./Components/Feed";
import Canvas from "./Components/Canvas";
import LogIn from "./Components/LogIn";
import SignUp from "./Components/SignUp";
import Profile from "./Components/Profile";
import MainFiveTabs from "./Components/MainFiveTabs";
import { AuthRoot } from './router';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: "featured",
      loggedIn: true,
      view: <AuthRoot />,
      kind: "AuthRoot"
    };
  }
  render() {
    if (this.state.loggedIn) {
      return (
        <TabBarIOS selectedTab={this.state.selectedTab}>
          <TabBarIOS.Item
            selected={this.state.selectedTab === "featured"}
            systemIcon="featured"
            onPress={() => {
              this.setState({
                selectedTab: "featured"
              });
            }}
          >
            <Feed />
          </TabBarIOS.Item>

          <TabBarIOS.Item
            selected={this.state.selectedTab === "search"}
            systemIcon="search"
            onPress={() => {
              this.setState({
                selectedTab: "search"
              });
            }}
          >
            <Canvas />
          </TabBarIOS.Item>

          <TabBarIOS.Item
            selected={this.state.selectedTab === "more"}
            systemIcon="more"
            onPress={() => {
              this.setState({
                selectedTab: "more"
              });
            }}
          >
            <Feed />
          </TabBarIOS.Item>

          <TabBarIOS.Item
            selected={this.state.selectedTab === "favorites"}
            systemIcon="favorites"
            onPress={() => {
              this.setState({
                selectedTab: "favorites"
              });
            }}
          >
            <Feed />
          </TabBarIOS.Item>

          <TabBarIOS.Item
            selected={this.state.selectedTab === "contacts"}
            systemIcon="contacts"
            onPress={() => {
              this.setState({
                selectedTab: "contacts"
              });
            }}
          >
            <Profile />
          </TabBarIOS.Item>
        </TabBarIOS>
      );
    } else {
      return <AuthRoot />;
    }
  }
}
