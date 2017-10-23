import React, { Component } from "react";

import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
  ListView,
  ScrollView,
  Dimensions
} from "react-native";

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2 });
const vw = Dimensions.get("window").width;

var xhr = $.get(
  "http://api.giphy.com/v1/gifs/search?q=ryan+gosling&api_key=YOUR_API_KEY&limit=5"
);
xhr.done(function(data) {
  console.log("success got data", data);
});

export default class Search extends React.Component {}

module.exports = Search;
