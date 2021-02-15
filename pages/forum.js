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
import FooterBottom from '../components/footer';
import Colors from '../components/colors';
import Fonts from '../components/fonts';
import {Actions} from 'react-native-router-flux';
import axios from 'axios';
import Config from '../config.js';
import Loader from '../components/loader';
import moment from 'moment/min/moment-with-locales';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class Forum extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userId: null,
			isLoadingData: false,
			isLoadingCheckUser: true,
			timelineData: []
		};
	};

	componentWillMount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
		AsyncStorage.getItem('user', (error, result) => {
			if (result) {
				let resultParsed = JSON.parse(result)
				this.setState({
					userId: resultParsed.token.user_id
				});
				this.showLoadingCheckUser(false);
				this.showLoadingData(true);
			} else {
				this.showLoadingCheckUser(false);
			}
		});
	};

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
	};

	componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
		this.getTimeline();
	};

	handleBackButton = () => {
		if(this.state.doubleBackToExitPressedOnce) {
			BackHandler.exitApp();
		}

		this.setState({ doubleBackToExitPressedOnce: true });
		Toast.message('Tekan sekali lagi untuk keluar!');

		setTimeout(() => {
			this.setState({ doubleBackToExitPressedOnce: false });
		}, 3000);
		return true;
	};

	showLoadingCheckUser(loading) {
		this.setState({ isLoadingCheckUser: loading });
	};

	showLoadingData(loading) {
		this.setState({ isLoadingData: loading });
	};

	getTimeline() {
		axios({
			method: 'GET',
			url: Config.API_URL + '/api/v1/timeline?paginate=1&limit=100',
			data: {},
			timeout: 35000
		}).then((response) => {
			if (response.data.header.message == 'Success') {
				this.setState({
					timelineData: response.data.data.data
				})
				this.showLoadingData(false);
			} else {
				this.showLoadingData(false);
				Toast.message(response.data.header.reason.id);
			}
		}).catch((error) => {
			this.showLoadingData(false);
			Toast.message(error.response.data.header.reason.id);
		});
	}

	formatDate(date) {
		return moment(date).format('DD MMM YYYY, HH:mm A')
	}

	render() {
		if(this.state.isLoadingCheckUser) {
			return(
				<Container>
					<FooterBottom activeIndex={1} />
				</Container>
			);
		} else {
			if(this.state.userId == null){
				return(
					<Container>
						<StatusBar barStyle="dark-content" backgroundColor={Colors.WHITE} />
						<Content>
							<View style={{ padding: 50, flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
								<Image style={{ width: 175, height: 125, tintColor: Colors.PRIMARY }} resizeMode='cover' source={require('../components/images/logoPotrait.png')}></Image>
								<View style={{ marginTop: 50 }}>
									<Text style={{ fontSize: 14, color: Colors.PRIMARY, fontFamily: Fonts.REGULAR }}>Harap Login Terlebih Dahulu!</Text>
									<Button block style={{ height: 35, widht: 50, marginTop: 16, borderRadius: 8, backgroundColor: Colors.PRIMARY }} onPress={() => Actions.login()}>
										<Text style={{ fontSize: 14, color: Colors.WHITE, fontFamily: Fonts.REGULAR }} uppercase={false}>Ke Halaman Login</Text>
									</Button>
								</View>
							</View>
						</Content>
						<FooterBottom activeIndex={1} />
					</Container>
				);
			} else {
				return(
					<Container>
						<Header style={{ backgroundColor: Colors.PRIMARY }}>
							<Left style={{ flex: 0.5 }}>
								<Text style={{ fontSize: 18, color: Colors.WHITE, fontFamily: Fonts.REGULAR }}>Lini Masa</Text>
							</Left>
							
							<Right style={{ flex: 0.5 }}>
								<Button block style={{ backgroundColor: '#32cc34', height: 30, borderRadius: 4 }} onPress={() => Actions.forumCreate()}>
									<Text style={{ fontSize: 14, color: Colors.WHITE, fontFamily: Fonts.REGULAR }} uppercase={false}>Tambah Postingan</Text>
								</Button>
							</Right>
						</Header>
						<StatusBar barStyle="light-content" backgroundColor= {Colors.PRIMARY} />
						<Content style={{ backgroundColor: Colors.BACKGROUND }}>
							{
								this.state.isLoadingData ?
									<Spinner color={Colors.PRIMARY} />
								:
									this.state.timelineData.map((items, index) => (
										<View key={index} style={{ borderTopWidth: 1, borderColor: Colors.BORDER, borderBottomWidth: 1, marginBottom: 16, backgroundColor: Colors.WHITE }}>
											<View style={{ flexDirection: 'row', padding: 12, alignItems: 'center' }}>
												<View style={{ flexDirection: 'row', flex: 0.9, alignItems: 'center' }}>
													<Image style={{ height: 40, width: 40 }} resizeMode='cover' source={require('../components/images/avatar.png')}></Image>
													<View style={{ marginLeft: 20 }}>
														<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>{items.user.fullname}</Text>
														<View style={{ flexDirection: 'row', marginTop: 5 }}>
															<View style={{ flexDirection: 'row' }}>
																<Icon name="clock" size={10} color={Colors.GREY} />
																<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.LIGHT, marginLeft: 5 }}>{this.formatDate(items.created_at)}</Text>
															</View>
															{/* <View style={{ flexDirection: 'row', marginLeft: 10 }}>
																<Icon name="map-marker-alt" size={10} color={Colors.GREY} />
																<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.LIGHT, marginLeft: 5 }}>{items.related_address == null ? '-' : items.related_address.address.street_1}</Text>
															</View> */}
														</View>
													</View>
												</View>
												{/* <View style={{ flex: 0.1 }}>
													<TouchableOpacity style={{ alignItems: 'flex-end' }} onPress={() => alert('share')}>
														<Image style={{ height: 18, width: 18, tintColor: Colors.GREY }} resizeMode='contain' source={require('../components/images/shareOutline.png')}></Image>
													</TouchableOpacity>
												</View> */}
											</View>
											<View style={{ maxHeight: 300, minHeight: 150, width: width }}>
												<Image style={{ height: 200 }} resizeMode='cover' source={items.related_images[0].image.path != '' ? { uri: items.related_images[0].image.path } : require('../components/images/placeholderSquare.png')}></Image>
											</View>
											<View style={{ padding: 12, marginTop: 6, marginBottom: 6 }}>
												<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>{items.description}</Text>
											</View>
											<View style={{ borderTopWidth: 0.5, borderColor: Colors.BORDER, borderBottomWidth: 0.5, flexDirection: 'row', }}>
												<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 12, borderColor: Colors.BORDER, borderRightWidth: 0.5 }} onPress={() => alert('Suka')}>
													{
														items.__meta__.is_like == 0 ?
															<Image style={{ height: 18, width: 18 }} resizeMode='contain' source={require('../components/images/likeOutline.png')}></Image>
														:
															<Image style={{ height: 18, width: 18, tintColor: Colors.PRIMARY }} resizeMode='contain' source={require('../components/images/likeSolid.png')}></Image>
													}
													<View style={{ marginLeft: 6 }}>
														<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.REGULAR }}>{items.__meta__.total_like}</Text>
														<Text style={{ fontSize: 10, color: Colors.GREY, fontFamily: Fonts.LIGHT }}>Suka</Text>
													</View>
												</TouchableOpacity>
												<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 12, borderColor: Colors.BORDER, borderRightWidth: 0.5 }} onPress={() => Actions.comment()}>
													<Image style={{ height: 18, width: 18, tintColor: Colors.GREY }} resizeMode='contain' source={require('../components/images/commentOutline.png')}></Image>
													<View style={{ marginLeft: 6 }}>
														<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.REGULAR }}>{items.__meta__.total_comments}</Text>
														<Text style={{ fontSize: 10, color: Colors.GREY, fontFamily: Fonts.LIGHT }}>Komentar</Text>
													</View>
												</TouchableOpacity>
											</View>
											{
												items.related_comments.length > 0 ?
													<View style={{ padding: 12 }}>
														{ items.related_comments.map((itemComments, indexComments) => (
																<View key={indexComments} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
																	<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>{itemComments.user.fullname}</Text>
																	<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.LIGHT, marginLeft: 4, width: '70%' }}>{itemComments.review.comment}</Text>
																</View>
															))
														}
														<TouchableOpacity onPress={() => Actions.forumComment()}>
															<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.LIGHT, marginTop: 8 }}>Lihat komentar lainnya...</Text>
														</TouchableOpacity>
													</View>
												:
													null
											}
										</View>
									))
							}
						</Content>
						<FooterBottom activeIndex={1} />
					</Container>
				);	
			}
		}
	};
};

const styles = StyleSheet.create({
	
});
