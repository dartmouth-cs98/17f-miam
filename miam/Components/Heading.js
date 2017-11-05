import React, {Component} from 'react';
import {
	View,
	Text,
	StyleSheet,
	Platform }
from "react-native";

class Heading extends Component{
	constructor(props){
		super(props);
		this.headingText = props.text || "MiAM";
	}

	render(){
		return (
			<View style={styles.heading}>
				<Text style={styles.logo}>{this.headingText}</Text>
	    </View>
		);
	}
}

const styles = StyleSheet.create({
	heading: {
		height: "10%",
		width: "100%",
		backgroundColor: "#886BEA",
		justifyContent: "center"
	},
	logo: {
	    color: "#ffffff",
	    fontSize: 30,
	    fontWeight: 'bold',
	    textAlign: "center"
	}
})

export default Heading;
