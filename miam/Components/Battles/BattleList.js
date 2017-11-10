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
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2 });
const vw = Dimensions.get("window").width;
import Pusher from 'pusher-js/react-native';

// Enable pusher logging - don't include this in production
// Pusher.logToConsole = true;

export default class BattleList extends React.Component {
  constructor(props) {
    super(props);

    var battleId = '';
    var params = this.props.navigation.state.params;
    if (params && params.battleId !== '') {
      battleId = params.battleId;
    }

    this.state = {
      battleDataSource: ds.cloneWithRows([]),
      loaded: false,
      selectedBattle: battleId,
      pusher: {}
    };

    this.pusher = new Pusher('8bf10764c83bdb2f6afd', {
      cluster: 'us2',
      encrypted: true
    });

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
          <Text style={{ fontSize: 20, marginLeft: "5%"}}>
            {battle.participant1.username} VS. {battle.participant2.username}
          </Text>
          <TouchableHighlight
            onPress={() => this.selectBattle(battle._id)}
            style={styles.joinButton}>
            <Text style={{color: 'white'}}>JOIN</Text>
          </TouchableHighlight>
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
          <Battle battleId={this.state.selectedBattle} returnToList={this.returnToList} pusher={this.pusher} navigation={this.props.navigation}/>
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
    paddingBottom: "1%",
    alignItems: 'center'
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
  joinButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    margin: 10,
    borderRadius: 5,
    backgroundColor: '#66db30',
    height: 30,
  },
});

module.exports = BattleList;
