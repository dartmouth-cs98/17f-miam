import React, { Component } from "react";

import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
  ListView,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Button,
  TextInput,
  AsyncStorage
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import StatusBarColor from './StatusBarColor';
import Heading from './Heading';
import NavigationBar from "./NavigationBar";
import SearchProfile from "./SearchProfile";
import { getTargetUserProfile } from '../api';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2 });
const vw = Dimensions.get("window").width;

export default class SearchProfileList extends React.Component {
  constructor(props) {
    super(props);

    this.ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})

    this.state = {
      profileList: ds.cloneWithRows([]),
    }
  }

  componentDidMount() {
    if (this.props.navigation.state.params) {
      var lists = this.props.navigation.state.params.profileList;
      this.setState({ profileList: ds.cloneWithRows(lists) });
    }
  }

  componentDidUpdate() {
  }

  componentWillMount() {
  }

  renderProfile(profile) {
    return (
      <View style={styles.postContainer}>
        <Text>{profile.email}</Text>
      </View>
    );
  }

  renderHeadingTabs(){
    return (
      <View style={styles.headingTabBar}>
        <Text>Users: </Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.body}>
        <StatusBarColor/>
        <Heading text="MEME Battles"/>
        <SearchProfile />
        <ScrollView>
          <ListView
            initialListSize={5}
            enableEmptySections={true}
            dataSource={this.state.profileList}
            contentContainerStyle={styles.listView}
            renderHeader={() => this.renderHeadingTabs()}
            renderRow={profile => {
              return this.renderProfile(profile);
            }}
          />
        </ScrollView>
        <NavigationBar navigation={this.props.navigation} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  separatorLine: {
    height: 1,
    backgroundColor: "#ecc6ec"
  },
  postContainer: {
    backgroundColor: "#ffffff",
    borderColor: "#000000",
    flexDirection: "column",
    width: 0.9 * vw,
    height: 10,
    margin: 7,
    borderRadius: 10,
    shadowColor: "#291D56",
    shadowOffset: { height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3
  },
});

module.exports = SearchProfileList;
