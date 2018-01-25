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
  AsyncStorage
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import StatusBarColor from "../StatusBarColor";
import Heading from "../Heading";
import Button from "react-native-button";
import Battle from "./Battle";
import NavigationBar from "../NavigationBar";
import SearchProfile from "../SearchProfile";
import CreateBattle from "./CreateBattle";
import { fetchBattles } from "../../api";
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2 });
const vw = Dimensions.get("window").width;
import Pusher from "pusher-js/react-native";


// <SearchProfile
//            nav={this.props.navigation}
//            token={this.state.token}
//            myId={this.state.myId}

//          />

var mockData = require("../../mock_data/mockBattleData.json");

// Enable pusher logging - don't include this in production
// Pusher.logToConsole = true;


export default class BattleList extends React.Component {
  constructor(props) {
    super(props);

    var battleId = "";
    var params = this.props.navigation.state.params;
    if (params && params.battleId !== "") {
      battleId = params.battleId;
    }

    this.state = {
      battleDataSource: ds.cloneWithRows(mockData),
      loaded: false,
      selectedBattle: battleId,
      pusher: {},
      myId: "",
      token: "",
      headingTabSelected: "hot"
    };

    this.pusher = new Pusher("8bf10764c83bdb2f6afd", {
      cluster: "us2",
      encrypted: true
    });

    this.selectBattle = this.selectBattle.bind(this);
    this.returnToList = this.returnToList.bind(this);
  }

  async getMyId() {
    try {
      const userId = await AsyncStorage.getItem("@UserId:key");
      const token = await AsyncStorage.getItem("@Token:key");
      this.setState({
        myId: userId,
        token: token
      });
    } catch (error) {
      console.log(error);
    }
  }

  componentWillMount() {
    if (this.state.myId === "" || this.state.token === "") {
      this.getMyId().then(value => {
        fetchBattles((response, error) => {
          if (error) {
            console.log(error);
          } else {
            this.setState({
              battleDataSource: ds.cloneWithRows(response),
              loaded: true
            });
            console.log(this.state.battleDataSource);
          }
        });
      });
    }
  }

  selectBattle(battleId) {
    this.setState({
      selectedBattle: battleId
    });
  }
  newHeadingTabPress() {}

  hotHeadingTabPress() {}
  returnToList() {
    this.setState({
      selectedBattle: ""
    });
    this.props.navigation.state.params = {};
  }

  renderBattleRow(battle) {
    return (
      <View style={styles.battleContainer}>
        <View>
          <Text>Initiated by :{battle.initiatedBy.username}</Text>
        </View>
        <TouchableHighlight
          onPress={() => this.selectBattle(battle._id)}
          underlayColor="#732673"
        >
          <Text
            style={{
              color: "#ffffff",
              textAlign: "center",
              fontWeight: "bold"
            }}
          >
            JOIN
          </Text>
        </TouchableHighlight>
      </View>
    );
  }

  render() {
    if (this.state.selectedBattle === "") {
      return (
        <View style={styles.body}>
          <StatusBarColor />
          <Heading text="MEME Battles" />
          <CreateBattle token={this.state.token} />
          <View style={styles.headingTabBar}>
            <TouchableHighlight
              onPress={this.newHeadingTabPress.bind(this)}
              style={[
                styles.headingTabButton,
                this.state.headingTabSelected == "new" &&
                  styles.activeHeadingTabView
              ]}
              underlayColor="white"
            >
              <Text
                style={[
                  styles.headingTabText,
                  this.state.headingTabSelected == "new" &&
                    styles.activeHeadingTabText
                ]}
              >
                NEW
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={this.hotHeadingTabPress.bind(this)}
              style={[
                styles.headingTabButton,
                this.state.headingTabSelected == "hot" &&
                  styles.activeHeadingTabView
              ]}
              underlayColor="white"
            >
              <Text
                style={[
                  styles.headingTabText,
                  this.state.headingTabSelected == "hot" &&
                    styles.activeHeadingTabText
                ]}
              >
                HOT
              </Text>
            </TouchableHighlight>
          </View>
          <ScrollView>
            {this.state.battleDataSource.getRowCount() !== 0 && (
              <ListView
                contentContainerStyle={styles.battlelist}
                initialListSize={5}
                enableEmptySections={true}
                dataSource={this.state.battleDataSource}
                renderRow={battle => {
                  return this.renderBattleRow(battle);
                }}
              />
            )}
            {this.state.battleDataSource.getRowCount() === 0 && (
              <View>
                <Text
                  style={{
                    color: "#000000",
                    textAlign: "center",
                    fontWeight: "bold"
                  }}
                >
                  Oh no!! Nothing here yet...
                </Text>
                <Text
                  style={{
                    color: "#000000",
                    textAlign: "center",
                    fontWeight: "bold"
                  }}
                >
                  Initiate a battle yourself!
                </Text>
                <View style={styles.meme}>
                  <Image
                    source={{
                      uri:
                        "https://media.giphy.com/media/X0QKGRNCxnwWs/giphy.gif"
                    }}
                    style={styles.imagePreview}
                    resizeMode="contain"
                    ref={ref => (this.meme = ref)}
                  />
                </View>
              </View>
            )}
          </ScrollView>

          <NavigationBar navigation={this.props.navigation} />
        </View>
      );
    } else if (this.state.token && this.state.myId) {
      return (
        <View style={styles.body}>
          <Battle
            battleId={this.state.selectedBattle}
            returnToList={this.returnToList}
            pusher={this.pusher}
            navigation={this.props.navigation}
            myId={this.state.myId}
            token={this.state.token}
          />
        </View>
      );
    } else {
      return <View />;
    }
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1
  },
  battlelist: {
    alignItems: "center",
    marginLeft: "2%",
    marginRight: "2%",
    paddingTop: "3%",
    paddingHorizontal: "2%",
    backgroundColor: "#eee6ff",
    borderColor: "#5c5c8a",
    borderRadius: 0.5,
    borderWidth: 2
  },
  battleContainer: {
    borderColor: "#000000",
    flexDirection: "column",
    width: 0.9 * vw,
    borderRadius: 3,
    shadowColor: "#291D56",
    shadowOffset: { height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginTop: "2%",
    flexDirection: "column",
    paddingBottom: "1%"
  },
  iconContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start"
  },
  userIconStyle: {
    borderRadius: 15,
    width: 30,
    height: 30,
    marginLeft: "2%"
  },
  separatorLine: {
    height: 1,
    backgroundColor: "#ecc6ec"
  },
  contenders: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  headingTabBar: {
    width: "50%",
    height: 28,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignSelf: "center",
    margin: "3%"
  },
  headingTabButton: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center"
  },
  headingTabText: {
    height: "100%",
    alignSelf: "center",
    fontWeight: "bold",
    backgroundColor: "#00000000",
    top: "18%"
  },
  activeHeadingTabView: {
    backgroundColor: "#886BEA"
  },
  activeHeadingTabText: {
    color: "white"
  },
  imagePreview: {
    width: 300,
    height: 200,
    marginTop: "10%",
    alignSelf: "center",
    shadowOpacity: 0.3,
    shadowRadius: 3
  }
});

module.exports = BattleList;
