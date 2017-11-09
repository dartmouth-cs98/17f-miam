import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TextInput, ListView, ScrollView, AsyncStorage, TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {findNodeHandle} from 'react-native';

const vw = Dimensions.get('window').width;
const vh = Dimensions.get('window').height;
var mockMessages = require("../../data/mockMessages.json");
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2 });
import StatusBarColor from "../StatusBarColor";
import Heading from "../Heading";
import Button from 'react-native-button';
import { getBattle, sendMessage } from "../../api";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


// channel.bind('my-event', function(data) {
//   alert(data.message);
// });

class Battle extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      msgDataSource: ds.cloneWithRows([]),
      messages: [],
      text: '',
      meme: '',
      myId: '',
      token: '',
      participating: false,
      participant1: {},
      participant2: {}
    };

    this.channel = props.pusher.subscribe(props.battleId);
    this.channel.bind('pusher:subscription_succeeded', () => {
      this.channel.bind('message', (data) => {
        this.handleMessage(data.message);
      });
    });

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
          messages: response.messages,
          participant1: response.participant1,
          participant2: response.participant2
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

  componentDidMount() {
    if (this.scrollView) {
      this.scrollView.scrollToEnd({animated: true});
    }
  }

  handleMessage(message) {
    const messages = this.state.messages.slice();
    messages.push(message);
    this.setState({
      messages: messages,
      msgDataSource: ds.cloneWithRows(messages)
    });
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

    var isLeft = false;

    if (this.state.participating) {
      if (msg.sender !== this.state.myId) {
        isLeft = true;
      }
    } else {
      if (msg.sender === this.state.participant1._id) {
        isLeft = true;
      }
    }

    var leftSpacer = isLeft ? null : <View/>;
    var rightSpacer = isLeft ? <View/> : null;

    var bubbleStyles = isLeft ? [styles.messageBubble, styles.messageBubbleLeft] : [styles.messageBubble, styles.messageBubbleRight];

    var bubbleTextStyle = isLeft ? styles.messageBubbleTextLeft : styles.messageBubbleTextRight;

    return (
      <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
        {leftSpacer}
        <View style={bubbleStyles}>
          <Text style={[bubbleTextStyle, { fontSize: 20, marginLeft: "5%", marginTop: "3%" }]}>
            {msg.text}
          </Text>
        </View>
        {rightSpacer}
      </View>
    );

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
          <KeyboardAwareScrollView
            ref={(ref) => { this.scrollView = ref }}
            onContentSizeChange={(contentWidth, contentHeight)=>{
              this.scrollView.scrollToEnd({animated: true});
            }}>
            <ListView
              initialListSize={5}
              enableEmptySections={true}
              dataSource={this.state.msgDataSource}
              renderRow={msg => {
                return this.renderMsgRow(msg);
              }}
            />
            <View style={styles.inputBar}>
              <TextInput onChangeText={(text) => this.setState({text})}
                placeholder='Say something...'
                value={this.state.text}
                autoCapitalize="none"
                style={styles.textArea} />
              <TouchableHighlight
                onPress={() => this.sendMsg()}
                style={styles.sendButton}>
                <Text style={{color: 'white'}}>Send</Text>
              </TouchableHighlight>
            </View>
          </KeyboardAwareScrollView>
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

  // Input Bar
  inputBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingVertical: 3,
    backgroundColor: '#F8F8FF',
    marginTop: 20
  },
  textArea: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    fontFamily: 'Gill Sans',
    color: '#372769',
    height: 40,
    width: vw*0.9,
    margin: 10,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    margin: 10,
    borderRadius: 5,
    backgroundColor: '#66db30'
  },

  //MessageBubble
  messageBubble: {
      borderRadius: 10,
      borderColor: "#000000",
      marginTop: 8,
      marginRight: 10,
      marginLeft: 10,
      paddingHorizontal: 10,
      paddingVertical: 5,
      flexDirection:"column",
      shadowColor: "#291D56",
      shadowOffset: { height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3
  },

  messageBubbleLeft: {
    backgroundColor: '#d5d8d4',
    alignSelf: 'flex-start',
  },

  messageBubbleTextLeft: {
    color: 'black'
  },

  messageBubbleRight: {
    backgroundColor: '#66db30',
    alignSelf: 'flex-end'
  },

  messageBubbleTextRight: {
    color: 'white'
  },
});


export default Battle;
