import React, { Component } from "react";

import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableHighlight,
  Alert
} from "react-native";

import { createBattle } from "../../api";

export default class CreateBattle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: ""
    };
    this.startBattle = this.startBattle.bind(this);
  }

  startBattle() {
    console.log(this.state.theme);
    createBattle(this.state.theme, this.props.token, (response, error) => {
      if (error) {
        console.log(error);
      } else {
        console.log(response.data.battle_id);
        Alert.alert("good");
      }
    });
  }

  render() {
    return (
      <View style={styles.textInput}>
        <TextInput
          style={{
            width: "75%",
            borderColor: "gray",
            borderWidth: 1,
            height: "100%"
          }}
          maxLength={50}
          onChangeText={text => this.setState({ theme: text })}
          value={this.state.topic}
          placeholder="theme"
        />
        <TouchableHighlight
          underlayColor="#d279a6"
          style={styles.startBattleButton}
          onPress={this.startBattle}
        >
          <Text
            style={{
              color: "#ffffff",
              textAlign: "center"
            }}
          >
            Start a Battle!
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}
module.exports = CreateBattle;

const styles = StyleSheet.create({
  textInput: {
    flexDirection: "row",
    height: "5%",
    marginTop: "1%",
    justifyContent: "flex-start"
  },
  startBattleButton: {
    backgroundColor: "#993333",
    height: "100%",
    width: "25%",
    justifyContent: "center"
  }
});
