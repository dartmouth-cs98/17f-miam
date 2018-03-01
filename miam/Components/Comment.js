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
  Easing,
  Dimensions,
  Image,
} from "react-native";
import StatusBarColor from "./StatusBarColor";
import Heading from "./Heading";
import { postComment, fetchComment, fetchSinglePost, likePost, saveExistingMeme } from "../api";
import update from "react-addons-update";
import moment from "moment";
import Icon from "react-native-vector-icons/MaterialIcons";
import Meme from "./Meme";
import { LinearGradient } from 'expo';
import { KeyboardAwareView } from "react-native-keyboard-aware-view";
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2 });
const vw = Dimensions.get("window").width;

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      sunPic: require('./Assets/SunIconMed.png'),
      commentDataSource: ds.cloneWithRows([]),
      comments: [],
      comment: "",
      postID: null,
      token: null,
      post: null
    };

    this.tempAnimTest = false;

    this.animRot = new Animated.Value(0);

    this.del = this.del.bind(this);
    this.getMyId = this.getMyId.bind(this);
    this.renderCommentRow = this.renderCommentRow.bind(this);
    this.comment = this.comment.bind(this);
    this.getComment = this.getComment.bind(this);
    this.sortByNewest = this.sortByNewest.bind(this);

    this.like = this.like.bind(this);
    this.save = this.save.bind(this);
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
        postID: this.props.navigation.state.params.postID
      });

      fetchSinglePost(this.props.navigation.state.params.postID, (res, err) => {
        if(err)
          alert(err);
        else{

          if(res.data === ""){
            Alert.alert(
              'Original Post Deleted',
              'Unforunately, the original post has been deleted by the user :(',
              [
                {text: 'Ok', style: 'cancel'},
              ],
              { cancelable: false }
            );
            this.props.navigation.goBack();
          }

          this.setState({post: res.data});

          if(res.data.originalPost)
            this.runStarAnim();

          for (i = 0; i < res.data.comments.length; i++)
            this.getComment(res.data.comments[i]);
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
        // Refetch post
        fetchSinglePost(this.props.navigation.state.params.postID, (res, err) => {
          if(err)
            alert(err);
          else{
            this.setState({post: res.data});
          }
        });
      }
    });
  }

  save(memeId) {
    saveExistingMeme(memeId, this.state.token, (response, error) => {
      if (error) {
        alert(error);
      } else {
        alert("You have successfully saved this meme!");
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

    var meme = null;
    meme = (
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
                  postID: this.state.post._id,
                  originalPost: this.state.post.originalPost
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

    var starIcon = <Icon name="star" color="#FFDF00" size={45} />;
    var sunIcon  = <Image source={this.state.sunPic} style={{width: 50, height: 50, resizeMode: "contain"}}/>;
    var leftAnimStar = <Animated.View style={{ right: "50%", transform: [{rotate: interpolRotLeft}] }}>{sunIcon}</Animated.View>;
    var rightAnimStar = <Animated.View style={{ left: "50%", transform: [{rotate: interpolRotRight}] }}>{sunIcon}</Animated.View>;
    var opButton = null;
    var postView = null;

    if(this.state.post != null){
      postView = this.renderPost(this.state.post);

      if(this.state.post.originalPost && this.state.post.originalPost != null){
        opButton = <TouchableHighlight
                          underlayColor="#FFFFFFAA"
                          onPress={() => {
                            this.setState({ stopAnimation: true });
                            this.props.navigation.navigate("Comment", { postID: this.state.post.originalPost})}}>
                      <View>
                        <LinearGradient
                          style={styles.originalPosterBox}
                          colors={[ '#1D2671', '#9733EE' ]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}>
                          <View style={{ flexDirection: "row", paddingTop: 3, paddingBottom: 3, justifyContent: "center", alignItems: "center"}}>
                            {leftAnimStar}
                            <View style={{alignItems: "center"}}>
                              <Text style={{fontWeight: "bold", color: "#FFFFFF", fontStyle: "italic", fontSize: 16}}> This is a REMIXED post </Text>
                              <Text style={{fontWeight: "bold", color: "#FFFFFF", fontStyle: "italic", fontSize: 12}}> Tap here to see original </Text>
                            </View>
                            {rightAnimStar}
                          </View>
                        </LinearGradient>
                      </View>
                    </TouchableHighlight>;
                  }
    }

    return(
      <View>
        {postView}
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
    height: 40,
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
    margin: 3,
    borderRadius: 15,
    padding: 5

  },
  postContainer: {
    backgroundColor: "#ffffff",
    borderColor: "#000000",
    flexDirection: "column",
    width: 0.9 * vw,
    margin: 7,
    borderRadius: 10,
    shadowColor: "#291D56",
    shadowOffset: { height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    padding: 5,
    alignSelf: "center"
  },
  postHeadingContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingBottom: "1%"
  },
  iconContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start"
  },
  userIconStyle: {
    borderRadius: 15,
    width: 30,
    height: 30,
    marginLeft: "2%"
  },
  postFooterContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  separatorLine: {
    height: 1,
    backgroundColor: "#ecc6ec"
  },
  postFooterIconContainer: {
    flexDirection: "row",
    alignItems: "center"
  }
});
module.exports = Comment;
