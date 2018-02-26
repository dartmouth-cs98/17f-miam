import React, { Component } from "react";

import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight
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
      loaded: false
    };

    this.defaultWidth = 300;
    this.defaultHeight = 200;

    this.imagesToLoad = 1;

    this.renderLayers = this.renderLayers.bind(this);
    this.imageLayerLoaded = this.imageLayerLoaded.bind(this);
  }

  componentWillMount() {
    this.setState({ imgURL: this.props.imgURL, layers: this.props.layers, text: this.props.text});
  }

  componentWillReceiveProps(nextProps){
    this.setState({ imgURL: "./Assets/Sun.png", layers: [], text: "", loaded: false}, () => {
      this.imagesToLoad = 1;
      this.setState({ imgURL: nextProps.imgURL, layers: nextProps.layers, text: nextProps.text })
    });
  }

  renderLayers(){
    var layerObjects = [];
    for(let i = 0; i < this.state.layers.length; i++){
      if(this.state.layers[i].type == "text")
        layerObjects.push(<TextObj key={i} selectionKey={i} editor={null} layer={this.state.layers[i]} viewScale={this.state.viewScale}/>);
      
      if(this.state.layers[i].type == "gif"){
        layerObjects.push(<GifObj key={i} selectionKey={i} editor={null} meme={this} layer={this.state.layers[i]} viewScale={this.state.viewScale}/>);
        this.renderLayers++;
      }
      
      if(this.state.layers[i].type == "img"){
        layerObjects.push(<ImgObj key={i} selectionKey={i} editor={null} meme={this} layer={this.state.layers[i]} viewScale={this.state.viewScale}/>);
        this.renderLayers++;
      }
    }

    return layerObjects;
  }

  imageLayerLoaded(){
    this.renderLayers--;
    console.log("Hello");
    if(this.renderLayers <= 0)
      this.setState({loaded: true});
  }

  render() {

    var layerObjects = this.renderLayers();
    var image = <Image source={{ uri: this.state.imgURL }} onLoad={this.imageLayerLoaded} style={[styles.memeStyle, {width: this.defaultWidth * this.state.viewScale, height: this.defaultHeight * this.state.viewScale}]} resizeMode="contain">
      {layerObjects}
    </Image>

    if(!this.state.loaded){
      return (
        <View></View>
      )
    }
    else {
      return (
        <View style={styles.memeContainer}>
          {image}
          <Text style={{ textAlign: "center", fontSize: 14, fontWeight: "bold" }}>
            {this.state.text}
          </Text>
        </View>
      );
    }
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
