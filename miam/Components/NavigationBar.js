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
          underlayColor="#f2d9d9"
        >
          <View>
            <Icon name="stars" color="#862d59" size={30} />
          </View>
        </TouchableHighlight>

        <TouchableHighlight
          onPress={() => {
            if (state.routeName !== "Canvas") {
              this.props.navigation.navigate("Canvas");
            }
          }}
          underlayColor="#f2d9d9"
        >
          <View>
            <Icon name="control-point" color="#862d59" size={30} />
          </View>
        </TouchableHighlight>

        <TouchableHighlight
          onPress={() => {
            if (state.routeName !== "BattleList") {
              this.props.navigation.navigate("BattleList");
            }
          }}
          underlayColor="#f2d9d9"
        >
          <View>
            <Icon name="whatshot" color="#862d59" size={30} />
          </View>
        </TouchableHighlight>

        <TouchableHighlight
          onPress={() => {
            if (state.routeName !== "History") {
              this.props.navigation.navigate("History");
            }
          }}
          underlayColor="#f2d9d9"
        >
          <View>
            <Icon name="history" color="#862d59" size={30} />
          </View>
        </TouchableHighlight>

        <TouchableHighlight
          onPress={() => {
            if (state.routeName !== "Profile") {
              this.props.navigation.navigate("Profile");
            }
          }}
          underlayColor="#f2d9d9"
        >
          <View>
            <Icon name="account-circle" color="#862d59" size={30} />
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  Navigation: {
    width: "100%",
    height: "5%",
    backgroundColor: "#f2d9d9",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  }
});
module.exports = NavigationBar;
