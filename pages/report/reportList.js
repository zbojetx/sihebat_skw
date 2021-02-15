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
	ImageBackground,
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
	Toast
} from 'teaset';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Colors from '../../components/colors';
import Fonts from '../../components/fonts';
import {Actions} from 'react-native-router-flux';
import axios from 'axios';
import Config from '../../config.js';
import moment from 'moment/min/moment-with-locales';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class ReportList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			reportData: [],
			userId: '',
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
	};

	handleBackButton = () => {
		Actions.home();
		return true;
	};

	showLoadingReport(loading) {
		this.setState({ isLoadingReport: loading })
	};

	getReport(userId) {
		this.showLoadingReport(true)
		if(userId == 0) {
			axios({
				method: 'GET',
				url: Config.API_URL + '/api/v1/report?terms=&paginate=1&limit=100',
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
				url: Config.API_URL + '/api/v1/report?terms=&paginate=1&limit=100&user='+userId,
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
					<Left style={{ flex: 0 }}>
						<Button transparent onPress={() => this.handleBackButton()}>
							<Image style={{ height: 18, width: 18, tintColor: Colors.WHITE }} resizeMode='contain' source={require('../../components/images/back.png')}></Image>
						</Button>
					</Left>
					<Body>
						<Text style={{ fontSize: 18, color: Colors.WHITE, fontFamily: Fonts.REGULAR, marginLeft: 16 }}>Laporan</Text>
					</Body>
					<Right/>
				</Header>
				<StatusBar barStyle="light-content" backgroundColor= {Colors.PRIMARY} />
				<Content style={{ backgroundColor: Colors.BACKGROUND }}>
					{
						this.state.isLoadingReport ?
							<Spinner color={Colors.PRIMARY} />
						:
							this.state.reportData.length > 0 ?
								this.state.reportData.map((items) => (
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
												{/* <Image style={{ height: 40, width: 40 }} resizeMode='cover' source={require('../../components/images/iconCategoryLapor.png')}></Image> */}
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
														<TouchableOpacity onPress={() => this.state.userId == '' ? Actions.login() : this.isLike(items.id, true)}>
															<Image style={{ height: 18, width: 18 }} resizeMode='contain' source={require('../../components/images/likeOutline.png')}></Image>
														</TouchableOpacity>
														:
														<TouchableOpacity onPress={() => this.state.userId == '' ? Actions.login() : this.isLike(items.id, false)}>
															<Image style={{ height: 18, width: 18, tintColor: Colors.PRIMARY }} resizeMode='contain' source={require('../../components/images/likeSolid.png')}></Image>
														</TouchableOpacity>
												}
												<View style={{ marginLeft: 6 }}>
													<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>{items.__meta__.total_like}</Text>
													<Text style={{ fontSize: 10, color: Colors.GREY, fontFamily: Fonts.LIGHT }}>Suka</Text>
												</View>
											</View>
											<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 12, borderColor: Colors.BORDER, borderRightWidth: 0.5 }} onPress={() => this.state.userId == '' ? Actions.login() : Actions.reportComment({ from: 'reportList', comment: items.related_comments, description: items.description, createdAt: items.created_at, objectId: items.id })}>
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
														<TouchableOpacity onPress={() => this.state.userId == '' ? Actions.login() : Actions.reportComment({ from: 'reportList' ,comment: items.related_comments, description: items.description, createdAt: items.created_at, objectId: items.id })}>
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
			</Container>
		);
	};
};
