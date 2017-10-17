import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TabBarIOS }
from "react-native";
import Feed from "./Components/Feed";
import LogIn from "./Components/LogIn";
<<<<<<< HEAD
import SignUp from "./Components/SignUp";
=======
>>>>>>> d436c4ec00b33ea0f03c82af805c90fc7a45c2b1
import { AuthRoot } from './router';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedTab: 'featured',
			loggedIn: true,
			view: <AuthRoot />,
			kind: 'AuthRoot',
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
				<AuthRoot />
			);
		}
	}
}
