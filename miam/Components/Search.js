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
  TextInput
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import SwitchSelector from 'react-native-switch-selector';
import StatusBarColor from "./StatusBarColor";
import Heading from "./Heading";
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2 });
const vw = Dimensions.get("window").width;
const apiUrl = ["http://api.giphy.com/v1/", "/search?"];
const apiKey = "7oHJC3R9iIXrbyCdYSjDWfkU3JTDGERx";
const limit = "30";

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      text: "",
      mode: "gifs"
    };

    this.gifOptions = [
      { label: 'Gifs', value: 'gifs' },
      { label: 'Stickers', value: 'stickers' }
    ];

    this.fetchTrending = this.fetchTrending.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.selectMeme = this.selectMeme.bind(this);
    this.renderHeaderTab = this.renderHeaderTab.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.tabSwitch = this.tabSwitch.bind(this);
  }

  fetchData(offset = 0) {
    if (this.state.text === "") {
      return this.fetchTrending();
    }
    var query =
      apiUrl[0] +
      this.state.mode +
      apiUrl[1] +
      "q=" +
      this.state.text +
      "&api_key=" +
      apiKey +
      "&limit=" +
      limit;
    return fetch(query)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.data.length === 0) {
          alert("Unable to find results");
          return;
        }
        let ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.setState({
          isLoading: false,
          dataSource: ds.cloneWithRows(responseJson.data)
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  componentDidMount() {
    return this.fetchTrending();
  }

  fetchTrending() {
    return fetch(
      "http://api.giphy.com/v1/" + this.state.mode + "/trending?api_key=7oHJC3R9iIXrbyCdYSjDWfkU3JTDGERx"
    )
      .then(response => response.json())
      .then(responseJson => {
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

  tabSwitch(mode){
    this.setState({ mode: mode }, () => this.fetchData());
  }

  selectMeme(url) {
    var params = this.props.navigation.state.params;

    if (params && params.source === "battle") {
      this.props.navigation.navigate("BattleList", {
        gifUrl: url,
        battleId: params.battleId
      });
    } else {
      params.sendImgURLBack(url);
      this.props.navigation.goBack();
      // this.props.navigation.navigate("Canvas", { gifurl: url });
    }
  }

  renderHeaderTab(){
    return (
      <View style={styles.tabHeading}>
        <SwitchSelector options={this.gifOptions} 
          initial={0} 
          fontSize={18}
          buttonColor={"#8A2BE2"}
          backgroundColor={"#ffffff00"}
          onPress={(value) => this.tabSwitch(value)}
        />
      </View>
    );
  }

  renderRow(rowData) {
    return (
      <View style={styles.memeContainer}>
        <Image
          source={{ uri: rowData.images.original.url }}
          style={styles.memeStyle}
          resizeMode="contain"
        />
        <Button
          onPress={() => this.selectMeme(rowData.images.original.url)}
          title="select"
          color="#841584"
        />
      </View>
    );
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
          <Text>Loading...</Text>
        </View>
      );
    }
    return (
      <View>
        <StatusBarColor />
        <Heading
          text="Miam"
          backButtonVisible={true}
          nav={this.props.navigation}
        />

        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchBar}
            onChangeText={text => this.setState({ text })}
            placeholder="Search Memes"
            value={this.state.text}
            onSubmitEditing={this.fetch}
          />
          <TouchableHighlight
            underlayColor="#d279a6"
            style={styles.searchBarButton}
            onPress={this.fetchData}
          >
            <Text
              style={{
                color: "#ffffff",
                textAlign: "center"
              }}
            >
              Go
            </Text>
          </TouchableHighlight>
        </View>

        <View>
          <ListView
            dataSource={this.state.dataSource}
            enableEmptySections={true}
            renderHeader={this.renderHeaderTab}
            renderRow={rowData => {
              return this.renderRow(rowData);
            }}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  memeStyle: {
    width: 300,
    height: 200,
    marginTop: "1%"
  },
  searchBarContainer: {
    height: "5%",
    flexDirection: "row",
    margin: 2
  },
  headingContainer: {
    flexDirection: "row"
  },
  heading: {
    height: "8%",
    width: "100%",
    backgroundColor: "#bf80ff",
    justifyContent: "center"
  },
  logo: {
    color: "#ffffff",
    fontSize: 40,
    textAlign: "center"
  },
  searchBar: {
    borderWidth: 3,
    width: "85%",
    backgroundColor: "#f2d9e6",
    borderColor: "#d279a6"
  },
  searchBarButton: {
    backgroundColor: "#993366",
    height: "100%",
    width: "15%",
    justifyContent: "center"
  },
  memeContainer: {
    borderWidth: 1,
    borderRadius: 3,
    borderColor: "#d699ff",
    alignItems: "center",
    margin: 7,
    borderRadius: 10,
    shadowColor: "#291D56",
    shadowOffset: { height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3
  },
  tabHeading: {
    marginHorizontal: 60, 
    marginVertical: 3, 
    padding: 2,
    transform:[{scale: 0.8}], 
    borderColor: "#8A2BE2",
    borderWidth: 1,
    borderRadius: 100,
    backgroundColor: "#D8BFD8",
  }
});
module.exports = Search;
