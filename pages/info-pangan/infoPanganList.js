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
import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import Config from '../../config.js';
import moment from 'moment/min/moment-with-locales';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class InfoPanganList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search: '',
			informationData: []
		};
	};

	componentWillMount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
		this.getInformation()
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

	getInformation() {
		axios({
			method: 'GET',
			url: Config.API_URL + '/api/v1/information?terms=&paginate=1&limit=10',
			data: {},
			timeout: 35000
		}).then((response) => {
			console.log(response);
			if (response.data.header.message == 'Success') {
				this.setState({
					informationData: response.data.data.data
				})
			}
		}).catch((error) => {
			this.showLoading(false);
			Toast.message(error.data.header.reason.id);
		});
	}

	formatRupiah(currency) {
		let x = parseInt(currency);
		return 'Rp. ' + x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
	}

	cardBox(item) {
		return (
			// jangan lupa ntar ini ada onPress={() => Actions.infoPanganDetail()}
			<TouchableOpacity style={styles.boxMenuLeft} onPress={() => Actions.infoPanganDetail()}>
				<View style={{ flex: 0.4 }}>
					<Image style={{ height: 100, width: '100%', borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }} resizeMode='cover' source={item.related_images[0].image.path != '' ? { uri: item.related_images[0].image.path } : require('../../components/images/noImage.png')}></Image>
				</View>
				<View style={{ flex: 0.6, height: 100, alignItems: 'center', justifyContent: 'space-between', padding: 8 }}>
					<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.LIGHT, textAlign: 'center' }}>{item.title}</Text>
					<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>
						{
							item.new_records.length != 0 && item.previous_records != 0
								?
								this.formatRupiah(item.new_records[0].record.price)
								:
								item.new_records.length == 0 && item.previous_records != 0 ?
									this.formatRupiah(item.previous_records[0].record.price)
									:
									item.new_records.length != 0 && item.previous_records == 0 ?
										this.formatRupiah(item.new_records[0].record.price)
										:
										'-'
						}
					</Text>
					{/* {
						item.new_records.length != 0 && item.previous_records != 0 ?
							<View style={{ alignItems: 'center' }}>
								<Icon name={item.new_records[0].record.price - item.previous_records[0].record.price == '0' ? "minus" : item.new_records[0].record.price - item.previous_records[0].record.price > '0' ? "caret-up" : "caret-down"} size={20} color={item.new_records[0].record.price - item.previous_records[0].record.price == '0' ? "minus" :  item.new_records[0].record.price - item.previous_records[0].record.price > '0' ? "#D31800" : '#46c35f'} />
								<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.LIGHT }}>{this.formatRupiah(item.new_records[0].record.price - item.previous_records[0].record.price)}</Text>
							</View>
							:
						item.new_records.length == 0 && item.previous_records != 0 ?
							<View style={{ alignItems: 'center' }}>
								<Icon name={item.previous_records[0].record.trend == 'Naik' ? "caret-up" : "caret-down"} size={20} color={item.previous_records.trend == 'Naik' ? '#D31800' : '#46c35f'} />
								<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.LIGHT }}>{this.formatRupiah(item.previous_records[0].record.price)}</Text>
							</View>
							:
						item.new_records.length != 0 && item.previous_records == 0 ?
							<View style={{ alignItems: 'center' }}>
								<Icon name={item.new_records[0].record.trend == 'Naik' ? "caret-up" : "caret-down"} size={20} color={item.new_records[0].record.trend == 'Naik' ? '#D31800' : '#46c35f'} />
								<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.LIGHT }}>{this.formatRupiah(item.new_records[0].record.price)}</Text>
							</View>
							:
							<View style={{ alignItems: 'center' }}>
								<Icon name="minus" size={10} />
								<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.LIGHT }}>Stabil</Text>
							</View>
					} */}
					{
						item.new_records.length != 0 && item.previous_records != 0 ?
							<View style={{ alignItems: 'center' }}>
								<Icon name={item.new_records[0].record.trend == 'Naik' ? "caret-up" : item.new_records[0].record.trend == 'Turun' ? "caret-down" : "minus"} size={20} color={item.new_records[0].record.trend == 'Naik' ? "#D31800" : item.new_records[0].record.trend == 'Turun' ? "#46c35f" : "minus"} />
								<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.LIGHT }}>{item.new_records[0].record.trend}</Text>
							</View>
							:
							item.new_records.length == 0 && item.previous_records != 0 ?
								<View style={{ alignItems: 'center' }}>
									<Icon name={item.previous_records[0].record.trend == 'Naik' ? "caret-up" : "caret-down"} size={20} color={item.previous_records.trend == 'Naik' ? '#D31800' : '#46c35f'} />
									<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.LIGHT }}>{this.formatRupiah(item.previous_records[0].record.price)}</Text>
								</View>
								:
								item.new_records.length != 0 && item.previous_records == 0 ?
									<View style={{ alignItems: 'center' }}>
										<Icon name={item.new_records[0].record.trend == 'Naik' ? "caret-up" : "caret-down"} size={20} color={item.new_records[0].record.trend == 'Naik' ? '#D31800' : '#46c35f'} />
										<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.LIGHT }}>{this.formatRupiah(item.new_records[0].record.price)}</Text>
									</View>
									:
									<View style={{ alignItems: 'center' }}>
										<Icon name="minus" size={10} />
										<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.LIGHT }}>Stabil</Text>
									</View>
					}
				</View>
			</TouchableOpacity>
		)
	}

	render() {
		return (
			<Container>
				<Header style={{ backgroundColor: Colors.PRIMARY }}>
					<Left style={{ flex: 0 }}>
						<Button transparent onPress={() => this.handleBackButton()}>
							<Image style={{ height: 18, width: 18, tintColor: Colors.WHITE }} resizeMode='contain' source={require('../../components/images/back.png')}></Image>
						</Button>
					</Left>
					<Body>
						<Text style={{ fontSize: 18, color: Colors.WHITE, fontFamily: Fonts.REGULAR, marginLeft: 16 }}>Info Pangan</Text>
					</Body>
					<Right />
				</Header>
				<StatusBar barStyle="light-content" backgroundColor={Colors.PRIMARY} />
				<Content style={{ backgroundColor: Colors.WHITE }}>
					{/* <View style={{ backgroundColor: Colors.PRIMARY, paddingLeft: 16, paddingRight: 16, paddingBottom: 16 }}>
						<Item style={{ backgroundColor: '#e8a8ab', borderRadius: 4, height: 40 }}>
							<Image style={{ height: 20, width: 20, margin: 10, tintColor: Colors.WHITE }} resizeMode='cover' source={require('../../components/images/footer/search.png')}></Image>
							<Input style={{ fontFamily: Fonts.LIGHT, color: Colors.WHITE, fontSize: 16 }} placeholder="Cari info pangan ..." placeholderTextColor={Colors.WHITE} value={this.state.search} onChangeText={(value) => this.setState({ search: value })} />
						</Item>
					</View> */}
					<View style={{ alignItems: 'center' }}>
						<ImageBackground style={{ height: 150, width: width }} resizeMode='cover' source={require('../../components/images/backgroundInfoPangan.png')}>
							<View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' }}>
								<View style={{ height: 100, justifyContent: 'center', alignItems: 'center' }}>
									<Text style={{ fontSize: 16, color: Colors.WHITE, fontFamily: Fonts.MEDIUM, marginTop: 20, textAlign: 'center' }}>Harga rata-rata komoditas hari ini</Text>
									<Text style={{ fontSize: 14, color: Colors.WHITE, fontFamily: Fonts.LIGHT, marginTop: 10, textAlign: 'center' }}>{moment().format('DD MMM YYYY')}</Text>
								</View>
								<View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
									<Text style={{ fontSize: 12, color: Colors.WHITE, fontFamily: Fonts.LIGHT, textAlign: 'center' }}>*Harga dibandingkan dengan harga pada hari sebelumnya</Text>
								</View>
							</View>
						</ImageBackground>
					</View>
					<FlatList
						style={styles.flatlistCard}
						data={this.state.informationData}
						numColumns={2}
						extradata={false}
						renderItem={({ item }) => (
							this.cardBox(item)
						)}
						keyExtractor={(item, index) => index.toString()}
					/>
				</Content>
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
	boxMenuLeft: {
		flex: 0.5,
		flexDirection: 'row',
		margin: 10,
		alignItems: 'center',
		shadowColor: Colors.BLACK,
		shadowOpacity: 0.8,
		elevation: 2,
		backgroundColor: Colors.WHITE,
		borderRadius: 5,
	},
	boxMenuRight: {
		flex: 0.5,
		flexDirection: 'row',
		marginLeft: 8,
		alignItems: 'center',
		shadowColor: Colors.BLACK,
		shadowOpacity: 0.8,
		elevation: 2,
		backgroundColor: Colors.WHITE,
		borderRadius: 5,
	},
	flatlistCard: {
		height: '80%',
		flex: 1,
	},
});
