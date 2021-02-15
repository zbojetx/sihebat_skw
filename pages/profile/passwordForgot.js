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

export default class PasswordForgot extends Component {
	constructor(props) {
		super(props);
		this.state = {
			origin: this.props.origin,
			email: ''
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
		if(this.state.origin == 'password') {
			Actions.password();
		} else {
			Actions.login();
		}
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
						<Text style={{ fontSize: 18, color: Colors.WHITE, fontFamily: Fonts.REGULAR, marginLeft: 16 }}>Lupa Kata Sandi</Text>
					</Body>
					<Right/>
				</Header>
				<StatusBar barStyle="light-content" backgroundColor= {Colors.PRIMARY} />
				<Content style={{ backgroundColor: Colors.WHITE }}>
					<View style={{ padding: 20 }}>
						<Text style={{ fontSize: 14, color: '#7e7674', fontFamily: Fonts.REGULAR }}>Alamat Email</Text>
						<Item inlineLabel>
							<Input style={{ fontFamily: Fonts.REGULAR }} value={this.state.email} secureTextEntry={true} onChangeText={(value) => this.setState({ email: value })} />
						</Item>
						<Button style={{ height: 30, marginTop: 8, backgroundColor: Colors.PRIMARY, borderRadius: 6 }} onPress={() => Actions.home()}>
							<Text style={{ fontSize: 14, color: Colors.WHITE, fontFamily: Fonts.REGULAR }} uppercase={false}>Kirim</Text>
						</Button>
					</View>
				</Content>
			</Container>
		);
	};
};