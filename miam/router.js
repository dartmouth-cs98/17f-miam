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
import MainFiveTabs from "./Components/MainFiveTabs";
import Splash from './Components/Splash';

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
  Splash: {
    screen: Splash
  },
  LogIn: {
    screen: LogIn
  },
  SignUp: {
    screen: SignUp
  },
  MainFiveTabs: {
    screen: MainFiveTabs
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


export const Root = StackNavigator({
  Auth: {
    screen: AuthStack,
  },
}, {
  mode: 'modal',
  headerMode: 'none',
})