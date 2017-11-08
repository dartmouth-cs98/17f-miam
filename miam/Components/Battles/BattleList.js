import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
  ListView,
  ScrollView,
  Dimensions
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import StatusBarColor from '../StatusBarColor';
import Heading from '../Heading';
import Button from 'react-native-button';
import Battle from './Battle';
import NavigationBar from "../NavigationBar";
import { fetchBattles } from "../../api";

var mockBattleData = require("../../data/mockBattleData.json");
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2 });
const vw = Dimensions.get("window").width;

export default class BattleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      battleDataSource: ds.cloneWithRows([]),
      loaded: false,
      selectedBattle: ""
    };

    this.selectBattle = this.selectBattle.bind(this);
    this.returnToList = this.returnToList.bind(this);
  }

  componentWillMount() {
    fetchBattles((response, error) => {
      if (error) {
        console.log(error);
      } else {
        this.setState({
          battleDataSource: ds.cloneWithRows(response),
          loaded: true
        });
      }
    })
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
  }

  renderBattleRow(battle) {
    return (
      <View style={styles.battleContainer}>
        <View style={styles.battleContentContainer}>
          <Text style={{ fontSize: 20, marginLeft: "5%", marginTop: "3%" }}>
            {battle.participant1.username} VS. {battle.participant2.username}
          </Text>
          <Button
            containerStyle={styles.buttonContainer}
            style={styles.messageButton}
            styleDisabled={{color: 'red'}}
            onPress={() => this.selectBattle(battle._id)}>
            JOIN
          </Button>
        </View>
      </View>
    );
  }

  render() {
    if (this.state.selectedBattle === "") {
      return (
        <View style={styles.body}>
          <StatusBarColor/>
          <Heading text="MEME Battles"/>
          <ScrollView>
            <ListView
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
    } else {
      return (
        <View style={styles.body}>
          <Battle battleId={this.state.selectedBattle} returnToList={this.returnToList} />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  battleContainer: {
    backgroundColor: "#ffffff",
    borderColor: "#000000",
    flexDirection: "column",
    width: 0.9 * vw,
    margin: 13,
    borderRadius: 10,
    shadowColor: "#291D56",
    shadowOffset: { height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    padding: 10
  },
  battleContentContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
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
  buttonContainer: {
    height:35,
    width: 50,
    overflow:'hidden',
    borderRadius:20,
    backgroundColor: 'yellow',
    justifyContent: "center"
  },
  messageButton: {
    fontSize: 15,
    color: 'black',
  },
});

module.exports = BattleList;
