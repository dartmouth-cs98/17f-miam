// component for signup page

import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Button, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const vw = Dimensions.get('window').width;

class LogIn extends React.Component {

  onPress(navigation) {
    console.log('Hello');
    // this.props.navigation.navigate('Feed');
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logo}>
          <Image
            style={styles.logoImg}
            source={{uri:'https://i.imgur.com/fdh8TNp.png'}}
          />
          <Text style={styles.logoFont}> MIAM </Text>
        </View>
        <TextInput placeholder='Username' />
        <TextInput placeholder='Password' />
        <View style={styles.buttonArea}>
          <Button
            containerStyle={{padding:10, width:vw * 0.7, height:50, overflow:'hidden', borderRadius:25, backgroundColor: '#6C56BA'}}
            style={styles.button}
            onPress={this.onPress.bind(this)}
            title="LOGIN">
          </Button>
          <Button
            containerStyle={{padding:10, width:vw * 0.7, height:50, overflow:'hidden', borderRadius:25, backgroundColor: '#6C56BA'}}
            style={styles.button}
            onPress={this.onPress.bind(this)}
            title="SIGN IN">
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
});

export default LogIn;
