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
  ActivityIndicator
} from "react-native";
import { SearchBar } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2 });
const vw = Dimensions.get("window").width;

export default class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }
  componentDidMount() {
    return fetch(
      "http://api.giphy.com/v1/gifs/search?q=ryan+gosling&api_key=7oHJC3R9iIXrbyCdYSjDWfkU3JTDGERx&limit=5"
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        let ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.setState({
          isLoading: false,
          dataSource: ds.cloneWithRows(responseJson.data)
        });
      })
      .catch(error => {
        console.error(error);
      });
  }
  search(text) {}
  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
          <Text>abs</Text>
        </View>
      );
    }
    return (
      <View>
        <View>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={rowData => <Text>{rowData.url}</Text>}
          />
        </View>
      </View>
    );
  }
}

module.exports = Canvas;
