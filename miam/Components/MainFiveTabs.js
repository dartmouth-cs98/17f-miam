import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TabBarIOS }
from "react-native";
import Feed from "./Feed";
import Canvas from "./Canvas";

class MainFiveTabs extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedTab: 'featured',
		};
	}

	render() {
		return (
			<TabBarIOS selectedTab={this.state.selectedTab}>
			<TabBarIOS.Item
			selected={this.state.selectedTab === 'featured'}
			systemIcon="featured"
			onPress={() => {
				this.setState({
					selectedTab: 'featured',
				});
			}}>
			<Feed/>
			</TabBarIOS.Item>

			<TabBarIOS.Item
			selected={this.state.selectedTab === 'search'}
			systemIcon="search"
			onPress={() => {
				this.setState({
					selectedTab: 'search',
				});
			}}>
			<Canvas/>
			</TabBarIOS.Item>

			<TabBarIOS.Item
			selected={this.state.selectedTab === 'more'}
			systemIcon="more"
			onPress={() => {
				this.setState({
					selectedTab: 'more',
				});
			}}>
			<Feed/>
			</TabBarIOS.Item>

			<TabBarIOS.Item
			selected={this.state.selectedTab === 'favorites'}
			systemIcon="favorites"
			onPress={() => {
				this.setState({
					selectedTab: 'favorites',
				});
			}}>
			<Feed/>
			</TabBarIOS.Item>

			<TabBarIOS.Item
			selected={this.state.selectedTab === 'contacts'}
			systemIcon="contacts"
			onPress={() => {
				this.setState({
					selectedTab: 'contacts',
				});
			}}>
			<Feed/>
			</TabBarIOS.Item>
			</TabBarIOS>
		);
	}
}

export default MainFiveTabs;
