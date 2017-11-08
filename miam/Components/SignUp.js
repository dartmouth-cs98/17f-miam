import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Button,
  TextInput,
  AsyncStorage
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import { signUpUser, getUserProfile } from "../api";

const vw = Dimensions.get("window").width;

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      username: ""
    };

    this.goToLogIn = this.goToLogIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.saveSignUp = this.saveSignUp.bind(this);
  }


  async saveSignUp(token) {
    try {
      await AsyncStorage.setItem("@Token:key", token);
      this.props.navigation.navigate("Feed");
    } catch (error) {
      console.log(`Cannot save signup. ${error}`);
    }
  }

  onSignUp(e) {
    e.preventDefault();

    if (this.state.email !== "" && this.state.password !== "") {
      signUpUser(this.state.email, this.state.password, this.state.username, (response, error) => {
        if (error) {
          console.log(error);
        } else {
          this.saveSignUp(response.data.token);
        }
      });
    } else {
      alert("Please sign up with valid email and password");
    }
  }

  goToLogIn() {
    this.props.navigation.goBack();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.goBackContainer}>
          <Button
            style={styles.backButton}
            onPress={this.goToLogIn}
            title="Go Back to LogIn Screen"
          />
        </View>
        <View style={styles.logo}>
          <Image
            style={styles.logoImg}
            source={{
              uri:
                "https://orig00.deviantart.net/ed01/f/2012/208/d/4/meme_yao_ming_png_by_mfsyrcm-d58vitj.png"
            }}
          />
          <Text style={styles.logoFont}> MIAM </Text>
        </View>
        <Text style={styles.instructions}>
          {" "}
          Enter your email and password to signup
        </Text>
        <View style={styles.numArea}>
          <TextInput
            onChangeText={username => this.setState({ username })}
            placeholder="Username"
            value={this.state.username}
            autoCapitalize="none"
            style={styles.textArea}
          />
          <TextInput
            onChangeText={email => this.setState({ email })}
            placeholder="Email"
            value={this.state.email}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.textArea}
          />
          <TextInput
            onChangeText={password => this.setState({ password })}
            placeholder="Password"
            secureTextEntry={true}
            value={this.state.password}
            autoCapitalize="none"
            style={styles.textArea}
          />
        </View>
        <View style={styles.buttonArea}>
          <Button
            containerStyle={{
              padding: 10,
              width: vw * 0.7,
              height: 50,
              overflow: "hidden",
              borderRadius: 25,
              backgroundColor: "#6C56BA"
            }}
            style={styles.button}
            onPress={this.onSignUp}
            title="SIGN ME UP!"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#F4F5F9"
  },
  goBackContainer: {
    marginTop: vw * 0.1,
    flex: 0.1
  },
  logo: {
    flex: 0.5,
    justifyContent: "flex-start"
  },
  logoImg: {
    width: vw * 0.5,
    height: vw * 0.32,
    resizeMode: "contain",
    shadowColor: "#291D56",
    shadowOffset: { height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3
  },
  logoFont: {
    fontSize: 45,
    fontFamily: "Gill Sans",
    color: "#372769",
    textAlign: "center",
    margin: 20,
    marginBottom: 50
  },
  backButton: {},
  buttonArea: {
    flex: 0.3
  },
  button: {
    fontSize: 20,
    letterSpacing: 1,
    fontFamily: "Futura",
    color: "#FFFFFF"
  },
  instructions: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Gill Sans",
    color: "#9C8FC4",
    marginBottom: 5
  },
  numArea: {
    flexDirection: "column",
    alignItems: "flex-start",
    margin: 15
  },
  textArea: {
    fontFamily: "Gill Sans",
    color: "#372769",
    height: 40,
    width: vw * 0.6,
    padding: 5,
    borderColor: "#9C8FC4",
    borderWidth: 0.5
  }
});

export default SignUp;
