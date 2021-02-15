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
	FlatList
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
	Spinner,
	Tab,
	Tabs,
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
import moment from 'moment/min/moment-with-locales';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class PasswordForgot extends Component {
	constructor(props) {
		super(props);
		this.state = {
			myReportData: [],
			myPlaceData: [],
			refreshing: false,
			isLoadingReport: false,
			isLoadingPlace: false
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
				})
			}
			this.getMyReport();
			this.getMyPlace();
		});
	};

	handleBackButton = () => {
		Actions.profile();
		return true;
	};

	showLoadingPlace(loading) {
		this.setState({ isLoadingPlace: loading })
	};

	showLoadingReport(loading) {
		this.setState({ isLoadingReport: loading })
	};

	onRefresh() { 
		this.setState({refreshing: true}); 
		this.setState({
			page: 1
		}, () => {
			this.getPlaceCategory();
		});
		setTimeout(() => {
			this.setState({refreshing: false});
		}, 2000);
	}

	getMyReport(){
		this.showLoadingReport(true)
		axios({
			method: 'GET',
			url: Config.API_URL + '/api/v1/report/only/' + this.state.userId + '?terms=&paginate=1&limit=10',
			data: {},
			timeout: 35000
		}).then((response) => {
			if (response.data.header.message == 'Success') {
				this.setState({
					myReportData: response.data.data.data
				})
				this.showLoadingReport(false)
			}
		}).catch((error) => {
			this.showLoadingReport(false)
			Toast.message(error.response.data.header.reason.id);
		});
	}

	getMyPlace(){
		this.showLoadingPlace(true)
		axios({
			method: 'GET',
			url: Config.API_URL + '/api/v1/place/bookmarked/' + this.state.userId +'?terms=&paginate=1&limit=10',
			data: {},
			timeout: 35000
		}).then((response) => {
			if (response.data.header.message == 'Success') {
				this.setState({
					myPlaceData: response.data.data.data
				})
				this.showLoadingPlace(false)
			}
		}).catch((error) => {
			this.showLoadingPlace(false)
			Toast.message(error.response.data.header.reason.id);
		});
	}

	formatDate(date) {
		return moment(date).format('DD MMM YYYY, HH:mm A')
	}

	placeList(item){
		return(
			<TouchableOpacity onPress={() => Actions.placeDetail({placeId: item.id})}>
				<View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, padding: 16 }}>
					<View style={{ flex: 0.3, justifyContent: 'center' }}>
						<Image style={{ height: 75, width: '100%', borderRadius: 4 }} resizeMode='cover' resizeMethod='scale' source={item.related_images[0].image.path != '' ? { uri: item.related_images[0].image.path } : require('../../components/images/placeholderSquare.png')} />
					</View>
					<View style={{ marginLeft: 20, flex: 0.7 }}>
						<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>{item.title}</Text>
						<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.LIGHT, marginTop: 4 }}>{item.attributes[0].value.value}</Text>
					</View>
				</View>
				<View style={{ height: 1, backgroundColor: Colors.BORDER }}></View>
			</TouchableOpacity>
		)
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
						<Text style={{ fontSize: 18, color: Colors.WHITE, fontFamily: Fonts.REGULAR, marginLeft: 16 }}>Arsip</Text>
					</Body>
					<Right/>
				</Header>
				<StatusBar barStyle="light-content" backgroundColor= {Colors.PRIMARY} />
				<Content style={{ backgroundColor: Colors.WHITE }}>
					<Tabs tabBarUnderlineStyle={{ borderColor: Colors.PRIMARY, borderBottomWidth: 1 }} style={{ borderColor: '#979797', borderBottomWidth: 0.3 }}>
						<Tab heading="Laporan" tabStyle={{ backgroundColor: Colors.WHITE }} textStyle={{ color: '#7e7674', fontSize: 14, fontFamily: Fonts.LIGHT }} activeTabStyle={{ backgroundColor: Colors.WHITE }} activeTextStyle={{ color: Colors.PRIMARY, fontSize: 14, fontFamily: Fonts.REGULAR }}>
							{
								this.state.isLoadingReport ? 
									<Spinner color={Colors.PRIMARY} />
								:
								this.state.myReportData.length > 0 ?
								this.state.myReportData.map((items) => (
									<View style={{ borderTopWidth: 1, borderColor: Colors.BORDER, borderBottomWidth: 1, marginBottom: 16 }} key={Math.random()}>
										<View style={{ flexDirection: 'row', padding: 12, justifyContent: 'space-between', alignItems: 'center' }}>
											<View style={{ flexDirection: 'row', alignItems: 'center' }}>
												<Image style={{ height: 40, width: 40 }} resizeMode='cover' source={require('../../components/images/avatar.png')}></Image>
												<View style={{ marginLeft: 20 }}>
													<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>{items.user.fullname}</Text>
													{
														items.related_address.address.updated_at != null ?
															<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.LIGHT }}>{this.formatDate(items.related_address.address.updated_at)}</Text>
															:
															<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.LIGHT }}>{this.formatDate(items.related_address.address.created_at)}</Text>
													}
													<View style={{ flexDirection: 'row', marginTop: 2 }}>
														<Icon name="map-marker-alt" size={10} color={'#3d619b'} />
														<Text style={{ fontSize: 12, color: '#3d619b', fontFamily: Fonts.LIGHT, marginLeft: 5, textDecorationLine: 'underline' }}>{items.related_address.address.street_1}</Text>
													</View>
												</View>
											</View>
											<View>
												<Image style={{ height: 40, width: 40 }} resizeMode='cover' source={require('../../components/images/iconCategoryLapor.png')}></Image>
											</View>
										</View>
										<Image style={{ height: 200 }} resizeMode='cover' source={items.related_images[0].image.path != '' ? { uri: items.related_images[0].image.path } : require('../../components/images/placeholderSquare.png')}></Image>
										<View style={{ flexDirection: 'row', padding: 12, flex: 1 }}>
											<View style={{ flex: 0.7, marginRight: 6 }}>
												<Text style={{ fontSize: 12, color: '#a9a8a8', fontFamily: Fonts.REGULAR }}>{items.description}</Text>
											</View>
											<View style={{ flex: 0.3, marginLeft: 6, alignItems: 'flex-end' }}>
												<View style={{ backgroundColor: items.type == 'aduan' ? '#18af7b' : '#697278', padding: 4, borderRadius: 3 }}>
													<Text style={{ fontSize: 10, color: Colors.WHITE, fontFamily: Fonts.REGULAR }}>Aduan</Text>
												</View>
												<View style={{ backgroundColor: '#697278', padding: 4, borderRadius: 3, marginTop: 4 }}>
													<Text style={{ fontSize: 10, color: Colors.WHITE, fontFamily: Fonts.REGULAR }}>Tertunda</Text>
												</View>
											</View>
										</View>
										<View style={{ borderTopWidth: 0.5, borderColor: Colors.BORDER, borderBottomWidth: 0.5, marginTop: 6, flexDirection: 'row', }}>
											<View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, borderColor: Colors.BORDER, borderRightWidth: 0.5 }}>
												<Image style={{ height: 18, width: 18 }} resizeMode='contain' source={require('../../components/images/likeOutline.png')}></Image>
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
										{
										items.__meta__.total_comments != 0 ?
											<View>
												<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
													<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>{items.related_comments[0].user.fullname}</Text>
													<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.LIGHT, marginLeft: 4, width: '70%' }}>{items.related_comments[0].review.comment}</Text>
												</View>
												{
													items.__meta__.total_comments > 1 ? 
														<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
															<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>{items.related_comments[1].user.fullname}</Text>
															<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.LIGHT, marginLeft: 4, width: '70%' }}>{items.related_comments[1].review.comment}</Text>
														</View>
													:
													null
												}
												<TouchableOpacity onPress={() => Actions.comment()}>
													<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.LIGHT, marginTop: 8 }}>Lihat komentar lainnya...</Text>
												</TouchableOpacity>
											</View>
										: null
									}
									</View>
								))
								:
									<View style={{ alignItems: 'center', height: '100%' }}>
										<Text style={{ paddingTop: 20, fontSize: 15, color: Colors.PRIMARY }}>Belum ada bookmark laporan...</Text>
									</View>
							}
						</Tab>
						<Tab heading="Tempat" tabStyle={{ backgroundColor: Colors.WHITE }} textStyle={{ color: '#7e7674', fontSize: 14, fontFamily: Fonts.LIGHT }} activeTabStyle={{ backgroundColor: Colors.WHITE }} activeTextStyle={{ color: Colors.PRIMARY, fontSize: 14, fontFamily: Fonts.REGULAR }}>
							{
								this.state.isLoadingPlace ?
									<Spinner color={Colors.PRIMARY} />
								:
								this.state.myPlaceData.length > 0 ?
									<FlatList
										data={this.state.myPlaceData}
										numColumns={1}
										extradata={false}
										onRefresh={this.onRefresh.bind(this)}
										refreshing={this.state.refreshing}
										renderItem={({ item }) => (
											this.placeList(item)
										)}
										keyExtractor={(item, index) => index.toString()}
									/>
								:
									<View style={{ alignItems: 'center', height: '100%' }}>
										<Text style={{ paddingTop: 20, fontSize: 15, color: Colors.PRIMARY }}>Belum ada bookmark tempat...</Text>
									</View>
							}
						</Tab>
						{/* <Tab heading="Acara" tabStyle={{ backgroundColor: Colors.WHITE }} textStyle={{ color: '#7e7674', fontSize: 14, fontFamily: Fonts.LIGHT }} activeTabStyle={{ backgroundColor: Colors.WHITE }} activeTextStyle={{ color: Colors.PRIMARY, fontSize: 14, fontFamily: Fonts.REGULAR }}>
							<View style={{ padding: 16 }}>
								<TouchableOpacity style={styles.boxMenu} key={Math.random()} onPress={() => Actions.eventDetail()}>
									<Image style={{ height: 150, width: '100%', borderTopLeftRadius: 5, borderTopRightRadius: 5 }} resizeMode='cover' resizeMethod='scale' source={require('../../components/images/acara/acara1.jpg')} />
									<View style={{ padding: 12 }}>
										<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Cap Go Meh Singkawang 2019</Text>
										<View style={{ flexDirection: 'row', marginTop: 16, flex: 1, alignItems: 'center' }}>
											<View style={{ flex: 0.6 }}>
												<View style={{ flexDirection: 'row' }}>
													<Icon name="calendar-alt" size={10} color={Colors.BLACK} />
													<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginLeft: 8 }}>5 November 2019</Text>
												</View>
												<View style={{ flexDirection: 'row', marginTop: 8 }}>
													<Icon name="map-marker-alt" size={10} color={Colors.BLACK} />
													<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginLeft: 8 }}>Lapangan Singkawang</Text>
												</View>
											</View>
											<View style={{ flex: 0.4 }}>
												<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>Harga mulai dari :</Text>
												<Text style={{ fontSize: 14, color: '#f73d44', fontFamily: Fonts.MEDIUM, marginTop: 4 }}>Rp 60.000</Text>
											</View>
										</View>
									</View>
								</TouchableOpacity>
							</View>
						</Tab> */}
					</Tabs>
				</Content>
			</Container>
		);
	};
};

const styles = StyleSheet.create({
	boxMenu: {
		shadowColor: Colors.BLACK,
		shadowOpacity: 0.8,
		elevation: 2,
		backgroundColor: Colors.WHITE,
		borderRadius: 5,
		marginBottom: 16
	},
	flatlistCard: {
		height:'100%',
		marginBottom: 15,
	}
});
