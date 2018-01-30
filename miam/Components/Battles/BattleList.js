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
  AsyncStorage,
  TextInput,
  Alert
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import StatusBarColor from "../StatusBarColor";
import Heading from "../Heading";
import Button from "react-native-button";
import Battle from "./Battle";
import NavigationBar from "../NavigationBar";
import SearchProfile from "../SearchProfile";
import { fetchBattles, createBattle } from "../../api";
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2 });
const vw = Dimensions.get("window").width;
import Pusher from "pusher-js/react-native";

import moment from "moment";
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
      battleDataSource: ds.cloneWithRows([]),
      loaded: false,
      selectedBattle: battleId,
      pusher: {},
      myId: "",
      token: "",
      headingTabSelected: "hot",
      theme: ""
    };

    this.pusher = new Pusher("8bf10764c83bdb2f6afd", {
      cluster: "us2",
      encrypted: true
    });

    this.selectBattle = this.selectBattle.bind(this);
    this.returnToList = this.returnToList.bind(this);
    this.startBattle = this.startBattle.bind(this);
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
  startBattle() {
    createBattle(this.state.theme, this.state.token, (response, error) => {
      if (error) {
        console.log(error);
      } else {
        Alert.alert("Battle successfully created!");
        fetchBattles((response, error) => {
          if (error) {
            console.log(error);
          } else {
            this.setState({
              battleDataSource: ds.cloneWithRows(response),
              loaded: true,
              theme: ""
            });
          }
        });
      }
    });
  }
  renderBattleRow(battle) {
    const time = moment(battle.startTime).fromNow();
    console.log(this.state.battleDataSource);
    return (
      <View style={styles.battleContainer}>
        <View>
          <View>
            <Text
              style={{ fontSize: 12, color: "#000000", fontWeight: "bold" }}
            >
              Challenger:{battle.initiatedBy.username}
            </Text>
          </View>
          <View>
            <View>
              <Text
                style={{
                  textAlign: "center",
                  color: "#000000",
                  fontSize: 15,
                  fontWeight: "bold"
                }}
              >
                {battle.theme}
              </Text>
            </View>
            <TouchableHighlight
              onPress={() => this.selectBattle(battle._id)}
              underlayColor="#732673"
            >
              <Text
                style={{
                  color: "#bf4080",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 12
                }}
              >
                JOIN
              </Text>
            </TouchableHighlight>
          </View>
          <View style={styles.battleInfoContainer}>
            <View>
              <Text style={{ fontSize: 10, color: "#000000" }}>{time}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 10, color: "#000000" }}>
                Participants Number: {battle.participants.length}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  render() {
    if (this.state.selectedBattle === "") {
      return (
        <View style={styles.body}>
          <StatusBarColor />
          <Heading text="MEME Battles" />
          <View style={styles.textInput}>
            <TextInput
              style={{
                width: "75%",
                borderColor: "gray",
                borderWidth: 1,
                height: "100%"
              }}
              maxLength={50}
              onChangeText={text => this.setState({ theme: text })}
              value={this.state.theme}
              placeholder="theme"
            />
            <TouchableHighlight
              underlayColor="#d279a6"
              style={styles.startBattleButton}
              onPress={this.startBattle}
            >
              <Text
                style={{
                  color: "#ffffff",
                  textAlign: "center"
                }}
              >
                Start a Battle!
              </Text>
            </TouchableHighlight>
          </View>
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
    paddingHorizontal: "2%",
    backgroundColor: "#d98cb3",
    borderColor: "#5c5c8a",
    borderRadius: 0.5,
    borderWidth: 2,
    paddingTop: "1%",
    paddingBottom: "2%"
  },
  battleContainer: {
    borderColor: "#000000",
    backgroundColor: "#eee6ff",
    flexDirection: "column",
    width: 0.9 * vw,
    borderRadius: 2,
    shadowColor: "#291D56",
    shadowOffset: { height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginTop: "1%",
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
  },
  battleInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  textInput: {
    flexDirection: "row",
    height: "5%",
    marginTop: "1%",
    justifyContent: "flex-start"
  },
  startBattleButton: {
    backgroundColor: "#993333",
    height: "100%",
    width: "25%",
    justifyContent: "center"
  }
});

module.exports = BattleList;
