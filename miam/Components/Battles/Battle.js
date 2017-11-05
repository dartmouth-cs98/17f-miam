import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TextInput, ListView, ScrollView, AsyncStorage} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const vw = Dimensions.get('window').width;
var mockMessages = require("../../data/mockMessages.json");
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2 });
import StatusBarColor from "../StatusBarColor";
import Heading from "../Heading";
import Button from 'react-native-button';
import { getBattle, sendMessage } from "../../api";

class Battle extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      msgDataSource: ds.cloneWithRows(mockMessages),
      text: '',
      meme: '',
      myId: '',
      token: '',
      participating: false
    };

    this.sendMsg = this.sendMsg.bind(this);
    this.fetchBattle = this.fetchBattle.bind(this);
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

  fetchBattle() {
    getBattle(this.props.battleId, (response, error) => {
      if (error) {
        console.log(error);
      } else {
        console.log(response);
        this.setState({
          msgDataSource: ds.cloneWithRows(response.messages),
        });
        if (this.state.myId === response.participant1._id || this.state.myId === response.participant2._id) {
          this.setState({
            participating: true
          });
        } else {
          this.setState({
            participating: false
          });
        }
      }
    });
  }

  componentWillMount() {
    if (this.state.myId === '') {
      this.getMyId();
    }
    this.fetchBattle();
  }

  sendMsg() {
    let msg = {
      "text" : this.state.text,
      "meme" : this.state.meme,
    };
    sendMessage(this.props.battleId, this.state.token, msg, (response, error) => {
      if (error) {
        console.log(error);
      } else {
        console.log(response);
        this.setState({
          text: '',
          meme: ''
        });
        this.fetchBattle();
      }
    });
  }

  renderMsgRow(msg) {
    console.log(this.state.myId);
    if (msg.sender === this.state.myId) {
      return (
        <View style={styles.msgSent}>
          <Text style={{ fontSize: 20, marginLeft: "5%", marginTop: "3%" }}>
            {msg.text}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.msgReceived}>
          <Text style={{ fontSize: 20, marginLeft: "5%", marginTop: "3%" }}>
            {msg.text}
          </Text>
        </View>
      )
    }
  }

  render() {
    if (this.state.participating) {
      return (
        <View style={styles.body}>
          <StatusBarColor/>
          <Heading text="BATTLE TIME!"/>
          <Button
            onPress={() => this.props.returnToList()}>
            Back
          </Button>
          <ScrollView>
            <ListView
              initialListSize={5}
              enableEmptySections={true}
              dataSource={this.state.msgDataSource}
              renderRow={msg => {
                return this.renderMsgRow(msg);
              }}
            />
          </ScrollView>
          <TextInput onChangeText={(text) => this.setState({text})}
            placeholder='Say something...'
            value={this.state.text}
            autoCapitalize="none"
            style={styles.textArea} />
          <Button
            onPress={() => this.sendMsg()}>
            SEND
          </Button>
        </View>
      );
    } else {
      return (
        <View style={styles.body}>
          <StatusBarColor/>
          <Heading text="BATTLE TIME!"/>
          <Button
            onPress={() => this.props.returnToList()}>
            Back
          </Button>
          <ScrollView>
            <ListView
              initialListSize={5}
              enableEmptySections={true}
              dataSource={this.state.msgDataSource}
              renderRow={msg => {
                return this.renderMsgRow(msg);
              }}
            />
          </ScrollView>
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
  textArea: {
    alignSelf: 'flex-start',
    fontFamily: 'Gill Sans',
    color: '#372769',
    height: 40,
    width: vw*0.9,
    margin: 10,
    borderColor: '#9C8FC4',
    borderWidth: 0.5
  },
  msgReceived: {
    backgroundColor: "white",
    alignSelf: 'flex-start',
    borderColor: "#000000",
    flexDirection: "column",
    padding: 10,
    margin: 7,
    borderRadius: 10,
    shadowColor: "#291D56",
    shadowOffset: { height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3
  },
  msgSent: {
    backgroundColor: "green",
    alignSelf: 'flex-end',
    borderColor: "#000000",
    flexDirection: "column",
    padding: 10,
    margin: 7,
    borderRadius: 10,
    shadowColor: "#291D56",
    shadowOffset: { height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3
  }
});


export default Battle;
