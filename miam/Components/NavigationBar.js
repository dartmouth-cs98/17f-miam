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
    return (
      <View style={styles.Navigation}>
        <TouchableHighlight
          onPress={() => this.props.navigation.navigate("Feed")}
          underlayColor="white"
        >
          <View>
            <Icon name="stars" color="#862d59" size={30} />
          </View>
        </TouchableHighlight>

        <TouchableHighlight
          onPress={() => this.props.navigation.navigate("Canvas")}
          underlayColor="white"
        >
          <View>
            <Icon name="control-point" color="#862d59" size={30} />
          </View>
        </TouchableHighlight>

        <TouchableHighlight
          onPress={() => this.props.navigation.navigate("Battle")}
          underlayColor="white"
        >
          <View>
            <Icon name="filter-vintage" color="#862d59" size={30} />
          </View>
        </TouchableHighlight>

        <TouchableHighlight
          onPress={() => this.props.navigation.navigate("Profile")}
          underlayColor="white"
        >
          <View>
            <Icon name="account-circle" color="#862d59" size={30} />
          </View>
        </TouchableHighlight>

        <TouchableHighlight
          onPress={() => this.props.navigation.navigate("BattleList")}
          underlayColor="white"
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
    backgroundColor: "#ffffff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  }
});
module.exports = NavigationBar;
