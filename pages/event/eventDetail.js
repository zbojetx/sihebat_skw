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
import Share, {ShareSheet,Button as Buttons} from 'react-native-share';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class EventDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			eventDetail: {},
			eventImage: {},
			eventPrice: '',
			eventPlave: {},
			eventDate: {},
			attributes: [],
			eventAddress: '',
			share: false,
			modalVisible: false,
			defaultRegion: {
				latitude: 0,
				longitude: 0,
				latitudeDelta: 0.0019,
				longitudeDelta: 0.0019
			},
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
		this.getEventDetail()
	};

	handleBackButton = () => {
		this.props.from == 'isFromCategoryList' ? Actions.eventJelajahiList({ eventCategoryId: this.props.eventCategoryId, categoryName: this.props.categoryName }) :
		Actions.eventList();
		return true;
	};

	setModalVisible(visible) {
		this.setState({ modalVisible: visible });
	}

	onRegionChange(defaultRegion) {
		this.setState({ defaultRegion: defaultRegion });
	};

	onCancel() {
		this.setState({share:false});
	 }
	onOpen() {
		this.setState({share:true});
	};

	getEventDetail() {
		axios({
			method: 'GET',
			url: Config.API_URL + '/api/v1/event/' + this.props.eventId,
			data: {},
			timeout: 35000
		}).then((response) => {
			console.log(response)
			if (response.data.header.message == 'Success') {
				this.setState({
					eventAddress: response.data.data.attributes[7].value,
					eventPrice: response.data.data.attributes[8].value,
					eventDetail: response.data.data,
					eventImage: response.data.data.related_images[0].image,
					eventDate: response.data.data.attributes[12].value
				})
			}
		}).catch((error) => {
			Toast.message(error.data.header.reason.id);
		});
	}

	formatDate(date) {
		return moment(date).format('DD MMM YYYY')
	}

	formatRupiah(currency) {
		let x = parseInt(currency);
		return 'Rp. '+ x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
	}

	render() {
		let shareOptions = {
			title: "SiHebat",
			message: JSON.stringify('Hello'),
			url: 'https://sihebat.singkawangkota.go.id',
			subject: "Sihebat" //  for email
		};
		return(
			<Container>
				<Header style={{ backgroundColor: Colors.WHITE }}>
					<Left style={{ flex: 0 }}>
						<Button transparent onPress={() => this.handleBackButton()}>
							<Image style={{ height: 18, width: 18, tintColor: Colors.PRIMARY }} resizeMode='contain' source={require('../../components/images/back.png')}></Image>
						</Button>
					</Left>
					<Body>
						<Text numberOfLines={1} style={{ fontSize: 18, color: Colors.PRIMARY, fontFamily: Fonts.REGULAR, marginLeft: 16 }}>{this.state.eventDetail.title}</Text>
					</Body>
					<Right>
						<Button transparent onPress={() => this.setState({ share: true })}>
							<Image style={{ height: 18, width: 18, tintColor: Colors.PRIMARY }} resizeMode='contain' source={require('../../components/images/shareOutline.png')}></Image>
						</Button>
					</Right>
				</Header>
				<StatusBar barStyle="dark-content" backgroundColor={Colors.WHITE} />
				<Content style={{ backgroundColor: Colors.WHITE }}>
					<View style={{ padding: 16 }}>
						<View style={styles.boxMenu}>
							<Image style={{ height: 150, width: '100%', borderTopLeftRadius: 5, borderTopRightRadius: 5 }} resizeMode='cover' resizeMethod='scale' source={this.state.eventImage.path != '' ? { uri: this.state.eventImage.path } : require('../../components/images/placeholderLandscape.png')} />
							<View style={{ padding: 12 }}>
								<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>{this.state.eventDetail.title}</Text>
								<View style={{ flexDirection: 'row', marginTop: 16, flex: 1, alignItems: 'center' }}>
									<View style={{ flex: 0.6 }}>
										<View style={{ flexDirection: 'row' }}>
											<Icon name="calendar-alt" size={10} color={Colors.BLACK} />
											<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginLeft: 8 }}>{this.formatDate(this.state.eventDate.value)}</Text>
										</View>
										<View style={{ flexDirection: 'row', marginTop: 8 }}>
											<Icon name="map-marker-alt" size={10} color={Colors.BLACK} />
											<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginLeft: 8, width: '90%' }}>{this.state.eventAddress.value}</Text>
										</View>
									</View>
									<View style={{ flex: 0.4 }}>
										<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>Harga mulai dari :</Text>
										<Text style={{ fontSize: 14, color: '#f73d44', fontFamily: Fonts.MEDIUM, marginTop: 4 }}>{this.state.eventPrice.value != '' && this.state.eventPrice.value != null && this.state.eventPrice.value != '0' ? this.formatRupiah(this.state.eventPrice.value) : 'Gratis'}</Text>
									</View>
								</View>
								<TouchableOpacity style={{ height: 25, backgroundColor: '#6dcb67', borderRadius: 6, marginTop: 16, padding: 4, alignItems: 'center', flexDirection: 'row', alignSelf: 'flex-start' }} onPress={() => this.setModalVisible(true)}>
									<Icon name="map" size={10} color={Colors.WHITE} style={{ marginLeft: 4 }} />
									<Text style={{ fontSize: 12, color: Colors.WHITE, fontFamily: Fonts.REGULAR, marginLeft: 8 }} uppercase={false}>Lihat Peta</Text>
								</TouchableOpacity>
							</View>
						</View>
						<View style={styles.boxMenu}>
							<View style={{ padding: 12 }}>
								<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Rincian Acara</Text>
								<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 8 }}>{this.state.eventDetail.description != '' ? this.state.eventDetail.description : '-' }</Text>
							</View>
						</View>
					</View>
				</Content>
				<Modal
					animationType="slide"
					transparent={false}
					visible={this.state.modalVisible}
					onRequestClose={() => {
						this.setModalVisible(!this.state.modalVisible)
					}}>
					<MapView
						provider={PROVIDER_GOOGLE}
						style={styles.map}
						mapType='standard'
						showsUserLocation={true}
						showsMyLocationButton={true}
						showsCompass={true}
						followsUserLocation={true}
						loadingEnabled={true}
						toolbarEnabled={true}
						zoomEnabled={true}
						rotateEnabled={true}
						region={this.state.defaultRegion}
						onRegionChangeComplete={(regions) => {
							this.setState({
								defaultRegion: regions
							});
						}}
					/>
				</Modal>
				<ShareSheet visible={this.state.share} onCancel={this.onCancel.bind(this)}>
					<Buttons iconSrc={{ uri: FACEBOOK_ICON }}
						onPress={()=>{
						this.onCancel();
						setTimeout(() => {
						Share.shareSingle(Object.assign(shareOptions, {
							"social": "facebook"
						}));
						},300);
					}}>Facebook</Buttons>
					<Buttons iconSrc={{ uri: WHATSAPP_ICON }}
						onPress={()=>{
						this.onCancel();
						setTimeout(() => {
						Share.shareSingle(Object.assign(shareOptions, {
							"social": "whatsapp"
						}));
						},300);
					}}>Whatsapp</Buttons>
					<Buttons iconSrc={{ uri: TWITTER_ICON }}
						onPress={()=>{
						this.onCancel();
						setTimeout(() => {
						Share.shareSingle(Object.assign(shareOptions, {
							"social": "twitter"
						}));
						},300);
					}}>Twitter</Buttons>
					<Buttons iconSrc={{ uri: EMAIL_ICON }}
						onPress={()=>{
						this.onCancel();
						setTimeout(() => {
						Share.shareSingle(Object.assign(shareOptions, {
							"social": "email"
						}));
						},300);
					}}>Email</Buttons>
					<Buttons iconSrc={{ uri: MORE_ICON }}
					onPress={()=>{
						this.onCancel();
						setTimeout(() => {
						Share.open(shareOptions)
						},300);
					}}>More</Buttons>
				</ShareSheet>
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
	map: {
		...StyleSheet.absoluteFillObject,
	},
});

