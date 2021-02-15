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
import Loader from '../../components/loader';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class Password extends Component {
	constructor(props) {
		super(props);
		this.state = {
			oldPassword: '',
			newPassword: '',
			confirmPassword: '',
			isLoadingpage: false
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
		AsyncStorage.getItem('user', (error, result) => {
			if (result) {
				let resultParsed = JSON.parse(result)
				this.setState({
					userId: resultParsed.token.user_id,
					profileName: resultParsed.profile.name,
					email: resultParsed.username,
					telephone: resultParsed.telephone
				})
			}
			this.showLoadingPage(false)
		});
	};

	handleBackButton = () => {
		Actions.setting();
		return true;
	};

	showLoadingPage(loadings) {
		this.setState({ isLoadingpage: loadings })
	};

	changePassword(){
		this.showLoadingPage(true)
		axios({
			method: 'PUT',
			url: Config.API_URL + '/api/v1/password',
			data: {
				email: this.state.email,
				password: this.state.oldPassword,
				new_password: this.state.newPassword,
				new_password_confirmation: this.state.confirmPassword
			},
			timeout: 35000
		}).then((response) => {
			console.log(response)
			if (response.data.header.message == 'Success') {
				this.showLoadingPage(false)
				Actions.setting();
			}
			else {
				this.showLoadingPage(false)
				Toast.message(response.data.header.reason.id);
			}
		}).catch((error) => {
			console.log(error)
			this.showLoadingPage(false);
			Toast.message(error.response.data.header.reason.id);
		});
	}

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
						<Text style={{ fontSize: 18, color: Colors.WHITE, fontFamily: Fonts.REGULAR, marginLeft: 16 }}>Kata Sandi</Text>
					</Body>
					<Right style={{ flex: 0 }}>
						<Button transparent onPress={() => this.changePassword()}>
							<Text style={{ fontSize: 18, color: Colors.WHITE, fontFamily: Fonts.LIGHT, marginLeft: 16 }} uppercase={false} onPress={() => this.changePassword()}>Simpan</Text>
						</Button>
					</Right>
				</Header>
				<StatusBar barStyle="light-content" backgroundColor= {Colors.PRIMARY} />
				<Content style={{ backgroundColor: Colors.WHITE }}>
					<View style={{ padding: 20 }}>
						<Text style={{ fontSize: 14, color: '#7e7674', fontFamily: Fonts.REGULAR }}>Kata Sandi Lama</Text>
						<Item inlineLabel>
							<Input style={{ fontFamily: Fonts.REGULAR }} value={this.state.oldPassword} secureTextEntry={true} onChangeText={(value) => this.setState({ oldPassword: value })} />
						</Item>
						<Text style={{ fontSize: 14, color: '#7e7674', fontFamily: Fonts.REGULAR, marginTop: 16 }}>Kata Sandi Baru</Text>
						<Item inlineLabel>
							<Input style={{ fontFamily: Fonts.REGULAR }} value={this.state.newPassword} secureTextEntry={true} onChangeText={(value) => this.setState({ newPassword: value })} />
						</Item>
						<Text style={{ fontSize: 14, color: '#7e7674', fontFamily: Fonts.REGULAR, marginTop: 16 }}>Ulangi Kata Sandi Baru</Text>
						<Item inlineLabel>
							<Input style={{ fontFamily: Fonts.REGULAR }} value={this.state.confirmPassword} secureTextEntry={true} onChangeText={(value) => this.setState({ confirmPassword: value })} />
						</Item>
						<TouchableOpacity style={{ marginTop: 26 }} onPress={() => Actions.passwordForgot({ origin: 'password'})}>
							<Text style={{ fontSize: 14, color: '#3d619b', fontFamily: Fonts.REGULAR }}>Lupa Kata Sandi ?</Text>
						</TouchableOpacity>
					</View>
					<Loader loading={this.state.isLoadingpage} />
				</Content>
			</Container>
		);
	};
};