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
	Modal,
	BackHandler,
	StyleSheet,
	SafeAreaView
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
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Colors from '../../components/colors';
import Fonts from '../../components/fonts';
import {Actions} from 'react-native-router-flux';
import axios from 'axios';
import Config from '../../config.js';
import Loader from '../../components/loader';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			doubleBackToExitPressedOnce: false,
			isLoading: false
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
		Actions.home()
		return true;
	};

	showLoading(loading) {
		this.setState({ isLoading: loading })
	};

	sendLogin() {
		if (this.state.email == '') {
			Toast.fail('Email harus diisi!');
		} else if (this.state.password == '') {
			Toast.fail('Kata Sandi harus diisi!');
		} else {
			this.showLoading(true);
			axios({
				method: 'POST',
				url: Config.API_URL+'/api/v1/login',
				data :{
					email: this.state.email,
					password: this.state.password,
				},
				timeout: 35000
			}).then((response) => {
				
				if(response.data.header.message == 'Success'){
					this.showLoading(false);
					AsyncStorage.setItem('user', JSON.stringify(response.data.data));
					Actions.home();
				} else {
					this.showLoading(false);
					Toast.message(response.data.header.reason.id);
				}
			}).catch((error) => {
				this.showLoading(false);
				Toast.message(error.response.data.header.reason.id);
			});
		}
	}

	render() {
			return(
				<Container>
					<StatusBar barStyle="dark-content" backgroundColor= {Colors.WHITE} />
					<Content>
						<TouchableOpacity onPress={() => Actions.home()}>
							<Image style={{ height: 18, width: 18, tintColor: Colors.PRIMARY, marginLeft: 15, marginTop: 15 }} resizeMode='contain' source={require('../../components/images/back.png')}></Image>
						</TouchableOpacity>
						<View style={{ padding: 50, paddingTop: 15 }}>
							<View style={{ alignItems: 'center' }}>
								<Image style={{ width: 175, height: 125, tintColor: Colors.PRIMARY }} resizeMode='cover' source={require('../../components/images/logoPotrait.png')}></Image>
							</View>
							<View style={{ marginTop: 30 }}>
								<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>Alamat Email</Text>
								<Item regular style={{ marginTop: 8, borderColor: 'transparent' }}>
									<Input style={{ backgroundColor: Colors.INPUT, borderRadius: 8, fontFamily: Fonts.REGULAR }} value={this.state.email} onChangeText={(value) => this.setState({ email: value })} />
								</Item>
								<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 16 }}>Kata Sandi</Text>
								<Item regular style={{ marginTop: 8, borderColor: 'transparent' }}>
									<Input style={{ backgroundColor: Colors.INPUT, borderRadius: 8, fontFamily: Fonts.REGULAR }} secureTextEntry={true} value={this.state.password} onChangeText={(value) => this.setState({ password: value })} />
								</Item>
							</View>
							<Button block style={{ height: 45, marginTop: 16, borderRadius: 8, backgroundColor: Colors.PRIMARY }} onPress={() => this.sendLogin()}>
								<Text style={{ fontSize: 14, color: Colors.WHITE, fontFamily: Fonts.REGULAR }} uppercase={false}>Masuk</Text>
							</Button>
							{/* <Button block style={{ height: 45, marginTop: 8, borderRadius: 8, backgroundColor: '#0062c0' }} onPress={() => Actions.home()}>
								<Text style={{ fontSize: 14, color: Colors.WHITE, fontFamily: Fonts.REGULAR }} uppercase={false}>Masuk dengan Facebook</Text>
							</Button>
							<Button block style={{ height: 45, marginTop: 8, borderRadius: 8, backgroundColor: '#d30c0c' }} onPress={() => Actions.home()}>
								<Text style={{ fontSize: 14, color: Colors.WHITE, fontFamily: Fonts.REGULAR }} uppercase={false}>Masuk dengan Google</Text>
							</Button> */}
							<TouchableOpacity onPress={() =>  Actions.passwordForgot({ origin: 'login'})}>
								<Text style={{ fontSize: 12, color: Colors.BLACK, marginTop: 26, fontFamily: Fonts.MEDIUM, textDecorationLine: 'underline' }}>Lupa kata sandi?</Text>
							</TouchableOpacity>
							<TouchableOpacity style={{ flexDirection: 'row', marginTop: 8 }} onPress={() => Actions.register()}>
								<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>Belum punya akun?</Text>
								<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.MEDIUM, textDecorationLine: 'underline', marginLeft: 8 }}>Daftar sekarang!</Text>
							</TouchableOpacity>
						</View>
					</Content>
					<Loader loading={this.state.isLoading} />
				</Container>
			);
		};
};