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
	ScrollView
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
	Toast,
	Carousel
} from 'teaset';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FooterBottom from '../components/footer';
import Colors from '../components/colors';
import Fonts from '../components/fonts';
import {Actions} from 'react-native-router-flux';
import axios from 'axios';
import Config from '../config.js';
import moment from 'moment/min/moment-with-locales';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			bannerData: [],
			placeData: [],
			culinaryData: [],
			eventData: [],
			reportData: [],
			userId: '',
			isLoadingBanner: false,
			isLoadingPlace: false,
			isLoadingCulinary: false,
			isLoadingEvent: false,
			isLoadingNews: false,
			isLoadingReport: false
		};
	};

	componentWillMount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
		AsyncStorage.getItem('user', (error, result) => {
			if (result) {
				let resultParsed = JSON.parse(result)
				this.setState({
					userId: resultParsed.token.user_id
				})
				this.getReport(resultParsed.token.user_id);
			} else {
				this.getReport(0);
			}
		});
	};

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
	};

	componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
		this.getBanner();
		this.getPlaces();
		this.getCulinary();
		this.getEvent();
		this.getNews();
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

	showLoadingBanner(loading) {
		this.setState({ isLoadingBanner: loading })
	};

	showLoadingPlace(loading) {
		this.setState({ isLoadingPlace: loading })
	};

	showLoadingCulinary(loading) {
		this.setState({ isLoadingCulinary: loading })
	};

	showLoadingEvent(loading) {
		this.setState({ isLoadingEvent: loading })
	};

	showLoadingNews(loading) {
		this.setState({ isLoadingNews: loading })
	};

	showLoadingReport(loading) {
		this.setState({ isLoadingReport: loading })
	};

	getBanner() {
		this.showLoadingBanner(true)
		axios({
			method: 'GET',
			url: Config.API_URL + '/api/v1/banner?terms=&paginate=1&limit=10',
			data: {},
			timeout: 35000
		}).then((response) => {
			if (response.data.header.message == 'Success') {
				this.setState({
					bannerData: response.data.data.data
				})
				this.showLoadingBanner(false)
			} else {
				this.showLoadingBanner(false)
				Toast.message(response.data.header.reason.id);
			}
		}).catch((error) => {
			this.showLoadingBanner(false)
			Toast.message(error.response.data.header.reason.id);
		});
	}

	getPlaces() {
		this.showLoadingPlace(true)
		axios({
			method: 'GET',
			url: Config.API_URL + '/api/v1/place?terms&paginate=1&limit=5&top=true',
			data: {},
			timeout: 35000
		}).then((response) => {
			if (response.data.header.message == 'Success') {
				this.setState({
					placeData: response.data.data.data
				})
				this.showLoadingPlace(false)
			} else {
				this.showLoadingPlace(false)
				Toast.message(response.data.header.reason.id);
			}
		}).catch((error) => {
			this.showLoadingPlace(false)
			Toast.message(error.response.data.header.reason.id);
		});
	}

	getCulinary() {
		this.showLoadingCulinary(true)
		axios({
			method: 'GET',
			url: Config.API_URL + '/api/v1/culinary?paginate=1&limit=5&top=true',
			data: {},
			timeout: 35000
		}).then((response) => {
			if (response.data.header.message == 'Success') {
				this.setState({
					culinaryData: response.data.data.data
				})
				this.showLoadingCulinary(false)
			} else {
				this.showLoadingCulinary(false)
				Toast.message(response.data.header.reason.id);
			}
		}).catch((error) => {
			this.showLoadingCulinary(false)
			Toast.message(error.response.data.header.reason.id);
		});
	}

	getEvent() {
		this.showLoadingEvent(true)
		axios({
			method: 'GET',
			url: Config.API_URL + '/api/v1/event?terms&paginate=1&limit=5&top=false',
			data: {},
			timeout: 35000
		}).then((response) => {
			if (response.data.header.message == 'Success') {
				this.setState({
					eventData: response.data.data.data
				})
				this.showLoadingEvent(false)
			} else {
				this.showLoadingEvent(false)
				Toast.message(response.data.header.reason.id);
			}
		}).catch((error) => {
			this.showLoadingEvent(false)
			Toast.message(error.response.data.header.reason.id);
		});
	}

	getNews() {
		this.showLoadingNews(false)
	}

	getReport(userId) {
		this.showLoadingReport(true)
		if(userId == 0) {
			axios({
				method: 'GET',
				url: Config.API_URL + '/api/v1/report?terms=&paginate=1&limit=5',
				data: {},
				timeout: 35000
			}).then((response) => {
				if (response.data.header.message == 'Success') {
					this.setState({
						reportData: response.data.data.data
					})
					this.showLoadingReport(false)
				} else {
					this.showLoadingReport(false)
					Toast.message(response.data.header.reason.id);
				}
			}).catch((error) => {
				this.showLoadingReport(false)
				Toast.message(error.response.data.header.reason.id);
			});
		} else {
			axios({
				method: 'GET',
				url: Config.API_URL + '/api/v1/report?terms=&paginate=1&limit=5&user='+userId,
				data: {},
				timeout: 35000
			}).then((response) => {
				if (response.data.header.message == 'Success') {
					this.setState({
						reportData: response.data.data.data
					})
					this.showLoadingReport(false)
				} else {
					this.showLoadingReport(false)
					Toast.message(response.data.header.reason.id);
				}
			}).catch((error) => {
				this.showLoadingReport(false)
				Toast.message(error.response.data.header.reason.id);
			});
		}
	}

	isLike(reportId, likeStatus){
		axios({
			method: 'PUT',
			url: Config.API_URL + '/api/v1/report/like',
			data: {
				object_id: reportId,
				status: likeStatus,
				user_id: this.state.userId
			},
			timeout: 35000
		}).then((response) => {
			if (response.data.header.message == 'Success') {
				this.getReport(this.state.userId)
			} else {
				Toast.message(response.data.header.reason.id);
			}
		}).catch((error) => {
			Toast.message(error.response.data.header.reason.id);
		});
	}

	formatDate(date) {
		return moment(date).format('DD MMM YYYY, HH:mm A')
	}

	capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	render() {
		return(
			<Container>
				<Header style={{ backgroundColor: Colors.PRIMARY }}>
					<Left>
						<Image style={{ height: 100, width: 125, tintColor: Colors.WHITE }} resizeMode='contain' source={require('../components/images/logoLandscape.png')}></Image>
					</Left>
					<Body />
					<Right style={{ marginRight: 5 }}>
						<TouchableOpacity style={{ width: 25, height: 25 }} onPress={() => Actions.notification()}>
							<Image style={{ height: 20, width: 20, tintColor: Colors.WHITE }} resizeMode='contain' source={require('../components/images/notification.png')}></Image>
						</TouchableOpacity>
					</Right>
				</Header>
				<StatusBar barStyle="light-content" backgroundColor= {Colors.PRIMARY} />
				<Content>
					{
						this.state.isLoadingBanner ?
							null
						:
							<Carousel
								style={{ height: 200, marginBottom: 8 }}
								control={
									<Carousel.Control
									style={{ alignItems: 'center', justifyContent:'flex-end' }}
									dot={<Text style={{ backgroundColor: 'rgba(0, 0, 0, 0)', color: Colors.WHITE, padding: 4 }}>○</Text>}
									activeDot={<Text style={{ backgroundColor: 'rgba(0, 0, 0, 0)', color: Colors.WHITE, padding: 4 }}>●</Text>}
									/>
								}
							>
								{
									this.state.bannerData.map((items) => (
										<TouchableOpacity key={Math.random()} onPress={() => Actions.bannerDetail({ bannerImage: items.image, bannerTitle: items.title, bannerDesc: items.description })}>
											<Image style={{ width: width, height: 200 }} resizeMode='cover' source={items.image != '' ? { uri: items.image } : require('../components/images/placeholderLandscape.png')} />
										</TouchableOpacity>
									))
								}
							</Carousel>
					}

					<View style={styles.boxMenuPrimary}>
						<TouchableOpacity style={styles.boxMenu} onPress={() => Actions.reportList()}>
							<Image style={{ height: 45, width: 45 }} resizeMode='cover' source={require('../components/images/menuLaporan.png')}></Image>
							<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 12 }}>Laporan</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.boxMenu} onPress={() => Actions.placeList()}>
							<Image style={{ height: 45, width: 45 }} resizeMode='cover' source={require('../components/images/menuTempat.png')}></Image>
							<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 12 }}>Tempat</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.boxMenu} onPress={() => Actions.culinaryList()}>
							<Image style={{ height: 45, width: 45 }} resizeMode='cover' source={require('../components/images/menuKuliner.png')}></Image>
							<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 12 }}>Kuliner</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.boxMenuPrimary}>
						<TouchableOpacity style={styles.boxMenu} onPress={() => Actions.eventList()}>
							<Image style={{ height: 45, width: 45 }} resizeMode='cover' source={require('../components/images/menuAcara.png')}></Image>
							<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 12 }}>Acara</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.boxMenu} onPress={() => Actions.newsList()}>
							<Image style={{ height: 45, width: 45 }} resizeMode='cover' source={require('../components/images/menuBerita.png')}></Image>
							<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 12 }}>Berita</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.boxMenu} onPress={() => Actions.infoPanganList()}>
							<Image style={{ height: 45, width: 45 }} resizeMode='cover' source={require('../components/images/menuInfoPangan.png')}></Image>
							<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 12 }}>Info Pangan</Text>
						</TouchableOpacity>
					</View>

					{
						this.state.isLoadingPlace ?
							null
						:
							this.state.placeData.length > 0 ?
								<View>
									<View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 16, paddingRight: 16, paddingBottom: 8, marginTop: 12 }}>
										<Text style={{ fontSize: 16, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Tempat Populer</Text>
										<TouchableOpacity onPress={() => Actions.placeList()}>
											<Text style={{ fontSize: 12, color: Colors.PRIMARY, fontFamily: Fonts.REGULAR }}>Lihat Semua</Text>
										</TouchableOpacity>
									</View>
									<View style={{ padding: 8 }}>
										<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
											{ this.state.placeData.map((items) => (
													<TouchableOpacity style={styles.boxPopuler} key={Math.random()} onPress={() => Actions.placeDetail({placeId: items.id})}>
														<Image style={{ height: 100, width: 130, borderTopLeftRadius: 5, borderTopRightRadius: 5 }} resizeMode='cover' resizeMethod='scale' source={items.related_images[0].image.path != '' ? { uri: items.related_images[0].image.path } : require('../components/images/placeholderSquare.png')} />
														<View style={{ padding: 6 }}>
															<Text numberOfLines={1} style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>{items.title}</Text>
															<Text numberOfLines={3} style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 6 }}>{items.attributes[0].value.value}</Text>
														</View>
													</TouchableOpacity>
												))
											}
										</ScrollView>
									</View>
								</View>
							:
								null
					}

					{
						this.state.isLoadingCulinary ?
							null
						:
							this.state.culinaryData.length > 0 ?
								<View>
									<View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 16, paddingRight: 16, paddingBottom: 8, marginTop: 12 }}>
										<Text style={{ fontSize: 16, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Kuliner Populer</Text>
										<TouchableOpacity onPress={() => Actions.culinaryList()}>
											<Text style={{ fontSize: 12, color: Colors.PRIMARY, fontFamily: Fonts.REGULAR }}>Lihat Semua</Text>
										</TouchableOpacity>
									</View>
									<View style={{ padding: 8 }}>
										<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
											{ this.state.culinaryData.map((items) => (
													<TouchableOpacity style={styles.boxPopuler} key={Math.random()}>
														<Image style={{ height: 100, width: 130, borderTopLeftRadius: 5, borderTopRightRadius: 5 }} resizeMode='cover' resizeMethod='scale' source={items.related_images[0].image.path != '' ? { uri: items.related_images[0].image.path } : require('../components/images/placeholderSquare.png')} />
														<View style={{ padding: 6 }}>
															<Text numberOfLines={1} style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>{items.title}</Text>
															<Text numberOfLines={3} style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 6 }}>{items.attributes[0].value.value}</Text>
														</View>
													</TouchableOpacity>
												))
											}
										</ScrollView>
									</View>
								</View>
							:
								null
					}

					{
						this.state.isLoadingEvent ?
							null
						:
							this.state.eventData.length > 0 ?
								<View>
									<View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 16, paddingRight: 16, paddingBottom: 8, marginTop: 12 }}>
										<Text style={{ fontSize: 16, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Acara Terbaru</Text>
										<TouchableOpacity onPress={() => Actions.eventList()}>
											<Text style={{ fontSize: 12, color: Colors.PRIMARY, fontFamily: Fonts.REGULAR }}>Lihat Semua</Text>
										</TouchableOpacity>
									</View>
									<View style={{ padding: 8 }}>
										<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
											{
												this.state.eventData.map((items) => (
													<TouchableOpacity style={styles.boxPopuler} key={Math.random()}>
														<Image style={{ height: 100, width: 130, borderTopLeftRadius: 5, borderTopRightRadius: 5 }} resizeMode='cover' resizeMethod='scale' source={items.related_images[0].image.path != '' ? { uri: items.related_images[0].image.path } : require('../components/images/placeholderSquare.png')} />
														<View style={{ padding: 6 }}>
															<Text numberOfLines={1} style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>{items.title}</Text>
															<Text numberOfLines={3} style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 6 }}>{items.attributes[0].value.value}</Text>
														</View>
													</TouchableOpacity>
												))
											}
										</ScrollView>
									</View>
								</View>
							:
								null
					}

					<View>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 16, paddingRight: 16, paddingBottom: 8, marginTop: 12 }}>
							<Text style={{ fontSize: 16, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Berita Terbaru</Text>
							<TouchableOpacity onPress={() => Actions.newsList()}>
								<Text style={{ fontSize: 12, color: Colors.PRIMARY, fontFamily: Fonts.REGULAR }}>Lihat Semua</Text>
							</TouchableOpacity>
						</View>
						<View style={{ padding: 8 }}>
							<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
								<TouchableOpacity style={styles.boxPopuler} key={Math.random()}>
									<Image style={{ height: 100, width: 130, borderTopLeftRadius: 5, borderTopRightRadius: 5 }} resizeMode='cover' resizeMethod='scale' source={require('../components/images/berita/berita1.jpg')} />
									<View style={{ padding: 6 }}>
										<Text numberOfLines={1} style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Klarifikasi Sinka Zoo Singkawang soal Viral Beruang Madu Kurus</Text>
										<Text numberOfLines={2} style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 6 }}>Pengelola Sinka Zoo, Tanjung Bajau Singkawang akhirnya memberikan keterangan.</Text>
									</View>
								</TouchableOpacity>
								<TouchableOpacity style={styles.boxPopuler} key={Math.random()}>
									<Image style={{ height: 100, width: 130, borderTopLeftRadius: 5, borderTopRightRadius: 5 }} resizeMode='cover' resizeMethod='scale' source={require('../components/images/berita/berita2.jpg')} />
									<View style={{ padding: 6 }}>
										<Text numberOfLines={1} style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Festival Seni Singkawang Agora, Eksplorasi dan Berkreasi di Ruang Terbuka</Text>
										<Text numberOfLines={2} style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 6 }}>Berekspresi lewat seni dapat diwujudkan dalam beragam cara dan memakai media tak terduga.</Text>
									</View>
								</TouchableOpacity>
								<TouchableOpacity style={styles.boxPopuler} key={Math.random()}>
									<Image style={{ height: 100, width: 130, borderTopLeftRadius: 5, borderTopRightRadius: 5 }} resizeMode='cover' resizeMethod='scale' source={require('../components/images/berita/berita3.jpg')} />
									<View style={{ padding: 6 }}>
										<Text numberOfLines={1} style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Pembangunan Bandara Singkawang Dimulai</Text>
										<Text numberOfLines={2} style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 6 }}>Ditjen Perhubungan Udara Kementerian Perhubungan akan mengawal pembangunan Bandar Udara Singkawang.</Text>
									</View>
								</TouchableOpacity>
								<TouchableOpacity style={styles.boxPopuler} key={Math.random()}>
									<Image style={{ height: 100, width: 130, borderTopLeftRadius: 5, borderTopRightRadius: 5 }} resizeMode='cover' resizeMethod='scale' source={require('../components/images/berita/berita4.jpg')} />
									<View style={{ padding: 6 }}>
										<Text numberOfLines={1} style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Singkawang Kota Paling Toleran di Indonesia</Text>
										<Text numberOfLines={2} style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 6 }}>Setara Institute menetapkan Kota Singkawang sebagai peringkat pertama kota toleran di Indonesia 2018.</Text>
									</View>
								</TouchableOpacity>
							</ScrollView>
						</View>
					</View>

					{
						this.state.isLoadingReport ?
							null
						:
							this.state.reportData.length > 0 ?
								<View>
									<View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 16, paddingRight: 16, paddingBottom: 16 }}>
										<Text style={{ fontSize: 16, color: Colors.BLACK, fontFamily: Fonts.MEDIUM, marginTop: 12 }}>Laporan Terbaru</Text>
										<TouchableOpacity onPress={() => Actions.reportList()}>
											<Text style={{ fontSize: 12, color: Colors.PRIMARY, fontFamily: Fonts.REGULAR, marginTop: 13 }}>Lihat Semua</Text>
										</TouchableOpacity>
									</View>
									{
										this.state.reportData.map((items) => (
											<View style={{ borderTopWidth: 1, borderColor: Colors.BORDER, borderBottomWidth: 1, marginBottom: 16, backgroundColor: Colors.WHITE }} key={Math.random()}>
												<View style={{ flexDirection: 'row', padding: 12, justifyContent: 'space-between', alignItems: 'center' }}>
													<View style={{ flexDirection: 'row', alignItems: 'center' }}>
														<Image style={{ height: 40, width: 40 }} resizeMode='cover' source={require('../components/images/avatar.png')}></Image>
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
														<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 2 }}></Text>
													</View>
												</View>
												{
													items.related_images.length > 0 ?
														items.related_images[0].image.path != null ?
															<Image style={{ height: 200, width: width }} resizeMode='cover' source={{ uri: items.related_images[0].image.path }} />
														:
															<Image style={{ height: 200, width: width }} resizeMode='cover' source={require('../components/images/placeholderLandscape.png')} />
													:
														<Image style={{ height: 200, width: width }} resizeMode='cover' source={require('../components/images/placeholderLandscape.png')} />
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
																<TouchableOpacity onPress={() => this.state.userId == '' ? Actions.login() : this.isLike(items.id, true)}>
																	<Image style={{ height: 18, width: 18 }} resizeMode='contain' source={require('../components/images/likeOutline.png')}></Image>
																</TouchableOpacity>
															:
																<TouchableOpacity onPress={() => this.state.userId == '' ? Actions.login() : this.isLike(items.id, false)}>
																	<Image style={{ height: 18, width: 18, tintColor: Colors.PRIMARY }} resizeMode='contain' source={require('../components/images/likeSolid.png')}></Image>
																</TouchableOpacity>
														}
														<View style={{ marginLeft: 6 }}>
															<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>{items.__meta__.total_like}</Text>
															<Text style={{ fontSize: 10, color: Colors.GREY, fontFamily: Fonts.LIGHT }}>Suka</Text>
														</View>
													</View>
													<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 12, borderColor: Colors.BORDER, borderRightWidth: 0.5 }} onPress={() => this.state.userId == '' ? Actions.login() : Actions.reportComment({ comment: items.related_comments, description: items.description, createdAt: items.created_at, objectId: items.id })}>
														<Image style={{ height: 18, width: 18 }} resizeMode='contain' source={require('../components/images/commentOutline.png')}></Image>
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
																<TouchableOpacity onPress={() => this.state.userId == '' ? Actions.login() : Actions.reportComment({ comment: items.related_comments, description: items.description, createdAt: items.created_at, objectId: items.id })}>
																	<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.LIGHT, marginTop: 8 }}>Lihat komentar lainnya...</Text>
																</TouchableOpacity>
															</View>
														:
															null
													}
												</View>
											</View>
										))
									}
								</View>
							:
								null
					}

				</Content>
				<FooterBottom activeIndex={0} />
			</Container>
		);
	};
};

const styles = StyleSheet.create({
	boxMenuPrimary: {
		flexDirection: 'row',
		paddingTop: 8,
		paddingRight: 16,
		paddingBottom: 8,
		paddingLeft: 16,
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	boxMenu: {
		flex: 0.3,
		alignItems: 'center',
		shadowColor: Colors.BLACK,
		shadowOpacity: 0.8,
		elevation: 2,
		backgroundColor: Colors.WHITE,
		borderRadius: 5,
		padding: 15
	},
	boxPopuler: {
		width: 130,
		height: 180,
		shadowColor: Colors.BLACK,
		shadowOpacity: 0.8,
		elevation: 2,
		backgroundColor: Colors.WHITE,
		borderRadius: 5,
		marginLeft: 8,
		marginRight: 8,
		marginBottom: 5
	}
});
