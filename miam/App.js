import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feed } from "./Components/Feed";
export default class App extends React.Component {
  render() {
    return (
      <View style={styles.body}>
        <View style={styles.heading}>
          <Text style={styles.logo}>MiAM</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  heading: {
    height: "10%",
    width: "100%",
    backgroundColor: "#886BEA",
    justifyContent: "center"
  },
  logo: {
    color: "#ffffff",
    fontSize: 40,
    textAlign: "center"
  }
});
