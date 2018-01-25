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
import { fetchBattles } from "../../api";
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2 });
const vw = Dimensions.get("window").width;
import Pusher from "pusher-js/react-native";

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
      myId: '',
      token: ''
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
      const userId = await AsyncStorage.getItem('@UserId:key');
      const token = await AsyncStorage.getItem('@Token:key');
      this.setState({
        myId: userId,
        token: token
      });
    } catch (error) {
      console.log(error);
    }
  }

  componentWillMount() {
    if (this.state.myId === '' || this.state.token === '') {
      this.getMyId().
      then((value) => {
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

  returnToList() {
    this.setState({
      selectedBattle: ""
    });
    this.props.navigation.state.params = {};
  }

  renderBattleRow(battle) {
    return (
      <View style={styles.battleContainer}>
        <View style={styles.contenders}>
          <Text style={{ fontSize: 20, color: "#ffffff" }}>
            {battle.participant1.username}
          </Text>
          <View style={{ alignSelf: "center" }}>
            <Icon name="toys" color="#ffffff" size={40} />
          </View>
          <View style={{ alignSelf: "flex-end" }}>
            <Text style={{ fontSize: 20, color: "#ffffff" }}>
              {battle.participant2.username}
            </Text>
          </View>
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
          <SearchProfile
            nav={this.props.navigation}
            token={this.state.token}
            myId={this.state.myId}/>
          <ScrollView>
            <ListView
              contentContainerStyle={styles.battlelist}
              initialListSize={5}
              enableEmptySections={true}
              dataSource={this.state.battleDataSource}
              renderRow={battle => {
                return this.renderBattleRow(battle);
              }}
            />
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
      return <View/>;
    }
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#5c5c8a"
  },
  battlelist: {
    alignItems: "center"
  },
  battleContainer: {
    backgroundColor: "#732673",
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
  }
});

module.exports = BattleList;
