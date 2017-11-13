import React from "react";

////////////////////////////////////////////////////////////////////
//                            _ooOoo_                             //
//                           o8888888o                            //
//                           88" . "88                            //
//                           (| ^_^ |)                            //
//                           O\  =  /O                            //
//                        ____/`---'\____                         //
//                      .'  \\|     |//  `.                       //
//                     /  \\|||  :  |||//  \                      //
//                    /  _||||| -:- |||||-  \                     //
//                    |   | \\\  -  /// |   |                     //
//                    | \_|  ''\---/''  |   |                     //
//                    \  .-\__  `-`  ___/-. /                     //
//                  ___`. .'  /--.--\  `. . ___                   //
//                ."" '<  `.___\_<|>_/___.'  >'"".                //
//              | | :  `- \`.;`\ _ /`;.`/ - ` : | |               //
//              \  \ `-.   \_ __\ /__ _/   .-` /  /               //
//        ========`-.____`-.___\_____/___.-`____.-'========       //
//                             `=---='                            //
//        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^      //
//                    Buddha Keeps Bugs Away                      //
//                    佛祖保佑         永无bug                      //
////////////////////////////////////////////////////////////////////

/* eslint-disable */

import { TabNavigator, StackNavigator } from "react-navigation";

import { StyleSheet, Text, View, Button } from "react-native";

import LogIn from "./Components/LogIn";
import SignUp from "./Components/SignUp";
import Splash from "./Components/Splash";
import Feed from "./Components/Feed";
import Canvas from "./Components/Canvas";
import BattleList from "./Components/Battles/BattleList";
import Profile from "./Components/Profile";
import Search from "./Components/Search";
// import MainFiveTabs from "./Components/MainFiveTabs";
const navBarMainColor = "#F4F5F9";
const navBarTintColor = "#6C56BA";
const accentColor = "#D0CCDF";
const mainColor = "#F4F5F9";
const tintColor = "#6C56BA";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F5F9"
  },
  welcome: {
    fontSize: 18,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});

export const AuthStack = StackNavigator(
  {
    Splash: {
      screen: Splash
    },
    LogIn: {
      screen: LogIn
    },
    SignUp: {
      screen: SignUp
    },
    Feed: {
      screen: Feed
    },
    Canvas: {
      screen: Canvas
    },
    BattleList: {
      screen: BattleList
    },
    Profile: {
      screen: Profile
    },
    Search: {
      screen: Search
    }
  },
  // MainFiveTabs: {
  //   screen: MainFiveTabs
  // },
  // CreatePost: {
  //   screen: CreatePost
  {
    navigationOptions: ({ navigation }) => ({
      gesturesEnabled: false,
      header: null,
      headerTintColor: mainColor,
      headerStyle: {
        backgroundColor: mainColor
      }
    })
  }
);

export const Root = StackNavigator(
  {
    Auth: {
      screen: AuthStack
    }
  },
  {
    mode: "modal",
    headerMode: "none"
  }
);
