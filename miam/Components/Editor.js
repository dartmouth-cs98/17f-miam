import React, { Component } from "react";

import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  AsyncStorage,
  Alert,
  ScrollView
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Slider from "react-native-slider";
import { Isao } from "react-native-textinput-effects";
import StatusBarColor from "./StatusBarColor";
import { ImagePicker } from "expo";
import Heading from "./Heading";
import NavigationBar from "./NavigationBar";
import ViewShot from "react-native-view-shot";
import FadeAnim from "./AnimatedComponents/FadeAnim";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { captureRef } from "react-native-view-shot";
import { createPost } from "../api";
import { uploadImage } from "../api";
import TextObj from "./MemeObjects/TextMemeObj.js";
import ImgObj from "./MemeObjects/ImgMemeObj.js";
import GifObj from "./MemeObjects/GifMemeObj.js";
// import { RNS3 } from "react-native-aws3";
import Expo from "expo";

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgURL: "https://icon-icons.com/icons2/317/PNG/512/sign-error-icon_34362.png",
      selectedType: "",
      selectedObj: null,
      selectedObjKey: -1,

      editorMode: "",

      layers: [],
      key: 0
    };

    this.layerLimit = 25;
    this.layerRefs            = [];
    this.addLayerRef          = this.addLayerRef.bind(this);
    this.addObjectsFromLayers = this.addObjectsFromLayers.bind(this);

    // Editor methods
    this.getLayers      = this.getLayers.bind(this);
    this.clearAll       = this.clearAll.bind(this);
    this.selectObj      = this.selectObj.bind(this);
    this.unselectObj    = this.unselectObj.bind(this);
    this.recenterObj    = this.recenterObj.bind(this);
    this.deleteObjAlert = this.deleteObjAlert.bind(this);
    this.deleteObj      = this.deleteObj.bind(this);

    // Instancing methods
    this.addText          = this.addText.bind(this);
    this.addLocalImg      = this.addLocalImg.bind(this);
    this.getImageFromRoll = this.getImageFromRoll.bind(this);
    this.uploadLocalPhoto = this.uploadLocalPhoto.bind(this);
    this.addGif           = this.addGif.bind(this);
    this.getGifAPICall    = this.getGifAPICall.bind(this);

    // Editing Modes
    this.editText         = this.editText.bind(this);
    this.editSize         = this.editSize.bind(this);
    this.editRotate       = this.editRotate.bind(this);
    this.editColor        = this.editColor.bind(this);
    this.editNewGifUrl    = this.editNewGifUrl.bind(this);
    this.editBringToFront = this.editBringToFront.bind(this);
    this.editBringToBack  = this.editBringToBack.bind(this);

    this.finishEditing = this.finishEditing.bind(this);
  }

  componentDidMount() {
    if (this.props.navigation.state.params) {   // This used to be ...params.imgURL
      if(this.props.navigation.state.params.layers)
        this.addObjectsFromLayers(this.props.navigation.state.params.layers);

      this.setState({
        imgURL: this.props.navigation.state.params.imgURL || "https://icon-icons.com/icons2/317/PNG/512/sign-error-icon_34362.png"
      });
    }
  }

  addObjectsFromLayers(layers){
    for(let i = 0; i < layers.length; i++){
      if(layers[i].type == "text")
        this.addText(layers[i], i);
      if(layers[i].type == "gif")
        this.addGif(layers[i], i);
      if(layers[i].type == "img")
        this.addLocalImg(layers[i], i);
    }
  }

  getLayers(){
    // TODO: This is just a placeholder for the Layers Button. Currently does the same things as 'FinishEditing' method.
    console.log("Number of Layers: " + this.state.layers.length);
    let layers = [];
    for(let i = 0; i < this.state.layers.length; i++){
      let key = this.state.layers[i]["key"];
      layers.push(this.layerRefs[key].getLayerInfo());
    }

    console.log(layers);
  }

  clearAll(){
    Alert.alert(
      'DELETING ALL LAYERS',
      'Are you sure you want to erase all layers?',
      [
        {text: 'No', style: 'cancel'},
        {text: 'Yes', onPress: () => { this.setState({layers: []}); this.unselectObj(); }},
      ],
      { cancelable: false }
    );
  }

  selectObj(obj, type, key){
    if(this.state.selectedObj != null)
      this.state.selectedObj.deselect();

    this.setState({
      selectedObj: obj, 
      selectedType: type, 
      selectedObjKey: key
    });
  }

  unselectObj(){
    if(this.state.selectedObj != null)
      this.state.selectedObj.deselect();

    this.setState({
      selectedType: "",
      selectedObj: null,
      selectedObjKey: -1,
      editorMode: ""
    });
  }

  recenterObj(){
    this.state.selectedObj.recenter();
  }

  deleteObjAlert(){
    Alert.alert(
      'DELETING CURRENT LAYER',
      'Are you sure you want to erase the selected layer?',
      [
        {text: 'No', style: 'cancel'},
        {text: 'Yes', onPress: () => this.deleteObj()},
      ],
      { cancelable: false }
    );
  }

  deleteObj(){
    this.setState(prevState => ({
      layers: prevState.layers.filter((element, i) => element["key"] != prevState.selectedObjKey),
      selectedType: "",
      selectedObj: null,
      selectedObjKey: -1,
      editorMode: ""
    }));
  }

  addText(layer = null, key = null){
    if(this.state.layers.length >= this.layerLimit){
      Alert.alert(
        'Too many layers',
        'Please delete a canvas layer before adding another',
        [
          {text: 'Ok', style: 'cancel'},
        ],
        { cancelable: false }
      );
      return;
    }

    let newObj = <TextObj
                    key={key || this.state.key}
                    selectionKey={key || this.state.key}
                    editor={this}
                    layer={layer}/>;

    this.setState(prevState => ({
      key: prevState.key + 1,
      layers: [...prevState.layers, newObj]
    }));
  }

  addLocalImg(layer = null, key = null, imgURL = ""){
    if(this.state.layers.length >= this.layerLimit){
      Alert.alert(
        'Too many layers',
        'Please delete a canvas layer before adding another',
        [
          {text: 'Ok', style: 'cancel'},
        ],
        { cancelable: false }
      );
      return;
    }

    if(layer == null){
      var newObj = <ImgObj
                      key={key || this.state.key}
                      selectionKey={key || this.state.key}
                      editor={this}
                      imgURL={imgURL}/>
    }
    else{
      var newObj = <ImgObj
                      key={key || this.state.key}
                      selectionKey={key || this.state.key}
                      editor={this}
                      layer={layer}/>
    }

    this.setState(prevState => ({
      key: prevState.key + 1,
      layers: [...prevState.layers, newObj]
    }));
  }

  addGif(layer = null, key = null, gifURL = ""){
    if(this.state.layers.length >= this.layerLimit){
      Alert.alert(
        'Too many layers',
        'Please delete a canvas layer before adding another',
        [
          {text: 'Ok', style: 'cancel'},
        ],
        { cancelable: false }
      );
      return;
    }
    
    if(layer == null){
      var newObj = <GifObj
                      key={key || this.state.key}
                      selectionKey={key || this.state.key}
                      editor={this}
                      gifURL={gifURL}/>
    }
    else{
      var newObj = <GifObj
                      key={key || this.state.key}
                      selectionKey={key || this.state.key}
                      editor={this}
                      layer={layer}/>
    }

    this.setState(prevState => ({
      key: prevState.key + 1,
      layers: [...prevState.layers, newObj]
    }));
  }

  getImageFromRoll = async (action) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3]
    });

    if (!result.cancelled)
      this.uploadLocalPhoto(action, result.uri)
  };

  uploadLocalPhoto(action, uri) {
    pseudoRandomFileName =
      Math.random()
        .toString(36)
        .substr(2) +
      Math.random()
        .toString(36)
        .substr(2);
    typeExtension = uri.substr(uri.length - 3);

    const file = {
      uri: uri,
      name: pseudoRandomFileName + "." + typeExtension,
      type: "image/" + typeExtension
    };

    that = this;

    // Returning promise
    uploadImage(file)
      .then(function(datum) {
        if (action === 'create')
          that.addLocalImg(null, null, datum.url);
        else if (action === 'update')
          that.state.selectedObj.updateImgURL(datum.url);
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  addGifAPICallback(gifURL){
    this.addGif(null, null, gifURL);
  }

  getGifAPICall(){
    this.props.navigation.navigate("Search", {sendImgURLBack: this.addGifAPICallback.bind(this)});
  }

  addLayerRef(key, ref){
    this.layerRefs[key] = ref;
  }

  editText(){
    this.setState({ editorMode: "text"});
  }

  editSize(){
    this.setState({ editorMode: "size" });
  }

  editRotate(){
    this.setState({ editorMode: "rotate" });
  }

  editColor(){
    this.setState({ editorMode: "color" });
  }

  editNewGifUrlCallback(gifURL){
    this.state.selectedObj.updateGifURL(gifURL);
  }

  editNewGifUrl(){
    this.props.navigation.navigate("Search", {sendImgURLBack: this.editNewGifUrlCallback.bind(this)});
  }

  editBringToFront(){
    this.setState(prevState => ({
      layers: [...prevState.layers.filter((element, i) => element["key"] != this.state.selectedObjKey)].concat(prevState.layers.filter((element, i) => element["key"] == this.state.selectedObjKey))
    }));
  }

  editBringToBack(){
    this.setState(prevState => ({
      layers: [...prevState.layers.filter((element, i) => element["key"] == this.state.selectedObjKey)].concat(prevState.layers.filter((element, i) => element["key"] != this.state.selectedObjKey))
    }));
  }

  finishEditing(){
    let layers = [];
    for(let i = 0; i < this.state.layers.length; i++){
      let key = this.state.layers[i]["key"];
      layers.push(this.layerRefs[key].getLayerInfo());
    }

    this.props.navigation.navigate("Canvas", { imgURL: this.state.imgURL, layers: layers });
  }

  render() {

    var mainEditorVisible = (this.state.selectedType == "");
    var textEditorVisible = (this.state.selectedType == "text");
    var imgEditorVisible = (this.state.selectedType == "img");
    var gifEditorVisible = (this.state.selectedType == "gif");

    return (
      <View style={styles.body}>
        <StatusBarColor />
        <Heading
          text="MiAM Editor"
          backButtonVisible={true}
          nav={this.props.navigation}
        />
        <TouchableWithoutFeedback onPress={this.unselectObj}>
          <Image source={{ uri: this.state.imgURL }} style={styles.memeStyle} resizeMode="contain">
            {this.state.layers}
          </Image>
        </TouchableWithoutFeedback>


        {/** ================ MAIN EDITOR DRAWER ================ **/}
        <FadeAnim style={styles.mainEditorDrawer} visible={mainEditorVisible}>
          <Text style={styles.mainEditorDrawerTitleText}> EDITOR DRAWER </Text>

          <View style={styles.mainEditorDrawerRow}>
            <TouchableHighlight onPress={() => this.addText()} underlayColor="#ffffffaa" style={[styles.mainEditorDrawerButton, {backgroundColor: "#007D75"}]}>
              <View style={styles.mainEditorDrawerButtonView} >
                <Icon name="text-fields" color="#FFFFFF" size={20}/>
                <Text style={styles.mainEditorDrawerButtonText}>  Add Text</Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={() => this.getImageFromRoll("create")} underlayColor="#ffffffaa" style={[styles.mainEditorDrawerButton, {backgroundColor: "#EC6778"}]}>
              <View style={styles.mainEditorDrawerButtonView} >
                <Icon name="collections" color="#FFFFFF" size={20}/>
                <Text style={styles.mainEditorDrawerButtonText}>  Add Image</Text>
              </View>
            </TouchableHighlight>
          </View>

          <View style={styles.mainEditorDrawerRow}>
            <TouchableHighlight onPress={() => this.getGifAPICall()} underlayColor="#ffffffaa" style={[styles.mainEditorDrawerButton, {backgroundColor: "#2A1657"}]}>
              <View style={styles.mainEditorDrawerButtonView} >
                <Icon name="gif" color="#FFFFFF" size={20}/>
                <Text style={styles.mainEditorDrawerButtonText}>  Add Gif</Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={this.clearAll} underlayColor="#ffffffaa" style={[styles.mainEditorDrawerButton, {backgroundColor: "#800000"}]}>
              <View style={styles.mainEditorDrawerButtonView} >
                <Icon name="layers-clear" color="#FFFFFF" size={20}/>
                <Text style={styles.mainEditorDrawerButtonText}>  Clear All</Text>
              </View>
            </TouchableHighlight>
          </View>
        </FadeAnim>


        {/** ================ COMPLETE BUTTON ================ **/}
        <TouchableHighlight onPress={this.finishEditing} underlayColor="#ffffffaa" style={[styles.completeButton, {backgroundColor: "#009900"}]}>
            <View style={styles.completeButtonView} >
              <Icon name="check-circle" color="#FFFFFF" size={25}/>
              <Text style={styles.completeButtonText}>  Finished</Text>
            </View>
          </TouchableHighlight>


        {/** ================ TEXT EDITOR DRAWER ================ **/}
        <FadeAnim style={styles.objEditorDrawer} visible={textEditorVisible}>
          <Text style={styles.mainEditorDrawerTitleText}> Text Editing Options </Text>

          <ScrollView style={{height: 160}} contentContainerStyle={{alignItems: "center"}}>
            <TouchableHighlight onPress={this.editText} underlayColor="#ffffffaa" style={[styles.objEditorDrawerButton, {backgroundColor: "#4A3677"}]}>
              <View style={styles.objEditorDrawerButtonView}>
                <Icon name="mode-edit" color="#FFFFFF" size={20}/>
                <Text style={styles.objEditorDrawerButtonText}> Edit Text </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={this.editSize} underlayColor="#ffffffaa" style={[styles.objEditorDrawerButton, {backgroundColor: "#4A3677"}]}>
              <View style={styles.objEditorDrawerButtonView}>
                <Icon name="vertical-align-center" color="#FFFFFF" size={20}/>
                <Text style={styles.objEditorDrawerButtonText}> Edit Font Size </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={this.editRotate} underlayColor="#ffffffaa" style={[styles.objEditorDrawerButton, {backgroundColor: "#4A3677"}]}>
              <View style={styles.objEditorDrawerButtonView}>
                <Icon name="autorenew" color="#FFFFFF" size={20}/>
                <Text style={styles.objEditorDrawerButtonText}> Edit Rotation </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={this.editColor} underlayColor="#ffffffaa" style={[styles.objEditorDrawerButton, {backgroundColor: "#4A3677"}]}>
              <View style={styles.objEditorDrawerButtonView}>
                <Icon name="color-lens" color="#FFFFFF" size={20}/>
                <Text style={styles.objEditorDrawerButtonText}> Edit Color </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={this.recenterObj} underlayColor="#ffffffaa" style={[styles.objEditorDrawerButton, {backgroundColor: "#4A3677"}]}>
              <View style={styles.objEditorDrawerButtonView}>
                <Icon name="center-focus-strong" color="#FFFFFF" size={20}/>
                <Text style={styles.objEditorDrawerButtonText}> Recenter Layer </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={this.unselectObj} underlayColor="#ffffffaa" style={[styles.objEditorDrawerButton, {backgroundColor: "#4A3677"}]}>
              <View style={styles.objEditorDrawerButtonView}>
                <Icon name="remove-circle" color="#FFFFFF" size={20}/>
                <Text style={styles.objEditorDrawerButtonText}> Deselect Layer </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={this.editBringToFront} underlayColor="#ffffffaa" style={[styles.objEditorDrawerButton, {backgroundColor: "#4A3677"}]}>
              <View style={styles.objEditorDrawerButtonView}>
                <Icon name="file-upload" color="#FFFFFF" size={20}/>
                <Text style={styles.objEditorDrawerButtonText}> Bring Layer to Front </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={this.editBringToBack} underlayColor="#ffffffaa" style={[styles.objEditorDrawerButton, {backgroundColor: "#4A3677"}]}>
              <View style={styles.objEditorDrawerButtonView}>
                <Icon name="file-download" color="#FFFFFF" size={20}/>
                <Text style={styles.objEditorDrawerButtonText}> Bring Layer to Back </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={this.deleteObjAlert} underlayColor="#ffffffaa" style={[styles.objEditorDrawerButton, {backgroundColor: "#FF0000"}]}>
              <View style={styles.objEditorDrawerButtonView}>
                <Icon name="delete" color="#FFFFFF" size={20}/>
                <Text style={styles.objEditorDrawerButtonText}> Delete Layer </Text>
              </View>
            </TouchableHighlight>
          </ScrollView>

        </FadeAnim>

        {/* TODO: <BUG> When the text editing mode is selected, the current text value of the selected object resets.*/}
        {/** ================ TEXT EDITING ================ **/}
        {this.state.selectedType == "text" && this.state.editorMode == "text" &&
          <View style={styles.sliderEditorDrawer}>
            <Text style={styles.mainEditorDrawerTitleText}> Text Edit </Text>
            <TextInput
              onChangeText={text => this.state.selectedObj.setState({ text: text })}
              placeholder="Username"
              value={this.state.selectedObj.text}
              autoCapitalize="none"
              style={styles.textArea}
            />
          </View>
        }

        {/** ================ FONT SIZE EDITING ================ **/}
        {this.state.selectedType == "text" && this.state.editorMode == "size" &&
          <View style={styles.sliderEditorDrawer}>
            <Text style={styles.mainEditorDrawerTitleText}> Font Size </Text>
            <Slider
              style={styles.sliderEditorStyle}
              value={this.state.selectedObj.state.fontSize}
              maximumValue={50}
              minimumValue={10}
              step={1}
              onValueChange={(value) => this.state.selectedObj.setState({fontSize: value})} />
          </View>
        }

        {/** ================ ROTATION EDITING ================ **/}
        {this.state.selectedType == "text" && this.state.editorMode == "rotate" &&
          <View style={styles.sliderEditorDrawer}>
            <Text style={styles.mainEditorDrawerTitleText}> Rotation </Text>
            <Slider
              style={styles.sliderEditorStyle}
              value={this.state.selectedObj.state.rotation}
              maximumValue={180}
              minimumValue={-180}
              step={5}
              onValueChange={(value) => this.state.selectedObj.setState({rotation: value})} />
          </View>
        }

        {/** ================ COLOR EDITING ================ **/}
        {this.state.selectedType == "text" && this.state.editorMode == "color" &&
          <View style={styles.sliderEditorDrawer}>
            <Text style={styles.mainEditorDrawerTitleText}> Color </Text>
            <Slider
              style={[styles.sliderEditorStyle, {marginBottom: -5}]}
              value={this.state.selectedObj.state.red}
              maximumValue={255}
              minimumValue={0}
              step={1}
              thumbTintColor="#FF0000"
              onValueChange={(value) => this.state.selectedObj.setState({red: value})} />
            <Slider
              style={[styles.sliderEditorStyle, {marginBottom: -5, marginTop: -5}]}
              value={this.state.selectedObj.state.green}
              maximumValue={255}
              minimumValue={0}
              step={1}
              thumbTintColor="#00AA00"
              onValueChange={(value) => this.state.selectedObj.setState({green: value})} />
            <Slider
              style={[styles.sliderEditorStyle, {marginTop: -5}]}
              value={this.state.selectedObj.state.blue}
              maximumValue={255}
              minimumValue={0}
              step={1}
              thumbTintColor="#0000FF"
              onValueChange={(value) => this.state.selectedObj.setState({blue: value})} />
          </View>
        }


        {/** ================ IMG EDITOR DRAWER ================ **/}
        {/* TODO: Look for a scrollable row online */}
        <FadeAnim style={styles.objEditorDrawer} visible={imgEditorVisible}>
          <Text style={styles.mainEditorDrawerTitleText}> Image Editing Options </Text>

          <ScrollView style={{height: 160}} contentContainerStyle={{alignItems: "center"}}>
            <TouchableHighlight onPress={() => this.getImageFromRoll("update")} underlayColor="#ffffffaa" style={[styles.objEditorDrawerButton, {backgroundColor: "#4A3677"}]}>
              <View style={styles.objEditorDrawerButtonView}>
                <Icon name="add-to-photos" color="#FFFFFF" size={20}/>
                <Text style={styles.objEditorDrawerButtonText}> Replace Image </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={this.editSize} underlayColor="#ffffffaa" style={[styles.objEditorDrawerButton, {backgroundColor: "#4A3677"}]}>
              <View style={styles.objEditorDrawerButtonView}>
                <Icon name="zoom-out-map" color="#FFFFFF" size={20}/>
                <Text style={styles.objEditorDrawerButtonText}> Edit Scaling </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={this.editRotate} underlayColor="#ffffffaa" style={[styles.objEditorDrawerButton, {backgroundColor: "#4A3677"}]}>
              <View style={styles.objEditorDrawerButtonView}>
                <Icon name="autorenew" color="#FFFFFF" size={20}/>
                <Text style={styles.objEditorDrawerButtonText}> Edit Rotation </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={this.recenterObj} underlayColor="#ffffffaa" style={[styles.objEditorDrawerButton, {backgroundColor: "#4A3677"}]}>
              <View style={styles.objEditorDrawerButtonView}>
                <Icon name="center-focus-strong" color="#FFFFFF" size={20}/>
                <Text style={styles.objEditorDrawerButtonText}> Recenter Layer </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={this.unselectObj} underlayColor="#ffffffaa" style={[styles.objEditorDrawerButton, {backgroundColor: "#4A3677"}]}>
              <View style={styles.objEditorDrawerButtonView}>
                <Icon name="remove-circle" color="#FFFFFF" size={20}/>
                <Text style={styles.objEditorDrawerButtonText}> Deselect Layer </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={this.editBringToFront} underlayColor="#ffffffaa" style={[styles.objEditorDrawerButton, {backgroundColor: "#4A3677"}]}>
              <View style={styles.objEditorDrawerButtonView}>
                <Icon name="file-upload" color="#FFFFFF" size={20}/>
                <Text style={styles.objEditorDrawerButtonText}> Bring Layer to Front </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={this.editBringToBack} underlayColor="#ffffffaa" style={[styles.objEditorDrawerButton, {backgroundColor: "#4A3677"}]}>
              <View style={styles.objEditorDrawerButtonView}>
                <Icon name="file-download" color="#FFFFFF" size={20}/>
                <Text style={styles.objEditorDrawerButtonText}> Bring Layer to Back </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={this.deleteObjAlert} underlayColor="#ffffffaa" style={[styles.objEditorDrawerButton, {backgroundColor: "#FF0000"}]}>
              <View style={styles.objEditorDrawerButtonView}>
                <Icon name="delete" color="#FFFFFF" size={20}/>
                <Text style={styles.objEditorDrawerButtonText}> Delete Layer </Text>
              </View>
            </TouchableHighlight>
          </ScrollView>

        </FadeAnim>

        {/** ================ SIZE EDITING ================ **/}
        {this.state.selectedType == "img" && this.state.editorMode == "size" &&
          <View style={styles.sliderEditorDrawer}>
            <Text style={styles.mainEditorDrawerTitleText}> Image Scaling </Text>
            <Slider
              style={styles.sliderEditorStyle}
              value={this.state.selectedObj.state.scaling}
              maximumValue={3}
              minimumValue={0.5}
              step={0.1}
              onValueChange={(value) => this.state.selectedObj.setState({scaling: value})} />
          </View>
        }

        {/** ================ ROTATION EDITING ================ **/}
        {this.state.selectedType == "img" && this.state.editorMode == "rotate" &&
          <View style={styles.sliderEditorDrawer}>
            <Text style={styles.mainEditorDrawerTitleText}> Rotation </Text>
            <Slider
              style={styles.sliderEditorStyle}
              value={this.state.selectedObj.state.rotation}
              maximumValue={180}
              minimumValue={-180}
              step={5}
              onValueChange={(value) => this.state.selectedObj.setState({rotation: value})} />
          </View>
        }



        {/** ================ GIF EDITOR DRAWER ================ **/}
        <FadeAnim style={styles.objEditorDrawer} visible={gifEditorVisible}>
          <Text style={styles.mainEditorDrawerTitleText}> Gif Editing Options </Text>

          <ScrollView style={{height: 160}} contentContainerStyle={{alignItems: "center"}}>
            <TouchableHighlight onPress={this.editNewGifUrl} underlayColor="#ffffffaa" style={[styles.objEditorDrawerButton, {backgroundColor: "#4A3677"}]}>
              <View style={styles.objEditorDrawerButtonView}>
                <Icon name="add-to-photos" color="#FFFFFF" size={20}/>
                <Text style={styles.objEditorDrawerButtonText}> Replace GIF </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={this.editSize} underlayColor="#ffffffaa" style={[styles.objEditorDrawerButton, {backgroundColor: "#4A3677"}]}>
              <View style={styles.objEditorDrawerButtonView}>
                <Icon name="zoom-out-map" color="#FFFFFF" size={20}/>
                <Text style={styles.objEditorDrawerButtonText}> Edit Scaling </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={this.editRotate} underlayColor="#ffffffaa" style={[styles.objEditorDrawerButton, {backgroundColor: "#4A3677"}]}>
              <View style={styles.objEditorDrawerButtonView}>
                <Icon name="autorenew" color="#FFFFFF" size={20}/>
                <Text style={styles.objEditorDrawerButtonText}> Edit Rotation </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={this.recenterObj} underlayColor="#ffffffaa" style={[styles.objEditorDrawerButton, {backgroundColor: "#4A3677"}]}>
              <View style={styles.objEditorDrawerButtonView}>
                <Icon name="center-focus-strong" color="#FFFFFF" size={20}/>
                <Text style={styles.objEditorDrawerButtonText}> Recenter Layer </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={this.unselectObj} underlayColor="#ffffffaa" style={[styles.objEditorDrawerButton, {backgroundColor: "#4A3677"}]}>
              <View style={styles.objEditorDrawerButtonView}>
                <Icon name="remove-circle" color="#FFFFFF" size={20}/>
                <Text style={styles.objEditorDrawerButtonText}> Deselect Layer </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={this.editBringToFront} underlayColor="#ffffffaa" style={[styles.objEditorDrawerButton, {backgroundColor: "#4A3677"}]}>
              <View style={styles.objEditorDrawerButtonView}>
                <Icon name="file-upload" color="#FFFFFF" size={20}/>
                <Text style={styles.objEditorDrawerButtonText}> Bring Layer to Front </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={this.editBringToBack} underlayColor="#ffffffaa" style={[styles.objEditorDrawerButton, {backgroundColor: "#4A3677"}]}>
              <View style={styles.objEditorDrawerButtonView}>
                <Icon name="file-download" color="#FFFFFF" size={20}/>
                <Text style={styles.objEditorDrawerButtonText}> Bring Layer to Back </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={this.deleteObjAlert} underlayColor="#ffffffaa" style={[styles.objEditorDrawerButton, {backgroundColor: "#FF0000"}]}>
              <View style={styles.objEditorDrawerButtonView}>
                <Icon name="delete" color="#FFFFFF" size={20}/>
                <Text style={styles.objEditorDrawerButtonText}> Delete Layer </Text>
              </View>
            </TouchableHighlight>
          </ScrollView>
        </FadeAnim>

        {/** ================ SIZE EDITING ================ **/}
        {this.state.selectedType == "gif" && this.state.editorMode == "size" &&
          <View style={styles.sliderEditorDrawer}>
            <Text style={styles.mainEditorDrawerTitleText}> Gif Scaling </Text>
            <Slider
              style={styles.sliderEditorStyle}
              value={this.state.selectedObj.state.scaling}
              maximumValue={3}
              minimumValue={0.5}
              step={0.1}
              onValueChange={(value) => this.state.selectedObj.setState({scaling: value})} />
          </View>
        }

        {/** ================ ROTATION EDITING ================ **/}
        {this.state.selectedType == "gif" && this.state.editorMode == "rotate" &&
          <View style={styles.sliderEditorDrawer}>
            <Text style={styles.mainEditorDrawerTitleText}> Rotation </Text>
            <Slider
              style={styles.sliderEditorStyle}
              value={this.state.selectedObj.state.rotation}
              maximumValue={180}
              minimumValue={-180}
              step={5}
              onValueChange={(value) => this.state.selectedObj.setState({rotation: value})} />
          </View>
        }
      </View>
    );
  }
}

module.exports = Editor;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#000000"
  },
  mainEditorDrawer: {
    alignSelf: 'center',
    backgroundColor: "#000000",
    borderColor: "#FFFFFF",
    borderBottomWidth: 2,
    borderTopWidth: 2,
    marginTop: 50,
    width: "75%",
    flexDirection: "column",
    paddingTop: 5,
    paddingBottom: 5,
    overflow: "visible"
  },
  mainEditorDrawerTitleText: {
    position: "absolute",
    top: -20,
    color: "#FFFFFF",
    fontWeight: "bold"
  },
  mainEditorDrawerRow: {
    flexDirection: "row",
    alignSelf: "center"
  },
  mainEditorDrawerButton: {
    margin: 3,
    padding: 5,
    borderRadius: 3
  },
  mainEditorDrawerButtonView: {
    alignItems: 'center',
    width: 125,
    flexDirection: "row"
  },
  mainEditorDrawerButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold"
  },
  completeButton: {
    alignSelf: "center",
    position: "absolute",
    margin: 5,
    padding: 7,
    borderRadius: 5,
    bottom: "2%"
  },
  completeButtonView: {
    alignSelf: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold"
  },
  objEditorDrawer: {
    alignSelf: 'center',
    backgroundColor: "#000000",
    borderColor: "#FFFFFF",
    borderBottomWidth: 2,
    borderTopWidth: 2,
    flexDirection: "column",
    marginTop: 50,
    width: "70%",
    justifyContent: 'center'
  },
  objEditorDrawerRow: {
    alignSelf: 'center',
    backgroundColor: "#000000",
    flexDirection: "row"
  },
  objEditorDrawerButton: {
    margin: 3,
    padding: 5,
    paddingLeft: "5%",
    paddingRight: "5%",
    borderRadius: 3,
    width: "80%"
  },
  objEditorDrawerButtonView: {
    alignItems: "center",
    flexDirection: "row"
  },
  objEditorDrawerButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    paddingLeft: 10
  },
  sliderEditorDrawer:{
    alignSelf: 'center',
    backgroundColor: "#000000",
    borderColor: "#FFFFFF",
    borderTopWidth: 2,
    flexDirection: "column",
    marginTop: 25,
    width: "70%",
    justifyContent: 'center'
  },
  sliderEditorStyle: {
    marginLeft: 10,
    marginRight: 10
  },
  memeStyle: {
    width: 300,
    height: 200,
    alignSelf: "center",
    borderWidth: 2.5,
    borderRadius: 3,
    borderColor: "#FFFFFF",
    backgroundColor: "#222222",
    top: 20
  },
  testStyle: {
    position: 'absolute',
    overflow: 'visible',
    color: "#FF0000",
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: "center",
    backgroundColor: '#00000000',
    transform: [
          {translateX: 0},
          {translateY: 0},
          {rotate: '0deg'}
    ]
  },
  textArea: {
    color: "#FFFFFF",
    height: 40,
    width: "80%",
    alignSelf: "center",
    marginTop: 3,
    padding: 5,
    borderColor: "#9C8FC4",
    borderWidth: 1,
    borderRadius: 5
  },
  listView: {
    alignItems: "center",
    height: 300
  }
});
