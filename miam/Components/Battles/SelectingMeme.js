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
import Button from "react-native-button";

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2 });
import StatusBarColor from "../StatusBarColor";
import Heading from "../Heading";
import { getUserSavedMemes } from "../../api";
import { LinearGradient } from "expo";

import Meme from "../Meme";

class SelectingMeme extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      memesDataSource: ds.cloneWithRows([]),
      memes: [],
      selectedMemeId: '',
    };

    this.renderMemesRow = this.renderMemesRow.bind(this);
  }

  componentWillMount() {
    getUserSavedMemes(this.props.token, (response, error) => {
      if (error) {
        console.log("Get saved memes error: " + error);
      } else {
        // console.log(response.data);
        this.setState({
          memesDataSource: ds.cloneWithRows(response.data),
          memes: response.data,
        });
      }
    });
  }

  renderMemesRow(meme) {
    return (
      <View style={styles.memeContainer}>
        <Meme imgURL={meme.imgURL} layers={meme.layers} />
        <TouchableHighlight
          style={styles.sendButton}
          onPress={() => this.props.sendMemeMsg(meme._id)}
        >
          <Text style={{ color: "white" }}>Send</Text>
        </TouchableHighlight>
      </View>
    );
  }

  render() {
    if (this.state.memes.length === 0) {
      return (
          <View style={styles.body}>
            <StatusBarColor />
            <Heading
              text='Saved Memes'
              backButtonVisible={true}
              backFunction={this.props.returnToBattle}
            />
            <Text style={styles.textMsg}>
              You have not saved any Memes yet!
            </Text>
            <Text style={styles.textMsg}>
              Go to the Feed to save Memes or create a Meme yourself!
            </Text>
          </View>
      );
    } else {
      return (
          <View style={styles.body}>
            <StatusBarColor />
            <Heading
              text='Saved Memes'
              backButtonVisible={true}
              backFunction={this.props.returnToBattle}
            />
            <ListView
              contentContainerStyle={styles.listView}
              initialListSize={5}
              enableEmptySections={true}
              dataSource={this.state.memesDataSource}
              renderRow={meme => {
                return this.renderMemesRow(meme);
              }}
            />
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
    shadowRadius: 3,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: "4%",
    flex: 1
  },
  memeStyle: {
    width: 300,
    height: 200,
    marginTop: "1%"
  },
  textMsg: {
    color: "#000000",
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 20
  },
  listView: {
    paddingBottom: "15%"
  },

  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: "1%",
    borderRadius: 5,
    backgroundColor: "#b366ff",
    width: "40%",
    height: "11%"
  }
});

export default SelectingMeme;