//  twitter icon
const TWITTER_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAABvFBMVEUAAAAA//8AnuwAnOsAneoAm+oAm+oAm+oAm+oAm+kAnuwAmf8An+0AqtUAku0AnesAm+oAm+oAnesAqv8An+oAnuoAneoAnOkAmOoAm+oAm+oAn98AnOoAm+oAm+oAmuoAm+oAmekAnOsAm+sAmeYAnusAm+oAnOoAme0AnOoAnesAp+0Av/8Am+oAm+sAmuoAn+oAm+oAnOoAgP8Am+sAm+oAmuoAm+oAmusAmucAnOwAm+oAmusAm+oAm+oAm+kAmusAougAnOsAmukAn+wAm+sAnesAmeoAnekAmewAm+oAnOkAl+cAm+oAm+oAmukAn+sAmukAn+0Am+oAmOoAmesAm+oAm+oAm+kAme4AmesAm+oAjuMAmusAmuwAm+kAm+oAmuoAsesAm+0Am+oAneoAm+wAmusAm+oAm+oAm+gAnewAm+oAle0Am+oAm+oAmeYAmeoAmukAoOcAmuoAm+oAm+wAmuoAneoAnOkAgP8Am+oAm+oAn+8An+wAmusAnuwAs+YAmegAm+oAm+oAm+oAmuwAm+oAm+kAnesAmuoAmukAm+sAnukAnusAm+oAmuoAnOsAmukAqv9m+G5fAAAAlHRSTlMAAUSj3/v625IuNwVVBg6Z//J1Axhft5ol9ZEIrP7P8eIjZJcKdOU+RoO0HQTjtblK3VUCM/dg/a8rXesm9vSkTAtnaJ/gom5GKGNdINz4U1hRRdc+gPDm+R5L0wnQnUXzVg04uoVSW6HuIZGFHd7WFDxHK7P8eIbFsQRhrhBQtJAKN0prnKLvjBowjn8igenQfkQGdD8A7wAAAXRJREFUSMdjYBgFo2AUDCXAyMTMwsrGzsEJ5nBx41HKw4smwMfPKgAGgkLCIqJi4nj0SkhKoRotLSMAA7Jy8gIKing0KwkIKKsgC6gKIAM1dREN3Jo1gSq0tBF8HV1kvax6+moG+DULGBoZw/gmAqjA1Ay/s4HA3MISyrdC1WtthC9ebGwhquzsHRxBfCdUzc74Y9UFrtDVzd3D0wtVszd+zT6+KKr9UDX749UbEBgULIAbhODVHCoQFo5bb0QkXs1RAvhAtDFezTGx+DTHEchD8Ql4NCcSyoGJYTj1siQRzL/JKeY4NKcSzvxp6RmSWPVmZhHWnI3L1TlEFDu5edj15hcQU2gVqmHTa1pEXJFXXFKKqbmM2ALTuLC8Ak1vZRXRxa1xtS6q3ppaYrXG1NWjai1taCRCG6dJU3NLqy+ak10DGImx07LNFCOk2js6iXVyVzcLai7s6SWlbnIs6rOIbi8ViOifIDNx0uTRynoUjIIRAgALIFStaR5YjgAAAABJRU5ErkJggg==";

