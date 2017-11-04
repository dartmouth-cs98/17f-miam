import React, {Component} from 'react';
import {
	View,
	Text,
	StyleSheet,
	Platform }
from "react-native";

// Eliminate the pesky space between the status bar of the phone and app visuals
// Help from https://stackoverflow.com/questions/42599850
class StatusBarColor extends Component{
	render(){
		return (
			<View style={styles.background}></View>
		);
	}
}

const styles = StyleSheet.create({
	background:{
		height: 20,
		backgroundColor: '#aaddff'
	}
})

export default StatusBarColor;