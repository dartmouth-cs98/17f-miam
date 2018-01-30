import React, { Component } from "react";

import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight
} from "react-native";
import TextObj from "./MemeObjects/TextMemeObj.js";

class Meme extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgURL: this.props.imgURL,
      text: this.props.text || "",
      layers: this.props.layers || []
    };

    this.renderLayers = this.renderLayers.bind(this);
  }

  componentWillMount() {
    this.setState({ imgURL: this.props.imgURL, text: this.props.text, layers: this.props.layers});
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ imgURL: nextProps.imgURL, text: nextProps.text, layers: nextProps.layers });
  }

  renderLayers(){
    var layerObjects = [];
    for(let i = 0; i < this.state.layers.length; i++){
      if(this.state.layers[i].type == "text"){
        layerObjects.push(<TextObj key={i} selectionKey={i} editor={null} layer={this.state.layers[i]}/>);
        console.log(this.state.layers[i]);
      }
    }

    return layerObjects;
  }

  render() {

    var layerObjects = this.renderLayers();

    return (
      <View style={styles.memeContainer}>
        <Image source={{ uri: this.state.imgURL }} style={styles.memeStyle} resizeMode="contain">
          {layerObjects}
        </Image>
        <Text style={{ textAlign: "center", fontSize: 14, fontWeight: "bold" }}>
          {this.state.text}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  memeContainer: {
    marginBottom: "2%"
  },
  memeStyle: {
    width: 300,
    height: 200,
    alignSelf: "center"
  }
});
module.exports = Meme;
