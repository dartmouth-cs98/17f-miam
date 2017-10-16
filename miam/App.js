import React from "react";
import { StyleSheet, Text, View } from "react-native";

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
    alignItems: "flex-start",
    width: "100%",
    backgroundColor: "#886BEA"
  },
  logo: {
    color: "#ffffff",
    fontSize: 50,
    alignItems: "center"
  }
});
