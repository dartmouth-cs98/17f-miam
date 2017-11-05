import React from 'react';
import {ImagePicker} from 'expo';
import { View, Text, Image, StyleSheet, Dimensions, Button, TouchableHighlight, TextInput, AsyncStorage } from 'react-native';
import Ionicon from "react-native-vector-icons/Ionicons";
import Maticon from "react-native-vector-icons/MaterialIcons";

import { createPost } from '../api';

import StatusBarColor from './StatusBarColor';
import Heading from './Heading';
import TestCanvas from "./TestCanvas";

const vw = Dimensions.get('window').width;

class CreatePost extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      image: null,
      tags: []
    };

    this.nav = props.navigation;

    // console.log(this.tester);
  }

  getImageFromRoll = async() => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4,3],
    });

    if(!result.cancelled){
      // this.setState({ image: result.uri });
      this.canvas.addImageCanvasObj(result);
      
    }
  }

        // <TouchableHighlight style={[styles.buttonTouchHighlight, styles.backgroundDeepPurple]} onPress={this.getImageFromRoll}>
        //   <View style={styles.buttonContainer}>
        //     <Maticon style={[styles.buttonIcon, styles.colorWhite]} name="gif" size={30} color="white" />
        //     <Text style={[styles.buttonText, styles.colorWhite]}>Get Gif from GIPHY</Text>
        //   </View>
        // </TouchableHighlight>


  render() {
    return (
      <View style={styles.body}>
        <StatusBarColor/>
        <Heading text="Create Post" backButtonVisible={true} nav={this.nav}/>
        <TouchableHighlight style={[styles.buttonTouchHighlight, styles.backgroundGreen]} onPress={this.getImageFromRoll}>
          <View style={styles.buttonContainer}>
            <Ionicon style={[styles.buttonIcon, styles.colorWhite]} name="md-image" size={30} color="white" />
            <Text style={[styles.buttonText, styles.colorWhite]}>Get Image from Camera Roll</Text>
          </View>
        </TouchableHighlight>
        {
          this.state.image //&&
          // <View style={{height: "100%"}}>
          //   <Image source={{ uri: this.state.image }} style={styles.imagePreview}/>
          //   <TouchableHighlight style={styles.buttonTouchHighlight} onPress={this.getImageFromRoll}>
          //     <View style={styles.buttonContainer}>
          //       <Ionicon style={styles.buttonIcon} name="ios-brush" size={30} color="white" />
          //       <Text style={styles.buttonText}>Edit</Text>
          //     </View>
          //   </TouchableHighlight>
          // </View>
        }
        
         <TestCanvas ref={component => this.canvas = component} {...this.props}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1.5,
    backgroundColor: "#ffffff"
  },
  buttonTouchHighlight: {
    alignSelf: "center",
    marginTop: "3%",
    height: "6%",
    width: "90%",
    borderRadius: 10,
  },
  buttonContainer: {
    marginTop: "3%"
  },
  buttonIcon: {
    position: "absolute",
    marginTop: "-1.5%",
    left: "5%"
  },
  buttonText: {
    position: "absolute",
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: "center",
    top: "15%",
    right: "10%"
  },
  colorWhite: {
    color: "white"
  },
  colorBlack: {
    color: "black"
  },
  backgroundGreen: {
    backgroundColor: "#4ca84c"
  },
  backgroundDeepPurple: {
    backgroundColor: "#695287"
  },
  imagePreview: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginTop: '3%',
    shadowOpacity: 0.3,
    shadowRadius: 3
  }
});

export default CreatePost;
