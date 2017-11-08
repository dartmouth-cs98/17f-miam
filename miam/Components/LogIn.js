import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Button, TextInput, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { signInUser, getUserProfile } from '../api';

const vw = Dimensions.get('window').width;

class LogIn extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };

    this.onLogIn = this.onLogIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.saveLogin = this.saveLogin.bind(this);
  }

  async saveLogin(token, userId) {
    try {
      await AsyncStorage.setItem('@Token:key', token);
      this.props.navigation.navigate('Feed');
    } catch (error) {
      console.log(`Cannot save login. ${error}`);
    }
  }

  onLogIn(e) {
    e.preventDefault();

    if (this.state.email !== '' && this.state.password !== '') {
      signInUser(this.state.email, this.state.password, (response, error) => {
        if (error) {
          alert('Either username or password is incorrect');
        } else {
          this.saveLogin(response.data.token);
        }
      });
    } else {
      alert('Please sign in with valid email and password');
    }
  }

  onSignUp() {
    this.props.navigation.navigate('SignUp');
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logo}>
          <Image
            style={styles.logoImg}
            source={{uri:'http://i0.kym-cdn.com/photos/images/newsfeed/000/284/742/7e2.png'}}
          />
          <Text style={styles.logoFont}> MIAM </Text>
        </View>
        <Text style={styles.instructions}> Enter your email and password to login</Text>
        <View style={styles.numArea}>
          <TextInput onChangeText={(email) => this.setState({email})}
            placeholder='Email'
            value={this.state.email}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.textArea} />
          <TextInput onChangeText={(password) => this.setState({password})}
            secureTextEntry={true}
            placeholder='Password'
            value={this.state.password}
            autoCapitalize="none"
            style={styles.textArea} />
        </View>
        <View style={styles.buttonArea}>
          <Button
            containerStyle={{padding:10, width:vw * 0.7, height:50, overflow:'hidden', borderRadius:25, backgroundColor: '#6C56BA'}}
            style={styles.button}
            onPress={this.onLogIn}
            title="LOGIN">
          </Button>
          <Button
            containerStyle={{padding:10, width:vw * 0.7, height:50, overflow:'hidden', borderRadius:25, backgroundColor: '#6C56BA'}}
            style={styles.button}
            onPress={this.onSignUp}
            title="SIGN UP">
          </Button>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F5F9',
  },
  logo: {
    flex: 0.7,
    justifyContent: 'flex-end'
  },
  logoImg: {
    width: vw * 0.6,
    height: vw * 0.4,
    resizeMode: 'contain',
    shadowColor: '#291D56',
    shadowOffset: {height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 3
  },
  logoFont: {
    fontSize: 45,
    fontFamily: 'Gill Sans',
    color: '#372769',
    textAlign: 'center',
    margin: 20,
    marginBottom: 50,
  },
  buttonArea: {
    flex: 0.3
  },
  button: {
    fontSize: 20,
    letterSpacing: 1,
    fontFamily: 'Futura',
    color: '#FFFFFF',
  },
  instructions: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Gill Sans',
    color: '#9C8FC4',
    marginBottom: 5,
  },
  numArea: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    margin: 15
  },
  textArea: {
    fontFamily: 'Gill Sans',
    color: '#372769',
    height: 40,
    width: vw*0.6,
    padding: 5,
    borderColor: '#9C8FC4',
    borderWidth: 0.5
  },
});

export default LogIn;
