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

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class PlaceList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search: '',
			searchPlace: [],
			searchPl: {},
			placeAll: [],
			placeCategory: [],
			placePopuler: [],
			placeRekomendasi: [],
			isLoadingAll: false,
			isLoadingPopuler: false,
			isLoadingRecomendation: false,
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
		this.getPlacesAll();
		this.getPlacesPopuler();
		this.getPlaceCategory();
	};

	handleBackButton = () => {
		Actions.home();
		return true;
	};

	showLoadingAll(loading) {
		this.setState({ isLoadingAll: loading })
	};

	showLoadingPopuler(loadings){
		this.setState({ isLoadingPopuler: loadings })
	}

	showLoadingRecomendation(loadingss){
		this.setState({ isLoadingRecomendation: loadingss })
	}

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

	getPlacesAll(){
		this.showLoadingAll(true);
		axios({
			method: 'GET',
			url: Config.API_URL + '/api/v1/place?terms&paginate=1&limit=10&top=false',
			data: {},
			timeout: 35000
		}).then((response) => {
			if (response.data.header.message == 'Success') {
				this.setState({
					placeAll: response.data.data.data
				})
				this.showLoadingAll(false);
			}
			else {
				this.showLoadingAll(false);
				Toast.message(response.data.header.reason.id);
			}
		}).catch((error) => {
			this.showLoadingAll(false);
			Toast.message(error.data.header.reason.id);
		});
	}

	searchPlaces(text){
		if(text.length > 2){ 
			axios({
				method: 'GET',
				url: Config.API_URL + '/api/v1/place?terms=' + text + '&paginate=1&limit=10&top=false',
				data: {},
				timeout: 35000
			}).then((response) => {
				if (response.data.header.message == 'Success') {
					this.setState({
						searchPlace: response.data.data.data,
						searchPl: response.data.data
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

	getPlaceCategory(){
		this.showLoadingAll(true);
		axios({
			method: 'GET',
			url: Config.API_URL + '/api/v1/place/category?terms=&paginate=1&limit=4&parent=0',
			data: {},
			timeout: 35000
		}).then((response) => {
			console.log(response)
			if (response.data.header.message == 'Success') {
				this.setState({
					placeCategory: response.data.data.data
				})
				this.showLoadingAll(false);
			}
			else {
				this.showLoadingAll(false);
				Toast.message(response.data.header.reason.id);
			}
		}).catch((error) => {
			this.showLoadingAll(false);
			Toast.message(error.data.header.reason.id);
		});
	}

	getPlacesPopuler(){
		this.showLoadingPopuler(true);
		axios({
			method: 'GET',
			url: Config.API_URL + '/api/v1/place?terms&paginate=1&limit=5&top=true',
			data: {},
			timeout: 35000
		}).then((response) => {
			if (response.data.header.message == 'Success') {
				this.setState({
					placePopuler: response.data.data.data
				})
				this.showLoadingPopuler(false);
			}
			else {
				this.showLoadingPopuler(false);
				// this.getPlacesRekomendasi();
				Toast.message(response.data.header.reason.id);
			}
		}).catch((error) => {
			this.showLoadingPopuler(false);
			// this.getPlacesRekomendasi();
			Toast.message(error.data.header.reason.id);
		});
	}

	getPlacesRekomendasi(){
		this.showLoadingRecomendation(true);
		axios({
			method: 'GET',
			url: Config.API_URL + '/api/v1/place?terms&paginate=1&limit=10&top=false&recommendation=true',
			data: {},
			timeout: 35000
		}).then((response) => {
			if (response.data.header.message == 'Success') {
				this.setState({
					placeRekomendasi: response.data.data.data
				})
				this.showLoadingRecomendation(false);
			}
			else{
				Toast.message(response.data.header.reason.id);
				this.showLoadingRecomendation(false);
			}
		}).catch((error) => {
			this.showLoadingRecomendation(false)
			Toast.message(error.data.header.reason.id);
		});
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
						<Text style={{ fontSize: 18, color: Colors.WHITE, fontFamily: Fonts.REGULAR, marginLeft: 16 }}>Tempat</Text>
					</Body>
					<Right/>
				</Header>
				<StatusBar barStyle="light-content" backgroundColor= {Colors.PRIMARY} />
				<Content style={{ backgroundColor: Colors.WHITE }}>
					<View style={{ backgroundColor: Colors.PRIMARY, paddingLeft: 16, paddingRight: 16, paddingBottom: 16 }}>
						<Item style={{ backgroundColor: '#e8a8ab', borderRadius: 4, height: 40 }}>
							<Image style={{ height: 20, width: 20, margin: 10, tintColor: Colors.WHITE }} resizeMode='cover' source={require('../../components/images/footer/search.png')}></Image>
							<Input style={{ fontFamily: Fonts.LIGHT, color: Colors.WHITE, fontSize: 16 }} placeholder="Cari tempat ..." placeholderTextColor={Colors.WHITE} value={this.state.search} onChangeText={(value) => this.searchPlaces(value) + this.setState({ search: value })} />
						</Item>
					</View>
					{
						this.state.search == '' ?
							<View>
								{
									this.state.isLoadingAll == true ?
										<View style={{ justifyContent: 'center', alignItems: 'center' }}>
											<Spinner color={Colors.PRIMARY} />
										</View>
										:
										<View style={{ marginTop: 10 }}>
											<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
												{
													this.state.placeAll.map((items) => (
														<View style={{ padding: 14 }} key={Math.random()}>
															<TouchableOpacity style={styles.boxMenu} onPress={() => Actions.placeDetail({ placeId: items.id })}>
																<Image style={{ height: 100, width: 300, borderTopLeftRadius: 5, borderTopRightRadius: 5 }} resizeMode='cover' resizeMethod='scale' source={items.related_images[0].image.path != '' ? { uri: items.related_images[0].image.path } : require('../../components/images/placeholderLandscape.png')} />
																<View style={{ padding: 6 }}>
																	<Text numberOfLines={1} style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>{items.title}</Text>
																	<Text numberOfLines={2} style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 6 }}>{items.attributes[0].value.value}</Text>
																</View>
															</TouchableOpacity>
														</View>
													))
												}
											</ScrollView>
										</View>
								}

								<View style={{ marginTop: 10 }}>
									<View style={{ margin: 8 }}>
										<View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 16, paddingRight: 16 }}>
											<Text style={{ fontSize: 16, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Kategori</Text>
											<TouchableOpacity onPress={() => Actions.placeCategory()}>
												<Text style={{ fontSize: 12, color: Colors.PRIMARY, fontFamily: Fonts.REGULAR }}>Lihat Semua</Text>
											</TouchableOpacity>
										</View>
										<View style={styles.boxMenuPrimary}>
											{
												this.state.placeCategory.map((items) => (
													<TouchableOpacity key={Math.random()} style={styles.boxMenuKategori} onPress={() => Actions.placeCategoryList({ categoryId: items.id, from: 'list', categoryName: items.name })}>
														<Image style={{ height: 35, width: 35 }} resizeMode='cover' source={items.image == null ? '' : { uri: items.image }}></Image>
														<Text style={{ fontSize: 10, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 12, textAlign: 'center' }}>{items.name}</Text>
													</TouchableOpacity>
												))
											}
										</View>
									</View>
								</View>

								{
									this.state.isLoadingPopuler == true ?
										<View style={{ justifyContent: 'center', alignItems: 'center' }}>
											<Spinner color={Colors.PRIMARY} />
										</View>
										:
										<View style={{ marginTop: 10 }}>
											<View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 16, paddingRight: 16 }}>
												<Text style={{ fontSize: 16, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Tempat Populer</Text>
												<TouchableOpacity onPress={() => Actions.placeCategoryList({categoryId: null, from: 'list', popular: true})}>
													<Text style={{ fontSize: 12, color: Colors.PRIMARY, fontFamily: Fonts.REGULAR }}>Lihat Semua</Text>
												</TouchableOpacity>
											</View>
											<View style={{ padding: 15 }}>
												<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
													{
														this.state.placePopuler.map((items) => (
															<TouchableOpacity style={styles.boxPopuler} key={Math.random()} onPress={() => Actions.placeDetail({ placeId: items.id })}>
																<Image style={{ height: 100, width: 130, borderTopLeftRadius: 5, borderTopRightRadius: 5 }} resizeMode='cover' resizeMethod='scale' source={items.related_images[0].image.path != '' ? { uri: items.related_images[0].image.path } : require('../../components/images/placeholderSquare.png')} />
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
								}

								{/* <View style={{ marginTop: 10 }}>
									<View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 16, paddingRight: 16 }}>
										<Text style={{ fontSize: 16, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Tempat Rekomendasi</Text>
										<TouchableOpacity onPress={() => Actions.placeCategoryList()}>
											<Text style={{ fontSize: 12, color: Colors.PRIMARY, fontFamily: Fonts.REGULAR }}>Lihat Semua</Text>
										</TouchableOpacity>
									</View>
									<View style={{ marginTop: 8 }}>
										<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
											<View style={{ margin: 8 }} />
											<TouchableOpacity style={styles.boxPopuler} key={Math.random()} onPress={() => Actions.placeDetail()}>
												<Image style={{ height: 100, width: 130, borderTopLeftRadius: 5, borderTopRightRadius: 5 }} resizeMode='cover' resizeMethod='scale' source={require('../../components/images/tempat/tempat3.jpg')} />
												<View style={{ padding: 6 }}>
													<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Pantai Batu Burung</Text>
													<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 6 }}>Sedau, Singkawang Sel., Kota Singkawang.</Text>
												</View>
											</TouchableOpacity>
											<TouchableOpacity style={styles.boxPopuler} key={Math.random()} onPress={() => Actions.placeDetail()}>
												<Image style={{ height: 100, width: 130, borderTopLeftRadius: 5, borderTopRightRadius: 5 }} resizeMode='cover' resizeMethod='scale' source={require('../../components/images/tempat/tempat4.jpg')} />
												<View style={{ padding: 6 }}>
													<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Danau Serantangan</Text>
													<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 6 }}>Kelurahan Sagatani Kecamatan Singkawang Selatan.</Text>
												</View>
											</TouchableOpacity>
											<TouchableOpacity style={styles.boxPopuler} key={Math.random()} onPress={() => Actions.placeDetail()}>
												<Image style={{ height: 100, width: 130, borderTopLeftRadius: 5, borderTopRightRadius: 5 }} resizeMode='cover' resizeMethod='scale' source={require('../../components/images/tempat/tempat2.jpg')} />
												<View style={{ padding: 6 }}>
													<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Air Terjun Sibohe</Text>
													<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 6 }}>Dusun Sibohe, Desa Pejintan, Kecamatan Singkawang Timur, Kota Singkawang.</Text>
												</View>
											</TouchableOpacity>
											<TouchableOpacity style={styles.boxPopuler} key={Math.random()} onPress={() => Actions.placeDetail()}>
												<Image style={{ height: 100, width: 130, borderTopLeftRadius: 5, borderTopRightRadius: 5 }} resizeMode='cover' resizeMethod='scale' source={require('../../components/images/tempat/tempat1.jpg')} />
												<View style={{ padding: 6 }}>
													<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Pantai Pasir Panjang</Text>
													<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 6 }}>Kecamatan Singkawang Selatan, Kota Singkawang.</Text>
												</View>
											</TouchableOpacity>
											<View style={{ margin: 4 }} />
										</ScrollView>
									</View>
								</View> */}

								<View style={{ margin: 8 }} />
							</View>
							:
							<View>
								{
									this.state.searchPl.total == 0 ?
										<View style={{ alignItems: 'center', flex: 1, marginTop: 20 }}>
											<Text>Nama tempat tidak ditemukan</Text>
										</View>
										:
										<FlatList
											data={this.state.searchPlace}
											numColumns={1}
											extradata={false}
											onRefresh={this.onRefresh.bind(this)}
											refreshing={this.state.refreshing}
											renderItem={({ item }) => (
												this.placeList(item)
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
	boxMenuPrimary: {
		flexDirection: 'row',
		marginTop: 16,
		marginBottom: 8,
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	boxMenuKategori: {
		flex: 0.25,
		alignItems: 'center',
		shadowColor: Colors.BLACK,
		shadowOpacity: 0.8,
		elevation: 2,
		backgroundColor: Colors.WHITE,
		borderRadius: 5,
		padding: 5,
		marginLeft: 8,
		marginRight: 8,
		height: '100%',
	},
	boxMenu: {
		width: 300,
		height: 170,
		shadowColor: Colors.BLACK,
		shadowOpacity: 0.8,
		elevation: 2,
		backgroundColor: Colors.WHITE,
		borderRadius: 5,
		marginRight: 5,
	},
	boxPopuler: {
		width: 130,
		shadowColor: Colors.BLACK,
		shadowOpacity: 0.8,
		elevation: 2,
		backgroundColor: Colors.WHITE,
		borderRadius: 5,
		marginRight: 10,
		marginBottom: 8
	}
});
