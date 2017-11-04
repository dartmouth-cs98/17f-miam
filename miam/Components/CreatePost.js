import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Button, TextInput, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { createPost } from '../api';

import StatusBarColor from './StatusBarColor';
import Heading from './Heading';

const vw = Dimensions.get('window').width;

class CreatePost extends React.Component {

  constructor(props) {
    super(props);

    this.thing1 = "Hello";
    this.thing2 = "World";
    this.thing3 = true;

    this.onCreatePost = this.onCreatePost.bind(this);
  }

  onCreatePost() {
    createPost(this.state.email, this.state.password, (response, error) => {
      if (error) {
        alert(error);
      } else {
        const decoded = jwtDecode(response.token);
        console.log(decoded);
      }
    });
  }

  render() {
    if(this.thing3){
      return (
        <View>
          <StatusBarColor/>
          <Heading text="Create Post"/>
        </View>
      );
    }
    else{
      return (
        <View style={styles.container}>
          <View style={styles.logo}>
            <Image
              style={styles.logoImg}
              source={{uri:'https://orig00.deviantart.net/ed01/f/2012/208/d/4/meme_yao_ming_png_by_mfsyrcm-d58vitj.png'}}
            />
            <Text style={styles.logoFont}> Hello 2 </Text>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: "8%",
    flexDirection: "row",
    backgroundColor: '#F4F5F9',
  },
  logo: {
    flex: 0.7,
    justifyContent: 'center'
  },
  logoImg: {
    width: vw * 0.6,
    height: vw * 0.4,
    resizeMode: 'contain',
    shadowColor: '#291D56',
    shadowOffset: {height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 3
  },
  logoFont: {
    fontSize: 45,
    fontFamily: 'Gill Sans',
    color: '#372769',
    textAlign: 'center',
    margin: 20,
    marginBottom: 50,
  },
  heading: {
    height: "8%",
    width: "100%",
    backgroundColor: "#bf80ff",
    justifyContent: "center"
  },
  headingText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: "center"
  }
});

export default CreatePost;
