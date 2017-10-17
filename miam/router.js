import React from 'react';

/* eslint-disable */

import { TabNavigator, StackNavigator } from 'react-navigation';

import {
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';


import LogIn from './Components/LogIn';
import SignUp from './Components/SignUp';

const navBarMainColor='#F4F5F9';
const navBarTintColor='#6C56BA';
const accentColor='#D0CCDF';
const mainColor='#F4F5F9';
const tintColor='#6C56BA';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F5F9',
  },
  welcome: {
    fontSize: 18,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});


export const AuthStack = StackNavigator({
  LogIn: {
    screen: LogIn
  },
  SignUp: {
    screen: SignUp
  }
}, {
  navigationOptions: ({ navigation }) => ({
    gesturesEnabled: false,
    header: null,
    headerTintColor: mainColor,
    headerStyle: {
      backgroundColor: mainColor,
    },
  })
})


export const AuthRoot = StackNavigator({
  Auth: {
    screen: AuthStack,
  },
}, {
  mode: 'modal',
  headerMode: 'none',
})
