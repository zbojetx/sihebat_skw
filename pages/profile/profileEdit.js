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

export default class ProfileEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			email: '',
			telephone: '',
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
		this.showLoadingPage(true)
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

	sendLogin() {
		AsyncStorage.getItem('login', (error, result) => {
			if (result) {
				let resultParsed = JSON.parse(result)
				console.log(resultParsed)
				axios({
					method: 'POST',
					url: Config.API_URL + '/api/v1/login',
					data: {
						email: this.state.email,
						password: resultParsed.password,
					},
					timeout: 35000
				}).then((response) => {
					console.log(response)
					if (response.data.header.message == 'Success') {
						this.showLoadingPage(false)
						AsyncStorage.setItem('user', JSON.stringify(response.data.data));
						Actions.profile();
					} else {
						this.showLoadingPage(false)
						Toast.message(response.data.header.reason.id);
					}
				}).catch((error) => {
					this.showLoadingPage(false)
					Toast.message(error.response.data.header.reason.id);
				});
			}
		});
	}

	editProfile(){
		this.showLoadingPage(true)
		
		axios({
			method: 'PUT',
			url: Config.API_URL + '/api/v1/profile',
			data: {
				user_id: this.state.userId,
				name: this.state.profileName,
				email: this.state.email,
				telephone: this.state.telephone
			},
			timeout: 35000
		}).then((response) => {
			console.log(response)
			if (response.data.header.message == 'Success') {
				this.sendLogin()
			}
			else {
				this.showLoadingPage(false)
				Toast.message(response.data.header.reason.id);
			}
		}).catch((error) => {
			this.showLoadingPage(false);
			Toast.message(error.data.header.reason.id);
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
						<Text style={{ fontSize: 18, color: Colors.WHITE, fontFamily: Fonts.REGULAR, marginLeft: 16 }}>Ubah Profil</Text>
					</Body>
					<Right style={{ flex: 0 }}>
						<Button transparent onPress={() => Actions.setting()}>
							<Text style={{ fontSize: 18, color: Colors.WHITE, fontFamily: Fonts.LIGHT, marginLeft: 16 }} uppercase={false} onPress={() => this.editProfile()}>Simpan</Text>
						</Button>
					</Right>
				</Header>
				<StatusBar barStyle="light-content" backgroundColor= {Colors.PRIMARY} />
				<Content style={{ backgroundColor: Colors.WHITE }}>
					<View style={{ padding: 20 }}>
						<View style={{ alignItems: 'center', justifyContent: 'center' }}>
							<View style={{ marginTop: 12 }}>
								<Image style={{ height: 100, width: 100 }} resizeMode='cover' source={require('../../components/images/avatar.png')}></Image>
							</View>
							{/* <TouchableOpacity onPress={() => alert('open camera')}>
								<Text style={{ fontSize: 12, color: '#3d619b', fontFamily: Fonts.REGULAR, marginTop: 16 }}>Ubah Foto Profil</Text>
							</TouchableOpacity> */}
						</View>
						<Text style={{ fontSize: 14, color: '#7e7674', fontFamily: Fonts.REGULAR, marginTop: 24 }}>Nama</Text>
						<Item inlineLabel>
							<Input style={{ fontFamily: Fonts.REGULAR }} value={this.state.profileName} onChangeText={(value) => this.setState({ profileName: value })} />
						</Item>
						<Text style={{ fontSize: 14, color: '#7e7674', fontFamily: Fonts.REGULAR, marginTop: 16 }}>Email</Text>
						<Item inlineLabel>
							<Input style={{ fontFamily: Fonts.REGULAR }} value={this.state.email} onChangeText={(value) => this.setState({ email: value })} />
						</Item>
						<Text style={{ fontSize: 14, color: '#7e7674', fontFamily: Fonts.REGULAR, marginTop: 16 }}>Telepon</Text>
						<Item inlineLabel>
							<Input style={{ fontFamily: Fonts.REGULAR }} value={this.state.telephone} onChangeText={(value) => this.setState({ telephone: value })} />
						</Item>
					</View>
					<Loader loading={this.state.isLoadingpage} />
				</Content>
			</Container>
		);
	};
};