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
	ImageBackground
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
import FooterBottom from '../../components/footer';
import Colors from '../../components/colors';
import Fonts from '../../components/fonts';
import {Actions} from 'react-native-router-flux';
import axios from 'axios';
import Config from '../../config.js';
import moment from 'moment/min/moment-with-locales';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			profileName: '',
			email: '',
			myReportData: [],
			totalBookmarks: '0',
			totalVisits: '0',
			totalReports: '0',
			userId: '',
			isLoading: true,
		};
	};

	componentWillMount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
		AsyncStorage.getItem('user', (error, result) => {
			if (result) {
				let resultParsed = JSON.parse(result)
				this.setState({
					userId: resultParsed.token.user_id,
					profileName: resultParsed.profile.fullname,
					email: resultParsed.username
				})
				this.getMyReport(resultParsed.token.user_id);
				this.getProfile(resultParsed.token.user_id);
			}
		});
	};

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
	};

	componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
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

	showLoading(loading) {
		this.setState({ isLoading: loading })
	};

	getMyReport(userId){
		axios({
			method: 'GET',
			url: Config.API_URL + '/api/v1/report/only/' + userId + '?terms=&paginate=1&limit=100',
			data: {},
			timeout: 35000
		}).then((response) => {
			if (response.data.header.message == 'Success') {
				this.setState({
					totalLaporan: response.data.data.total,
					myReportData: response.data.data.data
				})
				this.showLoading(false);
			} else {
				this.showLoading(false);
				Toast.message(response.data.header.reason.id);
			}
		}).catch((error) => {
			this.showLoading(false);
			Toast.message(error.response.data.header.reason.id);
		});
	};

	getProfile(userId){
		axios({
			method: 'GET',
			url: Config.API_URL + '/api/v1/user/' + userId,
			data: {},
			timeout: 35000
		}).then((response) => {
			if (response.data.header.message == 'Success') {
				this.setState({
					totalBookmarks: response.data.data.__meta__.my_total_bookmarks,
					totalVisits: response.data.data.__meta__.my_total_visits,
					totalReports: response.data.data.__meta__.my_total_reports,
				})
			} else {
				Toast.message(response.data.header.reason.id);
			}
		}).catch((error) => {
			Toast.message(error.response.data.header.reason.id);
		});
	}

	formatDate(date) {
		return moment(date).format('DD MMM YYYY, HH:mm A')
	};

	capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	render() {
		return(
			<Container>
				<Header style={{ backgroundColor: Colors.PRIMARY }}>
					<Left style={{ marginLeft: 10, flex: 0, width: '60%' }}>
						<Text style={{ fontSize: 18, color: Colors.WHITE, fontFamily: Fonts.REGULAR }}>Profil</Text>
					</Left>
					<Body />
					<Right>
						<Button transparent onPress={() => Actions.bookmarks()}>
							<Image style={{ height: 18, width: 18 }} resizeMode='contain' source={require('../../components/images/bookmarkOutline.png')}></Image>
						</Button>
						<Button transparent onPress={() => Actions.setting()}>
							<Image style={{ height: 18, width: 18 }} resizeMode='contain' source={require('../../components/images/settingsOutline.png')}></Image>
						</Button>
					</Right>
				</Header>
				<StatusBar barStyle="light-content" backgroundColor= {Colors.PRIMARY} />
				<Content style={{ backgroundColor: Colors.BACKGROUND }}>
					<ImageBackground style={{ }} source={require('../../components/images/backgroundProfile.png')}>
						<View style={{ alignItems: 'center', justifyContent: 'center', padding: 20 }}>
							<View>
								<Image style={{ height: 75, width: 75 }} resizeMode='cover' source={require('../../components/images/avatar.png')}></Image>
							</View>
							<View style={{ alignItems: 'center', marginTop: 16 }}>
								<Text style={{ fontSize: 16, color: Colors.WHITE, fontFamily: Fonts.REGULAR }}>{this.state.profileName}</Text>
								<Text style={{ fontSize: 14, color: Colors.WHITE, fontFamily: Fonts.LIGHT, marginTop: 4, textDecorationLine: 'underline' }}>{this.state.email}</Text>
								<TouchableOpacity onPress={() => Actions.profileEdit()}>
									<Text style={{ fontSize: 12, color: Colors.PRIMARY, fontFamily: Fonts.MEDIUM, marginTop: 16 }}>Ubah Profil</Text>
								</TouchableOpacity>
							</View>
						</View>
					</ImageBackground>

					<View style={{ flexDirection: 'row', padding: 24, flex: 1, alignItems: 'center', borderBottomWidth: 1, borderColor: Colors.BORDER, justifyContent: 'space-between', backgroundColor: '#F9F9F9' }}>
						<View style={{ flex: 0.3, alignItems: 'center' }}>
							<Text style={{ fontSize: 28, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>{this.state.totalReports}</Text>
							<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 12 }}>Laporan</Text>
						</View>
						<View style={{ flex: 0.3, alignItems: 'center' }}>
							<Text style={{ fontSize: 28, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>{this.state.totalVisits}</Text>
							<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 12 }}>Mengunjungi</Text>
						</View>
						<View style={{ flex: 0.3, alignItems: 'center' }}>
							<Text style={{ fontSize: 28, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>{this.state.totalBookmarks}</Text>
							<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 12 }}>Bookmarks</Text>
						</View>
					</View>
					{
						this.state.isLoading ?
							<Spinner color={Colors.PRIMARY} />
						:
							this.state.myReportData.length > 0 ?
								this.state.myReportData.map((items) => (
									<View style={{ borderTopWidth: 1, borderColor: Colors.BORDER, borderBottomWidth: 1, marginBottom: 16, backgroundColor: Colors.WHITE }} key={Math.random()}>
										<View style={{ flexDirection: 'row', padding: 12, justifyContent: 'space-between', alignItems: 'center' }}>
											<View style={{ flexDirection: 'row', alignItems: 'center' }}>
												<Image style={{ height: 40, width: 40 }} resizeMode='cover' source={require('../../components/images/avatar.png')}></Image>
												<View style={{ marginLeft: 20 }}>
													<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>{ items.user ? items.user.fullname : '-' }</Text>
													<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.LIGHT }}>{this.formatDate(items.created_at)}</Text>
													<View style={{ flexDirection: 'row', marginTop: 2 }}>
														<Icon name="map-marker-alt" size={10} color={'#3d619b'} />
														<Text style={{ fontSize: 12, color: '#3d619b', fontFamily: Fonts.LIGHT, marginLeft: 5, textDecorationLine: 'underline' }}>{items.related_address.address.street_1}</Text>
													</View>
												</View>
											</View>
											<View style={{ alignItems: 'flex-end' }}>
												{/* <Image style={{ height: 40, width: 40 }} resizeMode='cover' source={require('../components/images/iconCategoryLapor.png')}></Image> */}
												<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.LIGHT }}>Kategori :</Text>
												<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 2 }}>{ items.related_categories.category.name }</Text>
											</View>
										</View>
										{
											items.related_images.length > 0 ?
												items.related_images[0].image.path != null ?
													<Image style={{ height: 200, width: width }} resizeMode='cover' source={{ uri: items.related_images[0].image.path }} />
												:
													<Image style={{ height: 200, width: width }} resizeMode='cover' source={require('../../components/images/placeholderLandscape.png')} />
											:
												<Image style={{ height: 200, width: width }} resizeMode='cover' source={require('../../components/images/placeholderLandscape.png')} />
										}								
										<View style={{ flexDirection: 'row', padding: 12, flex: 1 }}>
											<View style={{ flex: 0.7, marginRight: 6 }}>
												<Text style={{ fontSize: 12, color: '#a9a8a8', fontFamily: Fonts.REGULAR }}>{items.description}</Text>
											</View>
											<View style={{ flex: 0.3, marginLeft: 6, alignItems: 'flex-end' }}>
												<View style={{ backgroundColor: '#18af7b', padding: 4, borderRadius: 3 }}>
													<Text style={{ fontSize: 10, color: Colors.WHITE, fontFamily: Fonts.REGULAR }}>{this.capitalizeFirstLetter(items.type)}</Text>
												</View>
												<View style={{ backgroundColor: '#697278', padding: 4, borderRadius: 3, marginTop: 4 }}>
													<Text style={{ fontSize: 10, color: Colors.WHITE, fontFamily: Fonts.REGULAR }}>{items.related_statuses.status ? this.capitalizeFirstLetter(items.related_statuses.status.name) : '-'}</Text>
												</View>
											</View>
										</View>
										<View style={{ borderTopWidth: 0.5, borderColor: Colors.BORDER, borderBottomWidth: 0.5, marginTop: 6, flexDirection: 'row', }}>
											<View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, borderColor: Colors.BORDER, borderRightWidth: 0.5 }}>
												{
													items.__meta__.is_like == 0 ?
														<Image style={{ height: 18, width: 18 }} resizeMode='contain' source={require('../../components/images/likeOutline.png')}></Image>
													:
														<Image style={{ height: 18, width: 18, tintColor: Colors.PRIMARY }} resizeMode='contain' source={require('../../components/images/likeSolid.png')}></Image>
												}
												<View style={{ marginLeft: 6 }}>
													<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>{items.__meta__.total_like}</Text>
													<Text style={{ fontSize: 10, color: Colors.GREY, fontFamily: Fonts.LIGHT }}>Suka</Text>
												</View>
											</View>
											<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 12, borderColor: Colors.BORDER, borderRightWidth: 0.5 }} onPress={() => Actions.comment()}>
												<Image style={{ height: 18, width: 18 }} resizeMode='contain' source={require('../../components/images/commentOutline.png')}></Image>
												<View style={{ marginLeft: 6 }}>
													<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>{items.__meta__.total_comments}</Text>
													<Text style={{ fontSize: 10, color: Colors.GREY, fontFamily: Fonts.LIGHT }}>Komentar</Text>
												</View>
											</TouchableOpacity>
										</View>
										<View style={{ padding: 12 }}>
											{ items.related_comments.length > 0 ?
													<View>
														{ items.related_comments.map((itemsComment) => (
																<View key={Math.random()} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
																	<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>{itemsComment.user.fullname}</Text>
																	<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.LIGHT, marginLeft: 4, width: '70%' }}>{itemsComment.review.comment}</Text>
																</View>
															))
														}
														<TouchableOpacity onPress={() => Actions.comment()}>
															<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.LIGHT, marginTop: 8 }}>Lihat komentar lainnya...</Text>
														</TouchableOpacity>
													</View>
												:
													null
											}
										</View>
									</View>
								))
							:
								<View style={{ alignItems: 'center' }}>
									<Text style={{ paddingTop: 20, fontSize: 15, color: Colors.PRIMARY }}>Belum ada laporan...</Text>
								</View>
					}
				</Content>
				<FooterBottom activeIndex={4} />
			</Container>
		);
	};
};