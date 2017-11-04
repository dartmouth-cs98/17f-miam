import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Button, TextInput, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import StatusBarColor from './StatusBarColor';
import Heading from './Heading';

const vw = Dimensions.get('window').width;

class DummySignOut extends React.Component {

  constructor(props) {
    super(props);
    this.navigation = props.navigation;

    this.signOut = this.signOut.bind(this);
  }

  // TODO: SIGN OUT HERE
  async signOut(){
    try {
      await AsyncStorage.removeItem('@Token:key');
      console.log('Successfully log out');
      this.navigation.navigate('LogIn');
    } catch (error) {
      console.log(`Cannot log out. ${error}`);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBarColor/>
        <Heading text="MiAM DummySignOut"/>
        <View style={styles.goBackContainer}>
          <Button
            style={styles.backButton}
            onPress={this.signOut}
            title="SIGN OUT">
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F4F5F9',
  },
  goBackContainer: {
    marginTop: vw * 0.1,
    flex: 0.1
  },
  logo: {
    flex: 0.5,
    justifyContent: 'flex-start'
  },
  logoImg: {
    width: vw * 0.5,
    height: vw * 0.32,
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
  backButton:{

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

export default DummySignOut;
