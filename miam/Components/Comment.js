import React, { Component } from "react";

import {
  Text,
  View,
  StyleSheet,
  TextInput,
  ListView,
  AsyncStorage,
  TouchableHighlight,
  Alert,
  Animated,
  Easing
} from "react-native";
import StatusBarColor from "./StatusBarColor";
import Heading from "./Heading";
import { postComment, fetchComment, fetchSinglePost, likePost } from "../api";
import update from "react-addons-update";
import moment from "moment";
import Icon from "react-native-vector-icons/MaterialIcons";
import { LinearGradient } from 'expo';
import { KeyboardAwareView } from "react-native-keyboard-aware-view";
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2 });
class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      commentDataSource: ds.cloneWithRows([]),
      comments: [],
      comment: "",
      originalPoster: null,
      postID: null,
      token: null
    };

    this.animRot = new Animated.Value(0);

    this.del = this.del.bind(this);
    this.getMyId = this.getMyId.bind(this);
    this.renderCommentRow = this.renderCommentRow.bind(this);
    this.comment = this.comment.bind(this);
    this.getComment = this.getComment.bind(this);
    this.sortByNewest = this.sortByNewest.bind(this);
    this.like = this.like.bind(this);

    this.renderPost = this.renderPost.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.runStarAnim = this.runStarAnim.bind(this);
  }

  del(commentId) {}

  componentWillMount() {
    this.getMyId();
  }

  componentDidMount() {
    if (this.props.navigation.state.params) {
      this.setState({
        postID: this.props.navigation.state.params.postID,
        originalPoster: this.props.navigation.state.params.originalPoster || null
      });

      // Create animation loop if there is an original poster
      if(this.props.navigation.state.params.originalPoster){
        // console.log(this.props.navigation.state.params.originalPoster);
        this.runStarAnim();
      }

      for (i = 0; i < this.props.navigation.state.params.comments.length; i++) {
        this.getComment(this.props.navigation.state.params.comments[i]);
      }

      fetchSinglePost(this.props.navigation.state.params.postID, (res, err) => {
        if(err)
          alert(err);
        else{
          console.log(this.props.navigation.state.params.postID);
          // TODO: Save post data to state
        }
      });
    }
  }

  sortByNewest(array) {
    return array.sort(function(a, b) {
      return moment(b.createdAt).valueOf() < moment(a.createdAt).valueOf()
        ? 1
        : moment(b.createdAt).valueOf() > moment(a.createdAt).valueOf()
          ? -1
          : 0;
    });
  }

  getComment(commentID) {
    fetchComment(commentID, (response, error) => {
      if (error) {
        alert(error);
      } else {
        var newArray = update(this.state.comments, {
          $push: [response.data]
        });
        sortedComments = this.sortByNewest(newArray);
        this.setState({
          comments: sortedComments
        });
        this.setState({
          commentDataSource: ds.cloneWithRows(this.state.comments)
        });
      }
    });
  }

  comment() {
    if (this.state.comment) {
      postComment(
        this.state.postID,
        this.state.comment,
        this.state.token,
        (response, error) => {
          if (error) {
            alert(error);
          } else {
            this.setState({
              comment: ""
            });
            this.getComment(response.data.comment_id);
          }
        }
      );
    } else {
      Alert.alert("Comment is empty.");
    }
  }

  async getMyId() {
    try {
      const savedToken = await AsyncStorage.getItem("@Token:key");
      const userId = await AsyncStorage.getItem("@UserId:key");
      this.setState({
        userId: userId,
        token: savedToken
      });
    } catch (error) {
      console.log(error);
    }
  }

  like(postID, action) {
    likePost(postID, action, this.state.token, (response, error) => {
      if (error) {
        alert(error);
      } else {
        // Re-fetching posts
        fetchPosts((response, error) => {
          if (error) {
            alert(error);
          } else {
            if (response.data) {
              var sortedData =
                this.state.headingTabSelected == "new"
                  ? this.sortPostByNewest(response.data)
                  : this.sortPostByHottest(response.data);

              this.setState({
                data: sortedData,
                postDataSource: ds.cloneWithRows(sortedData),
                loaded: true
              });
            }
          }
        });
      }
    });
  }

  renderPost(post) {
    var userId = post.user._id;
    var username = post.anon ? "Anonymous" : post.user.username;

    var tempUsrImg =
      "https://dummyimage.com/70x70/886BEA/FFF.png&text=" + username.charAt(0);
    const time = moment(post.createdAt).fromNow();

    const likeButton = (
      <TouchableHighlight
        underlayColor="white"
        onPress={() => this.like(post._id, "like")}
      >
        <Icon name="favorite-border" color="#cc6699" size={25} />
      </TouchableHighlight>
    );
    const unlikeButton = (
      <TouchableHighlight
        underlayColor="white"
        onPress={() => this.like(post._id, "unlike")}
      >
        <Icon name="favorite" color="#cc6699" size={25} />
      </TouchableHighlight>
    );
    var id = this.state.userId;
    var postLiked = post.likes.some(function(likeId) {
      return likeId === id;
    });

    let meme = (
      <Meme
        imgURL={post.meme.imgURL}
        text={post.posttext}
        layers={post.meme.layers}
      />
    );

    return (
      <View style={styles.postContainer}>
        <View style={styles.postHeadingContainer}>
          {post.anon ? (
            <View style={styles.iconContainer}>
              <TouchableHighlight>
                <Image
                  source={{ uri: tempUsrImg }}
                  style={styles.userIconStyle}
                  resizeMode="contain"
                />
              </TouchableHighlight>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  marginLeft: "2%",
                  marginTop: "3%"
                }}
              >
                {username}
              </Text>
            </View>
          ) : (
            <View style={styles.iconContainer}>
              <TouchableHighlight
                onPress={() =>
                  this.props.navigation.navigate("Profile", {
                    // userId: userId,
                    username: username
                  })}
              >
                <Image
                  source={{ uri: tempUsrImg }}
                  style={styles.userIconStyle}
                  resizeMode="contain"
                />
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() =>
                  this.props.navigation.navigate("Profile", {
                    // userId: userId,
                    username: username
                  })}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    marginLeft: "2%",
                    marginTop: "10%"
                  }}
                >
                  {username}
                </Text>
              </TouchableHighlight>
            </View>
          )}

          <View style={{ alignSelf: "flex-end" }}>
            <Text style={{ fontSize: 8 }}>{time}</Text>
          </View>
        </View>
        <View style={styles.separatorLine} />

        <View style={styles.postContentContainer}>
          <Text style={{ fontSize: 12, marginLeft: "2%", marginTop: "3%" }}>
            {post.hashtags}
          </Text>
          {meme}
        </View>
        <View style={styles.separatorLine} />

        <View style={styles.postFooterContainer}>
          <View style={styles.postFooterIconContainer}>
            {postLiked ? unlikeButton : likeButton}
            <Text style={{ fontSize: 12, color: "#a3a3c2", marginLeft: "5%" }}>
              {post.likes.length}
            </Text>
          </View>
          <View>
            <TouchableHighlight
              underlayColor="white"
              onPress={() => this.save(post.meme._id)}
            >
              <Icon name="save" color="#cc6699" size={25} />
            </TouchableHighlight>
          </View>
          <View>
            <TouchableHighlight
              underlayColor="white"
              onPress={() =>
                this.props.navigation.navigate("Canvas", {
                  imgURL: post.meme.imgURL,
                  layers: post.meme.layers,
                  originalPoster: "post.meme.originalPoster",    // TODO: IN CANVAS, ONLY USE THIS WHEN IT ISN"T ANONYMOUS
                  username: username
                })}>
              <Icon name="autorenew" color="#cc6699" size={25} />
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }

  renderHeader(){
    const interpolRotLeft = this.animRot.interpolate({
      inputRange: [0, 1],
      outputRange: ['-45deg', '45deg'],
    });

    const interpolRotRight = this.animRot.interpolate({
      inputRange: [0, 1],
      outputRange: ['45deg', '-45deg'],
    });

    var starBar = <View style={{flexDirection: "row", justifyContent: 'space-between', padding: 3}}>
                      <Icon style={{paddingLeft: "3%", paddingRight: "3%"}} name="stars" color="#FFDF00" size={14} />
                      <Icon style={{paddingLeft: "3%", paddingRight: "3%"}} name="stars" color="#FFDF00" size={14} />
                      <Icon style={{paddingLeft: "3%", paddingRight: "3%"}} name="stars" color="#FFDF00" size={14} />
                      <Icon style={{paddingLeft: "3%", paddingRight: "3%"}} name="stars" color="#FFDF00" size={14} />
                      <Icon style={{paddingLeft: "3%", paddingRight: "3%"}} name="stars" color="#FFDF00" size={14} />
                      <Icon style={{paddingLeft: "3%", paddingRight: "3%"}} name="stars" color="#FFDF00" size={14} />
                      <Icon style={{paddingLeft: "3%", paddingRight: "3%"}} name="stars" color="#FFDF00" size={14} />
                      <Icon style={{paddingLeft: "3%", paddingRight: "3%"}} name="stars" color="#FFDF00" size={14} />
                      <Icon style={{paddingLeft: "3%", paddingRight: "3%"}} name="stars" color="#FFDF00" size={14} />
                      <Icon style={{paddingLeft: "3%", paddingRight: "3%"}} name="stars" color="#FFDF00" size={14} />
                    </View>;
         
    var leftAnimStar = <Animated.View style={{right: "150%", transform: [{rotate: interpolRotLeft}]}}><Icon name="star" color="#FFDF00" size={45} /></Animated.View>;
    var rightAnimStar = <Animated.View style={{left: "150%", transform: [{rotate: interpolRotRight}]}}><Icon name="star" color="#FFDF00" size={45} /></Animated.View>;
    var opButton = null;

    if(this.state.originalPoster != null /*&& 
       this.state.originalPoster != this.props.navigation.state.params.username &&
       this.props.navigation.state.params.username != "Anonymous"*/){
      opButton = <TouchableHighlight
                        underlayColor="#FFFFFFAA"
                        onPress={() => {
                          this.setState({ stopAnimation: true });
                          this.props.navigation.navigate("Profile", { username: this.state.originalPoster})}}
                  >
                    <View>
                      <LinearGradient
                        style={styles.originalPosterBox}
                        colors={[ '#1D2671', '#9733EE' ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}>
                        {starBar}
                        
                        <View style={{flexDirection: "row", paddingTop: 3, paddingBottom: 3}}>
                          {leftAnimStar}
                          <View style={{alignItems: "center"}}>
                            <Text style={{fontWeight: "bold", color: "#FFFFFF", fontStyle: "italic", fontSize: 12}}> Original Poster is </Text>
                            <Text style={{fontWeight: "bold", color: "#FFFFFF", fontStyle: "italic", fontSize: 20}}>{this.state.originalPoster}</Text>
                          </View>
                          {rightAnimStar}
                        </View>
                        {starBar}
                      </LinearGradient>
                    </View>
                  </TouchableHighlight>;
    }

    return(
      <View>
        {opButton}
        <LinearGradient style={styles.commentTitleBox} colors={['#9733EE', '#DA22FF']} start={{ x:0, y:0 }} end={{ x:1, y:0 }}>
          <Text style={{fontWeight: "bold", color: "#FFFFFF", backgroundColor: "#00000000", fontStyle: "italic", fontSize: 15}}>COMMENTS:</Text>
        </LinearGradient>
      </View>
    );
  }

  renderCommentRow(comment) {
    const time = moment(comment.createdAt).fromNow();
    return (
      <View style={styles.commentContainer}>
        <View style={{ marginLeft: "2%" }}>
          <Text style={{ fontSize: 12, fontWeight: "bold", color: "#000000" }}>
            {comment.user.username}
          </Text>
        </View>
        <View style={{ marginLeft: "2%", marginTop: "2%", marginRight: "2%" }}>
          <Text style={{ fontSize: 15 }}>{comment.commenttext}</Text>
        </View>
        <Text style={{ fontSize: 8, marginLeft: "2%", top: "2%" }}>{time}</Text>
      </View>
    );
  }

  runStarAnim(){
    Animated.sequence([
      Animated.timing(this.animRot, {
        toValue: 1,
        duration: 350
      }),
      Animated.timing(this.animRot, {
        toValue: 0,
        duration: 350
      })
    ]).start(() => this.runStarAnim());
  }

  render() {

    return (
      <View style={styles.body}>
        <StatusBarColor />
        <Heading
          text="MiAM"
          backButtonVisible={true}
          nav={this.props.navigation}
        />
        <KeyboardAwareView animated={true}>


          <ListView
            initialListSize={5}
            enableEmptySections={true}
            dataSource={this.state.commentDataSource}
            renderHeader={() => this.renderHeader()}
            renderRow={comment => {
              return this.renderCommentRow(comment);
            }}
          />
          <View style={styles.createCommentContainer}>
            <TextInput
              style={{
                width: "80%",
                borderColor: "gray",
                borderWidth: 1,
                height: "100%"
              }}
              onChangeText={comment => this.setState({ comment: comment })}
              value={this.state.comment}
            />
            <TouchableHighlight
              onPress={this.comment}
              underlayColor="white"
              style={{
                width: "20%",
                justifyContent: "center",
                height: "100%"
              }}
            >
              <View
                style={{
                  backgroundColor: "#9999ff",
                  height: "100%",
                  justifyContent: "center"
                }}
              >
                <Text style={{ textAlign: "center", color: "#ffffff" }}>
                  comment
                </Text>
              </View>
            </TouchableHighlight>
          </View>
        </KeyboardAwareView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  commentContainer: {
    flexDirection: "column",
    flex: 1,
    marginTop: "2.5%",
    borderBottomWidth: 1,
    paddingBottom: "2.5%",
    borderBottomColor: "#9999ff"
  },
  createCommentContainer: {
    height: 30,
    flexDirection: "row"
  },
  commentTitleBox: {
    paddingTop: 2,
    paddingBottom: 2,
    backgroundColor: "#6633aa",
    alignItems: "center"
  },
  originalPosterBox: {
    alignItems: 'center', 
    marginBottom: 3
  }
});
module.exports = Comment;
