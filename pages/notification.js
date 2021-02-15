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
import Icon from 'react-native-vector-icons/FontAwesome5';
import FooterBottom from '../components/footer';
import Colors from '../components/colors';
import Fonts from '../components/fonts';
import {Actions} from 'react-native-router-flux';
import axios from 'axios';
import Config from '../config.js';
import Loader from '../components/loader';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class Notification extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userId: null,
			isLoading: false,
			notificationData: []
		};
	};

	showLoading(loading) {
		this.setState({ isLoading: loading })
	};

	componentWillMount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
	};

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
	};

	componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
		this.showLoading(true)
		AsyncStorage.getItem('user', (error, result) => {
			if (result) {
				let resultParsed = JSON.parse(result)
				this.setState({
					userId: resultParsed.token.user_id
				});
				this.showLoading(false)
			}
			this.getNotification()
			this.showLoading(false)
		});
	};

	handleBackButton = () => {
		Actions.home();
		return true;
	};

	getNotification() {
		this.showLoading(true)
		console.log(this.state.userId)
		axios({
			method: 'GET',
			url: Config.API_URL + '/api/v1/notification?terms&paginate=1&limit=100&user=' + this.state.userId,
			data: {},
			timeout: 35000
		}).then((response) => {
			console.log(response)
			if (response.data.header.message == 'Success') {
				this.setState({
					notificationData: response.data.data.data
				})
				this.showLoading(false)
			}
		}).catch((error) => {
			Toast.message(error.data.header.reason.id);
		});
	}

	render() {
		if (this.state.isLoading) {
			return (
				<SafeAreaView style={{ flex: 1, backgroundColor: Colors.GREY }}>
					<Loader loading={this.state.isLoading} />
				</SafeAreaView>
			);
		} else {
			if(this.state.userId == null){
				return(
				<Container>
					<Header style={{ backgroundColor: Colors.PRIMARY }}>
						<Left style={{ flex: 0 }}>
							<Button transparent onPress={() => this.handleBackButton()}>
								<Image style={{ height: 18, width: 18, tintColor: Colors.WHITE }} resizeMode='contain' source={require('../components/images/back.png')}></Image>
							</Button>
						</Left>
						<Body>
							<Text style={{ fontSize: 18, color: Colors.WHITE, fontFamily: Fonts.REGULAR, marginLeft: 16 }}>Notifikasi</Text>
						</Body>
						<Right />
					</Header>
					<StatusBar barStyle="light-content" backgroundColor= {Colors.PRIMARY} />
					<Content>
						<View style={{ padding: 50 }}>
							<View style={{ alignItems: 'center' }}>
								<Image style={{ width: 250, height: 55, tintColor: Colors.PRIMARY }} resizeMode='cover' source={require('../components/images/logoLandscape.png')}></Image>
							</View>
							<View style={{ alignItems: 'center', justifyContent: 'center', height: 400 }}>
								<Text style={{ fontSize: 15, color: Colors.PRIMARY }}>Harap Login Terlebih Dahulu!</Text>
								<Button block style={{ height: 30, width: '50%', alignSelf: 'center', marginTop: 10, borderRadius: 8, backgroundColor: Colors.PRIMARY }} onPress={() => Actions.login()}>
									<Text style={{ fontSize: 10, color: Colors.WHITE, fontFamily: Fonts.REGULAR }} uppercase={false}>Ke Halaman Login</Text>
								</Button>
							</View>
						</View>
					</Content>
				</Container>
				);
			} else {
				return(
					<Container>
						<Header style={{ backgroundColor: Colors.PRIMARY }}>
							<Left style={{ flex: 0 }}>
								<Button transparent onPress={() => this.handleBackButton()}>
									<Image style={{ height: 18, width: 18, tintColor: Colors.WHITE }} resizeMode='contain' source={require('../components/images/back.png')}></Image>
								</Button>
							</Left>
							<Body>
								<Text style={{ fontSize: 18, color: Colors.WHITE, fontFamily: Fonts.REGULAR, marginLeft: 16 }}>Notifikasi</Text>
							</Body>
							<Right />
						</Header>
						<StatusBar barStyle="light-content" backgroundColor= {Colors.PRIMARY} />
						<Content>
							{
								this.state.notificationData.length > 0 ? 
								this.state.notificationData.map((items) => (
									<View key={Math.random()}>
										<View style={{ padding: 10 }}>
											<Text style={{ fontSize: 15, color: Colors.BLACK, fontFamily: Fonts.BOLD }}>{items.title}</Text>
											<Text style={{ fontSize: 13, color: Colors.BLACK, fontFamily: Fonts.LIGHT }}>{items.message}</Text>
										</View>
										<View style={{ height: 1, backgroundColor: Colors.BORDER }}></View>
									</View>
								))
								: 
								<View style={{ height: height, alignItems: 'center', justifyContent: 'center' }}>
									<Text style={{ fontSize: 15, color: Colors.PRIMARY }}>Notifikasi masih kosong :(</Text>
								</View>
							}
						</Content>
					</Container>
				);
			}
		}
	};
};

const styles = StyleSheet.create({
	
});
