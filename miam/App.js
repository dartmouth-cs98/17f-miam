import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TabBarIOS }
from "react-native";
import Feed from "./Components/Feed";
import LogIn from "./Components/LogIn";

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedTab: 'featured',
			loggedIn: true
		};
	}

	render() {
		if (this.state.loggedIn) {
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
				<Feed/>
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
		else {
			return (
				<LogIn/>
			);
		}
	}
}
