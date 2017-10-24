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
  TextInput
} from "react-native";
import { SearchBar } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2 });
const vw = Dimensions.get("window").width;
const apiUrl = "http://api.giphy.com/v1/gifs/search?";
const apiKey = "7oHJC3R9iIXrbyCdYSjDWfkU3JTDGERx";
const limit = "10";

export default class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      text: ""
    };
    this.fetchData = this.fetchData.bind(this);
  }
  fetchData() {
    var query =
      apiUrl +
      "q=" +
      this.state.text +
      "&api_key=" +
      apiKey +
      "&limit=" +
      limit;
    return fetch(query)
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
        <TextInput
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
          onChangeText={text => this.setState({ text })}
          placeholder="Search Memes"
          value={this.state.text}
          onSubmitEditing={this.fetch}
        />
        <TouchableHighlight onPress={this.fetchData}>
          <Text>Press this button to submit editing</Text>
        </TouchableHighlight>
        <View>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={rowData => (
              <Image
                source={{ uri: rowData.images.original.url }}
                style={styles.memeStyle}
                resizeMode="contain"
              />
            )}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  memeStyle: {
    width: 300,
    height: 200
  }
});
module.exports = Canvas;
