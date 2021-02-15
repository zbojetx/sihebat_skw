'use strict';

import React, {
	Component
} from 'react';
import {
	View,
	StatusBar,
	TouchableOpacity,
	Image,
	Dimensions,
	AsyncStorage,
	Modal,
	BackHandler,
	StyleSheet
} from 'react-native';
import {
	Container,
	Header,
	Left,
	Body,
	Title,
	Right,
	Content,
	Item,
	Input,
	Label,
	Button,
	Text,
	Spinner
} from 'native-base';
import {
	Toast
} from 'teaset';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Colors from '../../components/colors';
import Fonts from '../../components/fonts';
import {Actions} from 'react-native-router-flux';
import axios from 'axios';
import Config from '../../config.js';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class ForumComment extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	};

	componentWillMount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
	};

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
	};

	componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
	};

	handleBackButton = () => {
		Actions.forum();
		return true;
	};

	render() {
		return(
			<Container>
				<Header style={{ backgroundColor: Colors.PRIMARY }}>
					<Left style={{ flex: 0 }}>
						<Button transparent onPress={() => this.handleBackButton()}>
							<Image style={{ height: 18, width: 18, tintColor: Colors.WHITE }} resizeMode='contain' source={require('../../components/images/back.png')}></Image>
						</Button>
					</Left>
					<Body>
						<Text style={{ fontSize: 18, color: Colors.WHITE, fontFamily: Fonts.REGULAR, marginLeft: 16 }}>Komentar</Text>
					</Body>
					<Right/>
				</Header>
				<StatusBar barStyle="light-content" backgroundColor= {Colors.PRIMARY} />
				<Content style={{ backgroundColor: Colors.WHITE }}>
					<View style={{ padding: 20 }}>
						<View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginBottom: 10 }}>
							<View style={{ flex: 0.1, justifyContent: 'center' }}>
								<Image style={{ height: 40, width: 40 }} resizeMode='cover' source={require('../../components/images/avatar.png')}></Image>
							</View>
							<View style={{ marginLeft: 20, flex: 0.9 }}>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>Pius Edi W P</Text>
									<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.LIGHT, marginLeft: 4 }}>wah seru nih...</Text>
								</View>
								<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.LIGHT, marginTop: 6 }}>3 jam yang lalu</Text>
							</View>
						</View>
						<View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginBottom: 10 }}>
							<View style={{ flex: 0.1, justifyContent: 'center' }}>
								<Image style={{ height: 40, width: 40 }} resizeMode='cover' source={require('../../components/images/avatar.png')}></Image>
							</View>
							<View style={{ marginLeft: 20, flex: 0.9 }}>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>Pius Edi W P</Text>
									<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.LIGHT, marginLeft: 4 }}>wah seru nih...</Text>
								</View>
								<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.LIGHT, marginTop: 6 }}>3 jam yang lalu</Text>
							</View>
						</View>
					</View>
				</Content>
			</Container>
		);
	};
};