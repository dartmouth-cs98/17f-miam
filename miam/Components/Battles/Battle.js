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
import SearchProfile from "../SearchProfile";
import { LinearGradient } from "expo";

class Battle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msgDataSource: ds.cloneWithRows([]),
      messages: [],
      text: "",
      selectingMeme: false,
      invitingUser: false
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

    this.renderList = this.renderList.bind(this);
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
    // console.log(message);
    let messages = this.state.messages.slice();
    messages.push(message);
    // console.log(this.props.myId !== message.sender._id);
    if (this.refs.myRef && this.props.myId !== message.sender._id) {
      this.setState({
        messages: messages,
        msgDataSource: ds.cloneWithRows(messages)
      });
    }
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
        // console.log(response.data.likes);
        this.fetchBattle();
      }
    })
  }

  renderMsgRow(msg) {

    if (msg.meme) {
      var likeButton = msg.likes.includes(this.props.myId) ?
       (<TouchableHighlight underlayColor="white" onPress={() => this.like(msg._id)}>
          <IconMaterial name="favorite" color="#cc6699" size={25} />
        </TouchableHighlight>) :
       (<TouchableHighlight underlayColor="white" onPress={() => this.like(msg._id)}>
           <IconMaterial name="favorite-border" color="#cc6699" size={25} />
         </TouchableHighlight>);

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
            <TouchableHighlight
              onPress={() =>
                this.props.navigation.navigate("Profile", {
                  userId: msg.sender._id,
                  username: msg.sender.username,
                })}
            >
              <Image
                style={styles.profilePic}
                source={{ uri: msg.sender.profilePic }}/>
            </TouchableHighlight>
          </View>
          <View style={styles.messageContainer}>
            <View style={styles.senderInfo}>
              <TouchableHighlight
                onPress={() =>
                  this.props.navigation.navigate("Profile", {
                    userId: msg.sender._id,
                    username: msg.sender.username,
                  })}
              >
                <Text style={{ fontSize: 16, color: "#aaaaaa" }}>
                  {msg.sender.username}
                </Text>
              </TouchableHighlight>
              <Text style={{ fontSize: 10, color: "#aaaaaa" }}>{time}</Text>
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
          <Meme imgURL={meme.imgURL} layers={meme.layers} scale={0.9}/>
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

  // <TouchableHighlight
  //   underlayColor="white"
  //   onPress={() => this.setState({ invitingUser: true })}
  //   style={styles.iconStyle}>
  //   <IconMaterial name="group-add" color="#ac3973" size={30} />
  // </TouchableHighlight>

  renderInputBar() {
    return (
      <View style={styles.inputBar}>
        <TouchableHighlight
          underlayColor="white"
          onPress={() => this.setState({ selectingMeme: true })}
          style={styles.iconStyle}>
          <IconMaterial name="control-point" color="#b366ff" size={30} />
        </TouchableHighlight>
        <TextInput
          onChangeText={text => this.setState({ text })}
          placeholder="Say something..."
          value={this.state.text}
          autoCapitalize="none"
          style={styles.textArea}
        />
        <TouchableHighlight
          style={styles.sendButton}
          onPress={() => this.sendTextMsg()}
        >
          <Text style={{ color: "white" }}>Send</Text>
        </TouchableHighlight>
      </View>
    );
  }

  renderList() {
    if (this.state.messages.length < 6) {
      return (
        <View ref="myRef">
          <KeyboardAwareScrollView
            ref={ref => {
              this.scrollView = ref;
            }}
            onContentSizeChange={(contentWidth, contentHeight) => {
              this.scrollView.scrollToEnd({ animated: true });
            }}
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
            {!this.props.expired && this.renderInputBar()}
          </KeyboardAwareScrollView>
        </View>
      );
    } else {
      return (
        <View ref="myRef">
          <KeyboardAwareScrollView
            ref={ref => {
              this.scrollView = ref;
            }}
            onContentSizeChange={(contentWidth, contentHeight) => {
              this.scrollView.scrollToEnd({ animated: true });
            }}
            contentContainerStyle={this.props.expired && {paddingBottom: "20%"}}
          >
            <ListView
              initialListSize={5}
              enableEmptySections={true}
              dataSource={this.state.msgDataSource}
              renderRow={msg => {
                return this.renderMsgRow(msg);
              }}
            />
            {!this.props.expired && this.renderInputBar()}
          </KeyboardAwareScrollView>
        </View>
      );
    }
  }

  render() {
    if (this.state.selectingMeme) {
      return (
        <SelectingMeme
          token={this.props.token}
          returnToBattle={() => this.setState({ selectingMeme: false })}
          sendMemeMsg={this.sendMemeMsg}/>
      );
    } else if (this.state.invitingUser) {
      return (
        <SearchProfile
          nav={this.props.navigation}
          token={this.props.token}
          returnToBattle={() => this.setState({ invitingUser: false })}
          myId={this.props.myId}/>
      );
    } else {
      let text = '#'+this.props.theme;
      if (this.props.expired) {
        text += " (expired)";
      }
      return (
        <View style={styles.body}>
          <StatusBarColor />
          <Heading
            text={text}
            backButtonVisible={true}
            backFunction={this.props.returnToList}
          />
          {this.renderList()}
        </View>
      );
    }
  }
}

// <View>
//   <Image
//     style={styles.backgroundImage}
//     source={{uri: "https://vignette.wikia.nocookie.net/deathbattlefanon/images/0/0a/Vs_logo.png/revision/latest?cb=20160707222803"}}>
//     <View>
//       <StatusBarColor />
//       <Heading
//         text={'#'+this.props.theme}
//         backButtonVisible={true}
//         backFunction={this.props.returnToList}
//       />
//       {this.renderList()}
//     </View>
//   </Image>
// </View>
//
// backgroundImage: {
//   flex: 1,
//   resizeMode: "cover"
// },

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
    backgroundColor: "#E5E5E5",
    marginTop: 20,
    alignItems: "center",
    marginBottom: 0.12*vh
  },
  textArea: {
    backgroundColor: "white",
    fontFamily: "Gill Sans",
    color: "#372769",
    height: 40,
    width: vw * 0.93,
    margin: 5,
    borderColor: "#b366ff",
    borderWidth: 1,
    borderRadius: 5,
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    margin: 5,
    borderRadius: 5,
    backgroundColor: "#b366ff"
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
    flex: 1
  },

  messageContent: {
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

  listView: {
    height: vh*0.76
  },

  scrollView: {
    flexDirection: "column",
    justifyContent: "space-between",
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
    borderColor: "#9999ff",
    borderRadius: 10,
    paddingTop: "6%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
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
  },

  iconStyle: {
    marginLeft: 5
  }
});

export default Battle;
