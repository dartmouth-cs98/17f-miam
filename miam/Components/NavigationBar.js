import React, { Component } from "react";

import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
  ListView,
  ScrollView,
  Dimensions
} from "react-native";
import { Icon } from "react-native-elements";

export default class NavigationBar extends React.Component {
  render() {
    const { state } = this.props.navigation;
    return (
      <View style={styles.Navigation}>
        <TouchableHighlight
          onPress={() => {
            if (state.routeName !== "Feed") {
              this.props.navigation.navigate("Feed");
            }
          }}
          underlayColor="#ffffff"
        >
          <View>
            <Icon name="stars" color="#a044ff" size={30} />
          </View>
        </TouchableHighlight>

        <TouchableHighlight
          onPress={() => {
            if (state.routeName !== "Canvas") {
              this.props.navigation.navigate("Canvas");
            }
          }}
          underlayColor="#ffffff"
        >
          <View>
            <Icon name="control-point" color="#a044ff" size={30} />
          </View>
        </TouchableHighlight>

        <TouchableHighlight
          onPress={() => {
            if (state.routeName !== "BattleList") {
              this.props.navigation.navigate("BattleList");
            }
          }}
          underlayColor="#ffffff"
        >
          <View>
            <Icon name="flash-on" color="#a044ff" size={30} />
          </View>
        </TouchableHighlight>

        <TouchableHighlight
          onPress={() => {
            if (state.routeName !== "History") {
              this.props.navigation.navigate("History");
            }
          }}
          underlayColor="#ffffff"
        >
          <View>
            <Icon name="history" color="#a044ff" size={30} />
          </View>
        </TouchableHighlight>

        <TouchableHighlight
          onPress={() => {
            if (state.routeName !== "Profile") {
              this.props.navigation.navigate("Profile");
            }
          }}
          underlayColor="#ffffff"
        >
          <View>
            <Icon name="account-circle" color="#a044ff" size={30} />
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  Navigation: {
    width: "100%",
    height: "6%",
    backgroundColor: "#ffffff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#6a3093"
  }
});
module.exports = NavigationBar;
