import React, { Component } from "react";
import { AsyncStorage, Image } from "react-native";

class Splash extends Component {
  constructor(props) {
    super(props);

    this.retrieveToken = this.retrieveToken.bind(this);
  }

  async retrieveToken() {
    try {
      let savedToken = await AsyncStorage.getItem("@Token:key");
      if (savedToken === null) {
        this.props.navigation.navigate("LogIn");
      } else {
        this.props.navigation.navigate("Feed");
        console.log(savedToken);
      }
    } catch (error) {
      console.log(error);
    }
  }

  componentWillMount() {
    this.retrieveToken();
  }

  render() {
    return (
      <Image
        source={{
          uri:
            "http://i0.kym-cdn.com/photos/images/newsfeed/000/284/742/7e2.png"
        }}
      />
    );
  }
}

export default Splash;