//  facebook icon
const FACEBOOK_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAAYFBMVEUAAAAAQIAAWpwAX5kAX5gAX5gAX5gAXJwAXpgAWZ8AX5gAXaIAX5gAXpkAVaoAX5gAXJsAX5gAX5gAYJkAYJkAXpoAX5gAX5gAX5kAXpcAX5kAX5gAX5gAX5YAXpoAYJijtTrqAAAAIHRSTlMABFis4vv/JL0o4QvSegbnQPx8UHWwj4OUgo7Px061qCrcMv8AAAB0SURBVEjH7dK3DoAwDEVRqum9BwL//5dIscQEEjFiCPhubziTbVkc98dsx/V8UGnbIIQjXRvFQMZJCnScAR3nxQNcIqrqRqWHW8Qd6cY94oGER8STMVioZsQLLnEXw1mMr5OqFdGGS378wxgzZvwO5jiz2wFnjxABOufdfQAAAABJRU5ErkJggg==";

//  whatsapp icon
const WHATSAPP_ICON = "data:image/png;base64,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";

//  email icon
const EMAIL_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAABC1BMVEUAAAA/Pz8/Pz9AQEA/Pz8/Pz8+Pj4+Pj4/Pz8/Pz8/Pz8/Pz8+Pj4+Pj4/Pz8/Pz8/Pz9AQEA+Pj5AQEA/Pz87Ozs7Ozs/Pz8+Pj47OztAQEA/Pz89PT01NTVBQUFBQUE/Pz8/Pz8+Pj4/Pz9BQUE+Pj4/Pz8/Pz89PT0+Pj4/Pz9BQUFAQEA9PT09PT0/Pz87Ozs9PT05OTk/Pz8+Pj4/Pz9AQEA/Pz8/Pz8/Pz8/Pz+AgIA+Pj4/Pz8/Pz9AQEA/Pz8/Pz8/Pz8/Pz8+Pj4/Pz8/Pz8/Pz9AQEA+Pj4/Pz8+Pj4/Pz85OTk/Pz8/Pz8/Pz8/Pz88PDw9PT0/Pz88PDw8PDw+Pj45OTlktUJVAAAAWXRSTlMA/7N4w+lCWvSx8etGX/XlnmRO7+1KY/fjOGj44DU7UvndMec/VvLbLj7YKyiJdu9O7jZ6Um1w7DnzWQJz+tpE6uY9t8D9QehAOt7PVRt5q6duEVDwSEysSPRjqHMAAAEfSURBVEjH7ZTXUgIxGEa/TwURUFyKYgMURLCvbe2gYAV7ff8nMRksgEDiKl7lXOxM5p8zO3s2CWAwGAx/CjXontzT25Y+pezxtpv2+xTygJ+BYOvh4BBDwx1lKxxhNNZqNjLK+JjVWUYsykj4+2h8gpNTUMkIBuhPNE+SKU7PQC3D62E60ziYzXIuBx0Z+XRTc9F5fgF6MhKNzWXnRejKWGJdc9GZy8AP3kyurH52Ju01XTkjvnldNN+Qi03RecthfFtPlrXz8rmzi739Ax7mUCjy6FhH/vjPonmqVD6pdT718excLX/tsItLeRAqtc7VLIsFlVy/t6+ub27v7t8XD490niy3p+rZpv3i+jy/Or+5SUrdvcNcywaDwfD/vAF2TBl+G6XvQwAAAABJRU5ErkJggg==";

//  more icon
const MORE_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAAQlBMVEUAAABEREQ9PT0/Pz8/Pz9AQEA7OzszMzM/Pz8/Pz9FRUU/Pz8/Pz9VVVUAAAA/Pz8+Pj4/Pz8/Pz9BQUFAQEA/Pz+e9yGtAAAAFnRSTlMAD5bv9KgaFJ/yGv+zAwGltPH9LyD5QNQoVwAAAF5JREFUSMft0EkKwCAQRFHHqEnUON3/qkmDuHMlZlVv95GCRsYAAAD+xYVU+hhprHPWjDy1koJPx+L63L5XiJQx9PQPpZiOEz3n0qs2ylZ7lkyZ9oyXzl76MAAAgD1eJM8FMZg0rF4AAAAASUVORK5CYII=";

