import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TextInput, ListView, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const vw = Dimensions.get('window').width;
var mockMessages = require("../../data/mockMessages.json");
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2 });
import StatusBarColor from "../StatusBarColor";
import Heading from "../Heading";
import Button from 'react-native-button';
import { getBattle } from "../../api";

class Battle extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      msgDataSource: ds.cloneWithRows(mockMessages),
      text: ''
    };

    this.sendMsg = this.sendMsg.bind(this);
  }

  componentWillMount() {
    getBattle(this.props.battleId, (response, error) => {
      if (error) {
        console.log(error);
      } else {
        console.log(response.messages);
        this.setState({
          msgDataSource: ds.cloneWithRows(response.messages),
          loaded: true
        });
      }
    })
  }

  sendMsg() {
    
  }

  renderMsgRow(msg) {
    return (
      <View>
        <Text style={{ fontSize: 20, marginLeft: "5%", marginTop: "3%" }}>
          {msg.text}
        </Text>
      </View>
    );
  }

  render() {
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
    fontFamily: 'Gill Sans',
    color: '#372769',
    height: 40,
    width: vw*0.9,
    padding: 10,
    margin: 10,
    borderColor: '#9C8FC4',
    borderWidth: 0.5
  },
});



export default Battle;
