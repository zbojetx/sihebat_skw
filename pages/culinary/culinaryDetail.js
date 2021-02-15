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
import Icon from 'react-native-vector-icons/FontAwesome5';
import Colors from '../../components/colors';
import Fonts from '../../components/fonts';
import {Actions} from 'react-native-router-flux';
import axios from 'axios';
import Config from '../../config.js';
import Loader from '../../components/loader';
import ImageViewer from 'react-native-image-zoom-viewer';
import Share, {ShareSheet,Button as Buttons} from 'react-native-share';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class CulinaryDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search: '',
			isLoading: false,
			isLoadingpage: false,
			culinaryDetail: {},
			rating: {},
			operationalHours: {},
			address: {},
			LowestPrice: {},
			HigherPrice: {},
			facility: {},
			images: [],
			attributes: [],
			review: [],
			__meta__: {},
			statusWasHere: false,
			statusBookmark: false,
			modalVisible: false,
			share: false
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
					userId: resultParsed.token.user_id
				});
				this.showLoadingPage(false)
			}
			this.getCulinaryDetail();
			this.showLoadingPage(false)
		});
	};

	handleBackButton = () => {
		this.props.from == 'isFromCategoryList' ? this.props.categoryId == null ? Actions.culinaryCategoryList({categoryId: this.props.categoryId}) : Actions.culinaryCategoryList({categoryId: this.props.categoryId, categoryName: this.props.categoryName}):
		Actions.culinaryList();
		return true;
	};

	onCancel() {
		this.setState({share:false});
	 }
	onOpen() {
		this.setState({share:true});
	};

	toggleModal(visible) {
		let arrayImage = this.state.images
		for(let x in arrayImage){
			let image = arrayImage[x].image.path
			this.setState({ pathImage: image })
			console.log(image)
		}
		this.setState({ modalVisible: visible });
	};

	showLoading(loading) {
		this.setState({ isLoading: loading })
	};

	showLoadingPage(loadings) {
		this.setState({ isLoadingpage: loadings })
	};

	getCulinaryDetail(){
		this.showLoading(true);
		if(this.state.userId != null) {
			axios({
				method: 'GET',
				url: Config.API_URL + '/api/v1/culinary/' + this.props.culinaryId + '?user=' + this.state.userId,
				data: {},
				timeout: 35000
			}).then((response) => {
				console.log(response)
				if (response.data.header.message == 'Success') {
					this.setState({
						culinaryDetail: response.data.data,
						images: response.data.data.related_images,
						address: response.data.data.attributes[3].value,
						rating: response.data.data.total,
						review: response.data.data.related_reviews,
						__meta__: response.data.data.__meta__,
						LowestPrice: response.data.data.attributes[1].value,
						HigherPrice: response.data.data.attributes[2].value
					})
					this.showLoading(false);
				}
				else {
					this.showLoading(false);
					Toast.message(response.data.header.reason.id);
				}
			}).catch((error) => {
				this.showLoading(false);
				Toast.message(error.data.header.reason.id);
			});
		} else {
			axios({
				method: 'GET',
				url: Config.API_URL + '/api/v1/culinary/' + this.props.culinaryId,
				data: {},
				timeout: 35000
			}).then((response) => {
				console.log(response)
				if (response.data.header.message == 'Success') {
					this.setState({
						culinaryDetail: response.data.data,
						images: response.data.data.related_images,
						address: response.data.data.attributes[3].value,
						rating: response.data.data.total,
						review: response.data.data.related_reviews,
						__meta__: response.data.data.__meta__,
						LowestPrice: response.data.data.attributes[1].value,
						HigherPrice: response.data.data.attributes[2].value
					})
					this.showLoading(false);
				}
				else {
					this.showLoading(false);
					Toast.message(response.data.header.reason.id);
				}
			}).catch((error) => {
				this.showLoading(false);
				Toast.message(error.data.header.reason.id);
			});
		}
	}

	putWasHere(status){
		this.showLoadingPage(true)
		console.log(status)
		console.log(this.props.culinaryId)
		axios({
			method: 'PUT',
			url: Config.API_URL + '/api/v1/culinary/action',
			data: {
				mark: 'washere',
				status: status,
				object_id: this.props.culinaryId,
				user_id: this.state.userId
			},
			timeout: 35000
		}).then((response) => {
			if (response.data.header.message == 'Success') {
				this.setState({
					statusWasHere: status
				})
				this.showLoadingPage(false)
				this.getCulinaryDetail()
			}
			else {
				Toast.message(response.data.header.reason.id);
			}
		}).catch((error) => {
			this.showLoadingPage(false);
			Toast.message(error.data.header.reason.id);
		});
	}

	putBookmark(status){
		this.showLoadingPage(true)
		console.log(this.state.statusBookmark)
		console.log(status)
		axios({
			method: 'PUT',
			url: Config.API_URL + '/api/v1/culinary/action',
			data: {
				mark: 'bookmark',
				status: status,
				object_id: this.props.culinaryId,
				user_id: this.state.userId
			},
			timeout: 35000
		}).then((response) => {
			console.log(response)
			if (response.data.header.message == 'Success') {
				this.setState({
					statusBookmark: status
				})
				this.showLoadingPage(false)
				this.getCulinaryDetail()
			}
			else {
				Toast.message(response.data.header.reason.id);
			}
		}).catch((error) => {
			this.showLoadingPage(false);
			Toast.message(error.data.header.reason.id);
		});
	}

	formatTotalRating(rate){
		let x = parseFloat(rate).toFixed(1)
		return x;
	}

	formatRupiah(currency) {
		let x = parseInt(currency);
		return 'Rp. '+ x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
	}

	getFirstWord(str) {
		let spacePosition = str.split(' ')[0];
		return spacePosition
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
					<Body/>
					<Right>
						<Button transparent onPress={() => this.setState({ share: true })}>
							<Image style={{ height: 18, width: 18, tintColor: Colors.PRIMARY }} resizeMode='contain' source={require('../../components/images/shareOutline.png')}></Image>
						</Button>
					</Right>
				</Header>
				<StatusBar barStyle="dark-content" backgroundColor={Colors.WHITE} />
				<Content style={{ backgroundColor: Colors.WHITE }}>
					<Carousel
						style={{ height: 200, marginBottom: 8 }}
						control={
							<Carousel.Control
								style={{ alignItems: 'center', justifyContent: 'flex-end' }}
								dot={<Text style={{ backgroundColor: 'rgba(0, 0, 0, 0)', color: Colors.WHITE, padding: 4 }}>○</Text>}
								activeDot={<Text style={{ backgroundColor: 'rgba(0, 0, 0, 0)', color: Colors.WHITE, padding: 4 }}>●</Text>}
							/>
						}
					>
						{
							this.state.isLoading == true ?
								<Image style={{ width: width, height: 200 }} resizeMode='cover' source={require('../../components/images/placeholderLandscape.png')} />
								:
								this.state.images.map((items) => (
									<Image style={{ width: width, height: 200 }} resizeMode='cover' key={Math.random()} source={items.image.path != '' ? { uri: items.image.path } : require('../../components/images/placeholderLandscape.png')} />
								))
						}
					</Carousel>			

					<View style={{ padding: 16 }}>
						<View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
							<View style={{ flex: 0.8, justifyContent: 'center' }}>
								<Text style={{ fontSize: 18, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>{this.state.culinaryDetail.title}</Text>
							</View>
							<View style={{ marginLeft: 20, flex: 0.2 }}>
								<Text style={{ fontSize: 14, color: Colors.WHITE, fontFamily: Fonts.REGULAR, backgroundColor: '#FFAA67', padding: 10, alignSelf: 'flex-end', borderRadius: 50 }}>{this.state.rating.total_rating == null ? '0' : this.formatTotalRating(this.state.rating.total_rating)}</Text>
							</View>
						</View>
						<View style={{ flexDirection: 'row', flex: 1, marginTop: 16 }}>
							<View style={{ flex: 0.7, justifyContent: 'center' }}>
								<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.REGULAR }}>{this.state.address.value}</Text>
								<View style={{ flexDirection: 'row', marginTop: 8 }}>
									<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.REGULAR }}>No Telepon :</Text>
									<Text style={{ fontSize: 12, color: '#00b4db', fontFamily: Fonts.REGULAR, marginLeft: 4, textDecorationLine: 'underline' }}>{this.state.culinaryDetail.primary_contact}</Text>
								</View>
							</View>
							<View style={{ marginLeft: 20, flex: 0.3 }}>
								<Image style={{ height: 45, width: 45, alignSelf: 'flex-end' }} resizeMode='cover' resizeMethod='scale' source={{ uri: 'https://thumbs.dreamstime.com/t/street-map-sample-streets-river-parks-44060133.jpg' }} />
							</View>
						</View>
						<View style={{ flexDirection: 'row', flex: 1, marginTop: 16 }}>
							{
								this.state.__meta__.is_visited == 0 ?
									<TouchableOpacity style={{ height: 25, backgroundColor: '#f73d44', borderRadius: 4, padding: 6, alignItems: 'center', flexDirection: 'row', alignSelf: 'flex-start' }} onPress={() => this.state.userId != null ? this.putWasHere(true) : Actions.login()}>
										<Icon name="flag" size={10} color={Colors.WHITE} />
										<Text style={{ fontSize: 12, color: Colors.WHITE, fontFamily: Fonts.REGULAR, marginLeft: 8 }} uppercase={false}>Pernah Di sini</Text>
									</TouchableOpacity>
									:
									<TouchableOpacity style={{ height: 25, backgroundColor: '#f73d44', borderRadius: 4, padding: 6, alignItems: 'center', flexDirection: 'row', alignSelf: 'flex-start' }} onPress={() => this.putWasHere(false)}>
										<Icon name="flag" size={10} color={Colors.BLACK} />
										<Text style={{ fontSize: 12, color: Colors.WHITE, fontFamily: Fonts.REGULAR, marginLeft: 8 }} uppercase={false}>Belum Di sini</Text>
									</TouchableOpacity>
							}
							{
								this.state.__meta__.is_bookmarked == 0 ?
									<TouchableOpacity style={{ height: 25, backgroundColor: '#f73d44', borderRadius: 4, padding: 6, alignItems: 'center', flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 8 }} onPress={() => this.state.userId != null ? this.putBookmark(true) : Actions.login()}>
										<Icon name="bookmark" size={10} color={Colors.WHITE} />
										<Text style={{ fontSize: 12, color: Colors.WHITE, fontFamily: Fonts.REGULAR, marginLeft: 8 }} uppercase={false}>Tandai</Text>
									</TouchableOpacity>
									:
									<TouchableOpacity style={{ height: 25, backgroundColor: '#f73d44', borderRadius: 4, padding: 6, alignItems: 'center', flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 8 }} onPress={() => this.putBookmark(false)}>
										<Icon name="bookmark" size={10} color={Colors.BLACK} />
										<Text style={{ fontSize: 12, color: Colors.WHITE, fontFamily: Fonts.REGULAR, marginLeft: 8 }} uppercase={false}>Jangan Tandai</Text>
									</TouchableOpacity>
							}
						</View>
						<View style={{ height: 1, backgroundColor: Colors.BORDER, marginTop: 16 }}></View>
						<View style={{ marginTop: 16 }}>
							<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Rincian</Text>
							<View style={{ flexDirection: 'row', flex: 1, marginTop: 16 }}>
								<View style={{ flex: 0.5, marginRight: 4 }}>
									<View>
										<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.REGULAR }}>Jenis</Text>
										<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 4 }}>-</Text>
									</View>
									<View style={{ marginTop: 16 }}>
										<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.REGULAR }}>Jam Operasional</Text>
										<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 4 }}>-</Text>
									</View>
									<View style={{ marginTop: 16 }}>
										<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.REGULAR }}>Kisaran Harga</Text>
										{
											this.state.LowestPrice.value != '' && this.state.HigherPrice.value != '' ? 										
											<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 4 }}>{this.formatRupiah(this.state.LowestPrice.value)} - {this.formatRupiah(this.state.HigherPrice.value)}</Text>
											: this.state.LowestPrice.value == '' && this.state.HigherPrice.value != '' ?
											<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 4 }}>{this.formatRupiah(this.state.HigherPrice.value)}</Text>
											: this.state.LowestPrice.value != '' && this.state.HigherPrice.value == '' ?
											<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 4 }}>{this.formatRupiah(this.state.LowestPrice.value)}</Text>
											: 
											<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 4 }}>Rp 0</Text>
										}
									</View>
								</View>
								<View style={{ flex: 0.5, marginLeft: 4 }}>
									<View>
										<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.REGULAR }}>Fasilitas</Text>
										<Text>-</Text>
										{/* <View style={{ flexDirection: 'row', marginTop: 4 }}>
											<Icon name="check-circle" size={10} color={'#3BD93E'} />
											<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginLeft: 4 }}>Wifi</Text>
										</View>
										<View style={{ flexDirection: 'row', marginTop: 4 }}>
											<Icon name="check-circle" size={10} color={'#3BD93E'} />
											<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginLeft: 4 }}>Kamar Mandi</Text>
										</View>
										<View style={{ flexDirection: 'row', marginTop: 4 }}>
											<Icon name="check-circle" size={10} color={'#3BD93E'} />
											<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginLeft: 4 }}>AC</Text>
										</View> */}
									</View>
								</View>
							</View>
						</View>
						<View style={{ height: 1, backgroundColor: Colors.BORDER, marginTop: 16 }}></View>
						<View style={{ marginTop: 16 }}>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
								<Text style={{ fontSize: 16, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Foto</Text>
								{/* <TouchableOpacity onPress={() => Actions.culinaryCategoryList()}>
									<Text style={{ fontSize: 12, color: Colors.PRIMARY, fontFamily: Fonts.REGULAR }}>Lihat Semua</Text>
								</TouchableOpacity> */}
							</View>
							<View style={{ marginTop: 16 }}>
								<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
									{
										this.state.isLoading == true ?
											<View style={{ justifyContent: 'center', alignItems: 'center' }}>
												<Spinner color={Colors.PRIMARY} />
											</View>
											:
											this.state.images.map((items) => (
												<TouchableOpacity style={{ marginRight: 8 }} key={Math.random()}  onPress = {() => {this.toggleModal(true)}}>
													<Image style={{ height: 100, width: 100, borderRadius: 4 }} resizeMode='cover' resizeMethod='scale' source={items.image.path != '' ? { uri: items.image.path } : require('../../components/images/placeholderSquare.png')} />
												</TouchableOpacity>
											))
									}
								</ScrollView>
							</View>	
						</View>
						<View style={{ marginTop: 24 }}>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
								<Text style={{ fontSize: 16, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Ulasan</Text>
								{/* <TouchableOpacity onPress={() => Actions.culinaryCategoryList()}>
									<Text style={{ fontSize: 12, color: Colors.PRIMARY, fontFamily: Fonts.REGULAR }}>Lihat Semua</Text>
								</TouchableOpacity> */}
							</View>
							<View>
								{
									this.state.review.map((items) => (
										<View style={{ marginTop: 16 }} key={Math.random()}>
											<View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
												<View style={{ flex: 0.2 }}>
													<Image style={{ height: 50, width: 50 }} resizeMode='cover' source={require('../../components/images/avatar.png')}></Image>
												</View>
												<View style={{ flex: 0.6 }}>
													<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>{items.user.fullname}</Text>
												</View>
												<View style={{ flex: 0.2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
													<Text style={{ marginRight: 5, fontSize: 18 }}>{items.review.rate}</Text>
													<Image style={{ height: 20, width: 20, marginTop: 3 }} resizeMode='contain' source={require('../../components/images/rating.png')}></Image>
												</View>
											</View>
											<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.LIGHT, marginTop: 8 }}>{items.review.comment}</Text>
										</View>
									))
								}
								<View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 24 }}>
									<TouchableOpacity style={{ height: 40, backgroundColor: Colors.PRIMARY, borderRadius: 6, padding: 12 }} onPress={() => Actions.culinaryReview({ culinaryId: this.props.culinaryId, culinaryName: this.state.culinaryDetail.title })}>
										<Text style={{ fontSize: 14, color: Colors.WHITE, fontFamily: Fonts.REGULAR }} uppercase={false}>Berikan Ulasan</Text>
									</TouchableOpacity>
								</View>
							</View>	
						</View>
					</View>
					<Loader loading={this.state.isLoadingpage} />
					<Modal
						transparent={false}
						visible={this.state.modalVisible}
						onRequestClose={() => this.toggleModal(false)}>
						<ImageViewer imageUrls={this.state.images.map((item) => ({
							url : item.image.path
						}
						))} saveToLocalByLongPress={false} />
						<Button style={{ backgroundColor: 'white', margin: 7, height: 40, borderRadius: 10 }} type='link' onPress={() => { this.toggleModal(!this.state.modalVisible) }}>
							<Text style={{ color: '#0066CC', fontSize: 14, padding: 10, fontFamily: 'GothamRoundedMedium' }}>Tutup Gambar</Text>
						</Button>
					</Modal>
				</Content>
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
	}
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
