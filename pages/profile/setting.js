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

export default class Setting extends Component {
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
		Actions.profile();
		return true;
	};

	logOutProcess() {
		AsyncStorage.removeItem('user');
		// AsyncStorage.removeItem('address');
		// AsyncStorage.removeItem('useremail');
		Actions.home();
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
						<Text style={{ fontSize: 18, color: Colors.WHITE, fontFamily: Fonts.REGULAR, marginLeft: 16 }}>Pengaturan</Text>
					</Body>
					<Right />
				</Header>
				<StatusBar barStyle="light-content" backgroundColor= {Colors.PRIMARY} />
				<Content style={{ backgroundColor: Colors.WHITE }}>
					<View style={{ padding: 20 }}>
						<Text style={{ fontSize: 12, color: '#7e7674', fontFamily: Fonts.REGULAR }}>Pengaturan Akun</Text>
						<TouchableOpacity style={{ marginTop: 16 }} onPress={() => Actions.profileEdit()}>
							<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>Ubah Profil</Text>
						</TouchableOpacity>
						<TouchableOpacity style={{ marginTop: 16 }} onPress={() => Actions.password()}>
							<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>Kata Sandi</Text>
						</TouchableOpacity>
					</View>
					<View style={{ height: 1, backgroundColor: Colors.BORDER }}></View>
					<View style={{ padding: 20 }}>
						<Text style={{ fontSize: 12, color: '#7e7674', fontFamily: Fonts.REGULAR }}>Keluar</Text>
						<TouchableOpacity style={{ marginTop: 16 }} onPress={() => this.logOutProcess()}>
							<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>Keluar</Text>
						</TouchableOpacity>
					</View>
				</Content>
			</Container>
		);
	};
};