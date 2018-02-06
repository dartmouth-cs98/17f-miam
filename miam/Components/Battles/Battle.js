import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TextInput,
  ListView,
  ScrollView,
  AsyncStorage,
  TouchableHighlight
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import { findNodeHandle } from "react-native";

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2 });
import StatusBarColor from "../StatusBarColor";
import Heading from "../Heading";
import Button from "react-native-button";
import { getBattle, sendMessage, likeMeme } from "../../api";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Meme from "../Meme";
import moment from "moment";
import SelectingMeme from "./SelectingMeme";

class Battle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msgDataSource: ds.cloneWithRows([]),
      messages: [],
      text: "",
      selectingMeme: false
    };

    this.channel = props.pusher.subscribe(props.battleId);
    this.channel.bind("pusher:subscription_succeeded", () => {
      this.channel.bind("message", data => {
        this.handleMessage(data.message);
      });
    });

    this.handleMessage = this.handleMessage.bind(this);

    this.fetchBattle = this.fetchBattle.bind(this);
    this.sendMsg = this.sendMsg.bind(this);
    this.sendTextMsg = this.sendTextMsg.bind(this);
    this.sendMemeMsg = this.sendMemeMsg.bind(this);
    this.fetchBattle = this.fetchBattle.bind(this);
    this.renderInputBar = this.renderInputBar.bind(this);
    this.renderMeme = this.renderMeme.bind(this);
    this.renderText = this.renderText.bind(this);
    this.renderMsgRow = this.renderMsgRow.bind(this);
    this.like = this.like.bind(this);
  }

  fetchBattle() {
    getBattle(this.props.battleId, (response, error) => {
      if (error) {
        console.log("getBattle Error: " + error);
      } else {
        this.setState({
          msgDataSource: ds.cloneWithRows(response.messages),
          messages: response.messages,
        });
        // console.log(response);
      }
    });
  }

  componentWillMount() {
    this.fetchBattle();
  }

  componentDidMount() {
    if (this.scrollView) {
      this.scrollView.scrollToEnd({ animated: true });
    }
  }

  handleMessage(message) {
    console.log(message);
    const messages = this.state.messages.slice();
    messages.push(message);
    this.setState({
      messages: messages,
      msgDataSource: ds.cloneWithRows(messages)
    });
  }

  sendMsg(msg) {
    sendMessage(
      this.props.battleId,
      this.props.token,
      msg,
      (response, error) => {
        if (error) {
          console.log(error);
        } else {
          this.setState({
            text: "",
          });
          this.fetchBattle();
        }
      }
    );
  }

  sendTextMsg() {
    if (this.state.text !== "") {
      let msg = {
        text: this.state.text,
      };
      this.sendMsg(msg);
    } else {
      alert("Message cannot be empty!");
    }
  }

  sendMemeMsg(memeId) {
    if (memeId) {
      let msg = {
        meme: memeId
      };
      this.sendMsg(msg);
      this.setState({
        selectingMeme: false
      });
    } else {
      alert("You have to select a Meme!");
    }
  }

  like(msgId) {
    likeMeme(msgId, 'like', this.props.token, (response, error) => {
      if (error) {
        alert(error);
      } else {
        console.log(response.data.likes);
        this.fetchBattle();
      }
    })
  }

  renderMsgRow(msg) {

    if (msg.meme) {
      var likeButton = (
        <TouchableHighlight underlayColor="white" onPress={() => this.like(msg._id)}>
          <IconMaterial name="favorite-border" color="#cc6699" size={25} />
        </TouchableHighlight>
      );
      var likeNum = (
        <Text style={{ fontSize: 12, color: "#a3a3c2", marginLeft: "1%" }}>
          {msg.likes.length}
        </Text>
      );
    } else {
      var likeButton = <View />;
      var likeNum = <View />;
    }

    // var likeButton = (msg.meme !== undefined) ? (
    //   <TouchableHighlight underlayColor="white" onPress={() => this.like(msg._id)}>
    //     <IconMaterial name="favorite-border" color="#cc6699" size={25} />
    //   </TouchableHighlight>) : (<View />);

    const time = moment(msg.sentAt).fromNow();

    if (msg.text !== undefined || msg.meme !== undefined) {
      return (
        <View style={styles.messageMain}>
          <View>
            <Image
              style={styles.profilePic}
              source={{ uri: msg.sender.profilePic }}/>
          </View>
          <View style={styles.messageContainer}>
            <View style={styles.senderInfo}>
              <Text>
                {msg.sender.username}
              </Text>
              <Text>{time}</Text>
            </View>
            <View style={styles.messageContent}>
              {msg.text !== undefined && this.renderText(msg.text)}
              {msg.meme !== undefined && this.renderMeme(msg.meme)}
            </View>
            <View style={styles.messageFooterContainer}>
              {likeButton}
              {likeNum}
            </View>
          </View>
        </View>
      );
    } else {
      return <View />;
    }
  }


  renderMeme(meme) {
    if (meme) {
      return (
        <View style={styles.memeStyle}>
          <Meme imgURL={meme.imgURL} layers={meme.layers}/>
        </View>
      );
    } else {
      return <View />;
    }
  }

  renderText(text, bubbleTextStyle) {
    return (
      <Text
        style={[
          bubbleTextStyle,
          { fontSize: 20, marginLeft: "5%", marginTop: "3%" }
        ]}
      >
        {text}
      </Text>
    );
  }

  renderInputBar() {
    return (
      <View style={styles.inputBar}>
      <TouchableHighlight
        underlayColor="white"
        onPress={() => this.setState({ selectingMeme: true })}>
        <IconMaterial name="control-point" color="#ac3973" size={35} />
      </TouchableHighlight>
        <TextInput
          onChangeText={text => this.setState({ text })}
          placeholder="Say something..."
          value={this.state.text}
          autoCapitalize="none"
          style={styles.textArea}
        />
        <TouchableHighlight
          onPress={() => this.sendTextMsg()}
          style={styles.sendButton}
        >
          <Text style={{ color: "white" }}>Send</Text>
        </TouchableHighlight>
      </View>
    );
  }

  render() {
    if (!this.state.selectingMeme) {
      return (
        <View style={styles.body}>
          <StatusBarColor />
          <Heading
            text={'#'+this.props.theme}
            backButtonVisible={true}
            backFunction={this.props.returnToList}
          />
          <KeyboardAwareScrollView
            ref={ref => {
              this.scrollView = ref;
            }}
            onContentSizeChange={(contentWidth, contentHeight) => {
              this.scrollView.scrollToEnd({ animated: true });
            }}
            contentContainerStyle={styles.scrollView}
          >
            <ListView
              initialListSize={5}
              enableEmptySections={true}
              dataSource={this.state.msgDataSource}
              renderRow={msg => {
                return this.renderMsgRow(msg);
              }}
              style={styles.listView}
            />
            {this.renderInputBar()}
          </KeyboardAwareScrollView>
        </View>
      );
    } else {
      return (
        <SelectingMeme
          token={this.props.token}
          returnToBattle={() => this.setState({ selectingMeme: false })}
          sendMemeMsg={this.sendMemeMsg}
          />
      );
    }
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#ffffff"
  },

  // Input Bar
  inputBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingVertical: 3,
    backgroundColor: "#F8F8FF",
    marginTop: 20,
    alignItems: "center"
  },
  textArea: {
    backgroundColor: "white",
    fontFamily: "Gill Sans",
    color: "#372769",
    height: 40,
    width: vw * 0.93,
    margin: 5,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    margin: 5,
    borderRadius: 5,
    backgroundColor: "#66db30"
  },

  messageMain: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "2.5%",
    borderBottomWidth: 1,
    borderBottomColor: "#9999ff",
    // paddingBottom: "2.5%",
    marginLeft: "2%",
    marginRight: "2%"
  },

  messageContainer: {
    flexDirection: "column",
    flex: 1,
    marginRight: "5%"
  },

  messageContent: {
    flexDirection: "row",
    justifyContent: "flex-start",
    margin: 10
  },

  messageFooterContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center"
  },

  //MessageBubble
  // messageBubble: {
  //   borderRadius: 10,
  //   borderColor: "#000000",
  //   marginTop: 8,
  //   marginRight: 10,
  //   marginLeft: 10,
  //   paddingHorizontal: 10,
  //   paddingVertical: 5,
  //   flexDirection: "column",
  //   shadowColor: "#291D56",
  //   shadowOffset: { height: 2 },
  //   shadowOpacity: 0.3,
  //   shadowRadius: 3,
  //   maxWidth: "85%"
  // },

  // messageBubbleLeft: {
  //   backgroundColor: "#d5d8d4",
  //   alignSelf: "flex-start"
  // },
  //
  // messageBubbleTextLeft: {
  //   color: "black"
  // },
  //
  // messageBubbleRight: {
  //   backgroundColor: "#66db30",
  //   alignSelf: "flex-end"
  // },
  //
  // messageBubbleTextRight: {
  //   color: "white"
  // },

  // listView: {
  //   height: vh*0.75
  // },

  scrollView: {
    flexDirection: "column",
    marginBottom: 25,
    justifyContent: "space-between"
  },

  avator: {
    flex: 0,
    width: 32,
    height: 32,
    borderRadius: 32 / 2,
    backgroundColor: "#d5d8d4",
    marginTop: 8
  },

  memeStyle: {
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 10,
    padding: 5
  },

  senderInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 7
  },

  profilePic: {
    width: 43,
    height: 43,
    borderRadius: 20,
    margin: 2
  }
});

export default Battle;
