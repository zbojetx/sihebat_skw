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
	ImageBackground,
	ScrollView,
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
import moment from 'moment/min/moment-with-locales';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class EventList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search: '',
			eventData: [],
			eventDataNew: [],
			searchEvent: [],
			searchEv: {},
			eventCategoryData: [],
			refreshing: false
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
		this.getEventNew();
	};

	handleBackButton = () => {
		Actions.home();
		return true;
	};

	onRefresh() { 
		this.setState({refreshing: true}); 
		this.setState({
			page: 1
		}, () => {
			this.searchEvent();
		});
		setTimeout(() => {
			this.setState({refreshing: false});
		}, 2000);
	}

	getEventNew() {
		axios({
			method: 'GET',
			url: Config.API_URL + '/api/v1/event?terms&paginate=1&limit=3&top=false',
			data: {},
			timeout: 35000
		}).then((response) => {
			if (response.data.header.message == 'Success') {
				this.setState({
					eventDataNew: response.data.data.data
				})
				this.getEventCategory()
			}
		}).catch((error) => {
			Toast.message(error.data.header.reason.id);
			this.getEventCategory()
		});
	}

	getEvent() {
		axios({
			method: 'GET',
			url: Config.API_URL + '/api/v1/event?terms&paginate=1&limit=10&top=false',
			data: {},
			timeout: 35000
		}).then((response) => {
			if (response.data.header.message == 'Success') {
				this.setState({
					eventData: response.data.data.data.reverse()
				})
			}
		}).catch((error) => {
			Toast.message(error.data.header.reason.id);
		});
	}

	searchEvent(text){
		if(text.length > 2){ 
			axios({
				method: 'GET',
				url: Config.API_URL + '/api/v1/event?terms=' + text + '&paginate=1&limit=50&top=false',
				data: {},
				timeout: 35000
			}).then((response) => {
				if (response.data.header.message == 'Success') {
					this.setState({
						searchEvent: response.data.data.data,
						searchEv: response.data.data
					})
				}
				else {
					Toast.message(response.data.header.reason.id);
				}
			}).catch((error) => {
				Toast.message(error.data.header.reason.id);
			});
		}
		else {
			this.setState({
				searchPlace: []
			})
		}
	}

	getEventCategory() {
		axios({
			method: 'GET',
			url: Config.API_URL + '/api/v1/event/category?terms=&paginate=1&limit=10&parent=0',
			data: {},
			timeout: 35000
		}).then((response) => {
			if (response.data.header.message == 'Success') {
				this.setState({
					eventCategoryData: response.data.data.data
				})
				this.getEvent();
			}
		}).catch((error) => {
			Toast.message(error.data.header.reason.id);
			this.getEvent();
		});
	}

	formatDate(date) {
		return moment(date).format('DD MMM YYYY')
	}

	formatRupiah(currency) {
		let x = parseInt(currency);
		return 'Rp. '+ x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
	}

	eventList(item){
		return(
			<TouchableOpacity onPress={() => Actions.placeDetail({eventId: item.id, from: 'isFromCategoryList'})}>
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
						<Text style={{ fontSize: 18, color: Colors.WHITE, fontFamily: Fonts.REGULAR, marginLeft: 16 }}>Acara</Text>
					</Body>
					<Right/>
				</Header>
				<StatusBar barStyle="light-content" backgroundColor= {Colors.PRIMARY} />
				<Content style={{ backgroundColor: Colors.WHITE }}>
					<View style={{ backgroundColor: Colors.PRIMARY, paddingLeft: 16, paddingRight: 16, paddingBottom: 16 }}>
						<Item style={{ backgroundColor: '#e8a8ab', borderRadius: 4, height: 40 }}>
							<Image style={{ height: 20, width: 20, margin: 10, tintColor: Colors.WHITE }} resizeMode='cover' source={require('../../components/images/footer/search.png')}></Image>
							<Input style={{ fontFamily: Fonts.LIGHT, color: Colors.WHITE, fontSize: 16 }} placeholder="Cari acara ..." placeholderTextColor={Colors.WHITE} value={this.state.search} onChangeText={(value) => this.searchEvent(value) + this.setState({ search: value })} />
						</Item>
					</View>
					{
						this.state.search == '' ?
							<View>
								<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, marginLeft: 16, marginRight: 16 }}>
									<Text style={{ fontSize: 16, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Acara Terbaru</Text>
									{/* <TouchableOpacity onPress={() => Actions.eventJelajahi()}>
									<Text style={{ fontSize: 12, color: Colors.PRIMARY, fontFamily: Fonts.REGULAR }}>Lihat Semua</Text>
								</TouchableOpacity> */}
								</View>
								<View style={{ marginTop: 10 }}>
									<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
										{
											this.state.eventDataNew.map((items) => (
												<View style={{ padding: 16 }}>
													<TouchableOpacity style={styles.boxMenu} key={Math.random()} onPress={() => Actions.eventDetail({ eventId: items.id })}>
														<Image style={{ height: 150, width: 300, borderTopLeftRadius: 5, borderTopRightRadius: 5 }} resizeMode='cover' resizeMethod='scale' source={items.related_images[0].image.path != '' ? { uri: items.related_images[0].image.path } : require('../../components/images/placeholderLandscape.png')} />
														<View style={{ padding: 12 }}>
															<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>{items.title}</Text>
															<View style={{ flexDirection: 'row', marginTop: 16, flex: 1, alignItems: 'center' }}>
																<View style={{ flex: 0.6 }}>
																	<View style={{ flexDirection: 'row' }}>
																		<Icon name="calendar-alt" size={10} color={Colors.BLACK} />
																		<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginLeft: 8 }}>{this.formatDate(items.attributes[2].value.value)}</Text>
																	</View>
																	<View style={{ flexDirection: 'row', marginTop: 8 }}>
																		<Icon name="map-marker-alt" size={10} color={Colors.BLACK} />
																		<Text numberOfLines={1} style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginLeft: 8, width: 150 }}>{items.attributes[0].value.value}</Text>
																	</View>
																</View>
																<View style={{ flex: 0.4 }}>
																	<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>Harga mulai dari :</Text>
																	<Text style={{ fontSize: 14, color: '#f73d44', fontFamily: Fonts.MEDIUM, marginTop: 4 }}>{items.attributes[1].value.value != '' && items.attributes[1].value.value != null && items.attributes[1].value.value != '0' ? this.formatRupiah(items.attributes[1].value.value) : 'Gratis'}</Text>
																</View>
															</View>
														</View>
													</TouchableOpacity>
												</View>
											))
										}
									</ScrollView>
								</View>
								<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 16, marginRight: 16 }}>
									<Text style={{ fontSize: 16, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Jelajahi</Text>
									{/* <TouchableOpacity onPress={() => Actions.eventJelajahi()}>
										<Text style={{ fontSize: 12, color: Colors.PRIMARY, fontFamily: Fonts.REGULAR }}>Lihat Semua</Text>
									</TouchableOpacity> */}
								</View>
								<View style={{ marginTop: 16, marginBottom: 8 }}>
									<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
										<View style={{ margin: 8 }} />
										{
											this.state.eventCategoryData.map((items) => (
												<TouchableOpacity onPress={() => Actions.eventJelajahiList({ eventCategoryId: items.id, categoryName: items.name })} key={Math.random()}>
													<ImageBackground style={{ height: 150, width: 150, borderRadius: 8, marginRight: 16 }} imageStyle={{ borderRadius: 8 }} source={items.image != null ? { uri: items.image } : require('../../components/images/placeholderSquare.png')}>
														<View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', borderRadius: 8 }}>
															<View style={{ alignItems: 'center', justifyContent: 'center', padding: 20, flex: 1 }}>
																<Text style={{ fontSize: 18, color: Colors.WHITE, fontFamily: Fonts.BOLD }}>{items.name}</Text>
															</View>
														</View>
													</ImageBackground>
												</TouchableOpacity>
											))
										}
									</ScrollView>
								</View>

								<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, marginLeft: 16, marginRight: 16 }}>
									<Text style={{ fontSize: 16, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Semua Acara</Text>
									{/* <TouchableOpacity onPress={() => Actions.eventJelajahi()}>
							<Text style={{ fontSize: 12, color: Colors.PRIMARY, fontFamily: Fonts.REGULAR }}>Lihat Semua</Text>
						</TouchableOpacity> */}
								</View>
								<View style={{ padding: 16 }}>
									{
										this.state.eventData.map((items) => (
											<TouchableOpacity style={styles.boxMenu} key={Math.random()} onPress={() => Actions.eventDetail({ eventId: items.id })}>
												<Image style={{ height: 150, width: '100%', borderTopLeftRadius: 5, borderTopRightRadius: 5 }} resizeMode='cover' resizeMethod='scale' source={items.related_images[0].image.path != '' ? { uri: items.related_images[0].image.path } : require('../../components/images/placeholderLandscape.png')} />
												<View style={{ padding: 12 }}>
													<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>{items.title}</Text>
													<View style={{ flexDirection: 'row', marginTop: 16, flex: 1, alignItems: 'center' }}>
														<View style={{ flex: 0.6 }}>
															<View style={{ flexDirection: 'row' }}>
																<Icon name="calendar-alt" size={10} color={Colors.BLACK} />
																<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginLeft: 8 }}>{this.formatDate(items.attributes[2].value.value)}</Text>
															</View>
															<View style={{ flexDirection: 'row', marginTop: 8 }}>
																<Icon name="map-marker-alt" size={10} color={Colors.BLACK} />
																<Text numberOfLines={1} style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginLeft: 8, width: '90%' }}>{items.attributes[0].value.value}</Text>
															</View>
														</View>
														<View style={{ flex: 0.4 }}>
															<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>Harga mulai dari :</Text>
															<Text style={{ fontSize: 14, color: '#f73d44', fontFamily: Fonts.MEDIUM, marginTop: 4 }}>{items.attributes[1].value.value != '' && items.attributes[1].value.value != null && items.attributes[1].value.value != '0' ? this.formatRupiah(items.attributes[1].value.value) : 'Gratis'}</Text>
														</View>
													</View>
												</View>
											</TouchableOpacity>
										))
									}
								</View>
							</View>
							:
							<View>
								{
									this.state.searchEv.total == 0 ?
										<View style={{ alignItems: 'center', flex: 1, marginTop: 20 }}>
											<Text>Nama event tidak ditemukan</Text>
										</View>
										:
										<FlatList
											data={this.state.searchEvent}
											numColumns={1}
											extradata={false}
											onRefresh={this.onRefresh.bind(this)}
											refreshing={this.state.refreshing}
											renderItem={({ item }) => (
												this.eventList(item)
											)}
											keyExtractor={(item, index) => index.toString()}
										/>
								}
							</View>
					}
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
	}
});
