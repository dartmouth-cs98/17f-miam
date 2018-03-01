import React, { Component } from "react";

import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
  ActivityIndicator
} from "react-native";
import TextObj from "./MemeObjects/TextMemeObj.js";
import ImgObj from "./MemeObjects/ImgMemeObj.js";
import GifObj from "./MemeObjects/GifMemeObj.js";

class Meme extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgURL: this.props.imgURL,
      text: this.props.text || "",
      layers: this.props.layers || [],
      viewScale: this.props.scale || 1,
      loadingComplete: false
    };

    this.defaultWidth = 300;
    this.defaultHeight = 200;

    this.renderLayers = this.renderLayers.bind(this);
  }

  componentWillMount() {
    this.setState({ imgURL: this.props.imgURL, layers: this.props.layers, text: this.props.text});
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.lastFeedAction && (nextProps.lastFeedAction === "sort" || nextProps.lastFeedAction === "delete"))
      this.setState({ imgURL: "./Assets/Sun.png", layers: [], text: ""}, () => this.setState({ imgURL: nextProps.imgURL, layers: nextProps.layers, text: nextProps.text, loadingComplete: false }));
    else if(nextProps.layers !== this.state.layers && nextProps.imgURL !== this.state.imgURL)
      this.setState({ imgURL: nextProps.imgURL, layers: nextProps.layers, text: nextProps.text, loadingComplete: false });
  }

  renderLayers(){
    var layerObjects = [];
    for(let i = 0; i < this.state.layers.length; i++){
      if(this.state.layers[i].type == "text")
        layerObjects.push(<TextObj key={i} selectionKey={i} editor={null} layer={this.state.layers[i]} viewScale={this.state.viewScale}/>);
      if(this.state.layers[i].type == "gif")
        layerObjects.push(<GifObj key={i} selectionKey={i} editor={null} layer={this.state.layers[i]} viewScale={this.state.viewScale}/>);
      if(this.state.layers[i].type == "img")
        layerObjects.push(<ImgObj key={i} selectionKey={i} editor={null} layer={this.state.layers[i]} viewScale={this.state.viewScale}/>);
    }

    return layerObjects;
  }

  render() {
    var layerObjects = this.renderLayers();
    var meme = <Image source={{ uri: this.state.imgURL }} onLoad={ () => this.setState({ loadingComplete: true }) } style={[styles.memeStyle, {width: this.defaultWidth * this.state.viewScale, height: this.defaultHeight * this.state.viewScale}]} resizeMode="contain">
                {layerObjects}
              </Image>;

    return (
      <View>
        <View style={[styles.memeContainer, {opacity: this.state.loadingComplete ? 1 : 0, height: this.state.loadingComplete ? null : 0 }]}>
          {meme}
          <Text style={{ textAlign: "center", fontSize: 14, fontWeight: "bold" }}>
            {this.state.text}
          </Text>
        </View>
        <View style={{ flex: 1, width: this.defaultWidth, height: this.state.loadingComplete ? 0 : this.defaultHeight, alignItems: 'center', justifyContent: 'center', opacity: this.state.loadingComplete ? 0 : 1 }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  memeContainer: {
    marginBottom: "2%"
  },
  memeStyle: {
    alignSelf: "center"
  }
});
module.exports = Meme;
