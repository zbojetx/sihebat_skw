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

export default class CulinaryList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search: '',
			culinaryCategory: [],
			searchCulinary: [],
			searchCul: {},
			culinaryAll: [],
			culinaryPopuler: [],
			culinaryRekomendasi: [],
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
		this.getCulinariesAll();
		this.getCulinariesPopuler();
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
			this.getCulinaryCategory();
		});
		setTimeout(() => {
			this.setState({refreshing: false});
		}, 2000);
	}

	getCulinariesAll(){
		this.showLoadingAll(true)
		axios({
			method: 'GET',
			url: Config.API_URL + '/api/v1/culinary?paginate=1&limit=10&top=false',
			data: {},
			timeout: 35000
		}).then((response) => {
			if (response.data.header.message == 'Success') {
				this.setState({
					culinaryAll: response.data.data.data
				})
				this.showLoadingAll(false);
				this.getCulinaryCategory();
			}
		}).catch((error) => {
			this.showLoadingAll(false);
			Toast.message(error.data.header.reason.id);
		});
	}

	getCulinaryCategory(){
		this.showLoadingAll(true)
		axios({
			method: 'GET',
			url: Config.API_URL + '/api/v1/culinary/category?terms=&paginate=1&limit=4',
			data: {},
			timeout: 35000
		}).then((response) => {
			console.log(response)
			if (response.data.header.message == 'Success') {
				this.setState({
					culinaryCategory: response.data.data.data
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

	searchCulinary(text){
		if(text.length > 2){ 
			axios({
				method: 'GET',
				url: Config.API_URL + '/api/v1/culinary?terms=' + text + '&paginate=1&limit=10&top=false',
				data: {},
				timeout: 35000
			}).then((response) => {
				console.log(response)
				if (response.data.header.message == 'Success') {
					this.setState({
						searchCulinary: response.data.data.data,
						searchCul: response.data.data
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
				searchCulinary: []
			})
		}
	}

	getCulinariesPopuler(){
		this.showLoadingPopuler(true)
		axios({
			method: 'GET',
			url: Config.API_URL + '/api/v1/culinary?paginate=1&limit=10&top=true',
			data: {},
			timeout: 35000
		}).then((response) => {
			if (response.data.header.message == 'Success') {
				this.setState({
					culinaryPopuler: response.data.data.data
				})
				this.showLoadingPopuler(false)
			}
		}).catch((error) => {
			this.showLoadingPopuler(false)
			Toast.message(error.data.header.reason.id);
		});
	}

	getCulinariesRekomendasi(){
		this.showLoadingRecomendation(true);
		axios({
			method: 'GET',
			url: Config.API_URL + '/api/v1/culinary?paginate=1&limit=10&top=false&recomendation=true',
			data: {},
			timeout: 35000
		}).then((response) => {
			if (response.data.header.message == 'Success') {
				this.setState({
					culinaryRekomendasi: response.data.data.data
				})
				this.showLoadingRecomendation(false);
			}
		}).catch((error) => {
			this.showLoadingRecomendation(false);
			Toast.message(error.data.header.reason.id);
		});
	}

	culinaryList(item) {
		return (
			<TouchableOpacity onPress={() => Actions.culinaryDetail({ culinaryId: item.id })}>
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
						<Text style={{ fontSize: 18, color: Colors.WHITE, fontFamily: Fonts.REGULAR, marginLeft: 16 }}>Kuliner</Text>
					</Body>
					<Right/>
				</Header>
				<StatusBar barStyle="light-content" backgroundColor= {Colors.PRIMARY} />
				<Content style={{ backgroundColor: Colors.WHITE }}>
					<View style={{ backgroundColor: Colors.PRIMARY, paddingLeft: 16, paddingRight: 16, paddingBottom: 16 }}>
						<Item style={{ backgroundColor: '#e8a8ab', borderRadius: 4, height: 40 }}>
							<Image style={{ height: 20, width: 20, margin: 10, tintColor: Colors.WHITE }} resizeMode='cover' source={require('../../components/images/footer/search.png')}></Image>
							<Input style={{ fontFamily: Fonts.LIGHT, color: Colors.WHITE, fontSize: 16 }} placeholder="Cari kuliner ..." placeholderTextColor={Colors.WHITE} value={this.state.search} onChangeText={(value) => this.searchCulinary(value) + this.setState({ search: value })} />
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
													this.state.culinaryAll.map((items) => (
														<View style={{ padding: 14 }}  key={Math.random()}>
															<TouchableOpacity style={styles.boxMenu} key={Math.random()} onPress={() => Actions.culinaryDetail({ culinaryId: items.id })}>
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
										<View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 16, paddingRight: 16 }}>
											<Text style={{ fontSize: 16, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Kategori</Text>
											<TouchableOpacity onPress={() => Actions.culinaryCategory()}>
												<Text style={{ fontSize: 12, color: Colors.PRIMARY, fontFamily: Fonts.REGULAR }}>Lihat Semua</Text>
											</TouchableOpacity>
										</View>
										<View style={styles.boxMenuPrimary}>
											{
												this.state.culinaryCategory.map((items) => (
													<TouchableOpacity key={Math.random()} style={styles.boxMenuKategori} onPress={() => Actions.culinaryCategoryList({ categoryId: items.id, from: 'list', categoryName: items.name })}>
														<Image style={{ height: 35, width: 35 }} resizeMode='cover' source={items.image == null && items.image == '' ? require('../../components/images/placeholderSquare.png') : { uri: items.image }}></Image>
														<Text style={{ fontSize: 10, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 12, textAlign: 'center' }}>{items.name}</Text>
													</TouchableOpacity>
												))
											}
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
												<Text style={{ fontSize: 16, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Kuliner Populer</Text>
												<TouchableOpacity onPress={() => Actions.culinaryCategoryList({categoryId: null, from: 'list'})}>
													<Text style={{ fontSize: 12, color: Colors.PRIMARY, fontFamily: Fonts.REGULAR }}>Lihat Semua</Text>
												</TouchableOpacity>
											</View>
											<View style={{ padding: 15 }}>
												<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
													{
														this.state.culinaryPopuler.map((items) => (
															<TouchableOpacity style={styles.boxPopuler} key={Math.random()} onPress={() => Actions.culinaryDetail({ culinaryId: items.id })}>
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
										<Text style={{ fontSize: 16, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Kuliner Rekomendasi</Text>
										<TouchableOpacity onPress={() => Actions.culinaryCategoryList()}>
											<Text style={{ fontSize: 12, color: Colors.PRIMARY, fontFamily: Fonts.REGULAR }}>Lihat Semua</Text>
										</TouchableOpacity>
									</View>
									<View style={{ marginTop: 8 }}>
										<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
											<View style={{ margin: 8 }} />
											<TouchableOpacity style={styles.boxPopuler} key={Math.random()} onPress={() => Actions.culinaryDetail()}>
												<Image style={{ height: 100, width: 130, borderTopLeftRadius: 5, borderTopRightRadius: 5 }} resizeMode='cover' resizeMethod='scale' source={require('../../components/images/kuliner/kuliner3.jpg')} />
												<View style={{ padding: 6 }}>
													<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Bubur Gunting Asun</Text>
													<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 6 }}>Jl. P. Antasari No.58-56, Pasiran, Singkawang Barat.</Text>
												</View>
											</TouchableOpacity>
											<TouchableOpacity style={styles.boxPopuler} key={Math.random()} onPress={() => Actions.culinaryDetail()}>
												<Image style={{ height: 100, width: 130, borderTopLeftRadius: 5, borderTopRightRadius: 5 }} resizeMode='cover' resizeMethod='scale' source={require('../../components/images/kuliner/kuliner4.jpg')} />
												<View style={{ padding: 6 }}>
													<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Rujak Thai Pui Ji</Text>
													<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 6 }}>Jalan Salam Diman No. 8, Condong, Melayu, Singkawang Barat.</Text>
												</View>
											</TouchableOpacity>
											<TouchableOpacity style={styles.boxPopuler} key={Math.random()} onPress={() => Actions.culinaryDetail()}>
												<Image style={{ height: 100, width: 130, borderTopLeftRadius: 5, borderTopRightRadius: 5 }} resizeMode='cover' resizeMethod='scale' source={require('../../components/images/kuliner/kuliner2.jpg')} />
												<View style={{ padding: 6 }}>
													<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Mie Tiaw Asuk</Text>
													<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 6 }}>Jl. Yos Sudarso Kel. Melayu, Melayu, Singkawang Barat.</Text>
												</View>
											</TouchableOpacity>
											<TouchableOpacity style={styles.boxPopuler} key={Math.random()} onPress={() => Actions.culinaryDetail()}>
												<Image style={{ height: 100, width: 130, borderTopLeftRadius: 5, borderTopRightRadius: 5 }} resizeMode='cover' resizeMethod='scale' source={require('../../components/images/kuliner/kuliner1.jpg')} />
												<View style={{ padding: 6 }}>
													<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Bakso Sapi Bakmi Ayam 68</Text>
													<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 6 }}>Jl. Pangeran Diponegoro No. 68, Darat Sekip, Singkawang Barat.</Text>
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
									this.state.searchCul.total == 0 ? 
										<View style={{ alignItems: 'center', flex: 1, marginTop: 20 }}>
											<Text>Nama kuliner tidak ditemukan</Text>
										</View>
										:
										<FlatList
											data={this.state.searchCulinary}
											numColumns={1}
											extradata={false}
											onRefresh={this.onRefresh.bind(this)}
											refreshing={this.state.refreshing}
											renderItem={({ item }) => (
												this.culinaryList(item)
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
		marginLeft: 6,
		marginBottom: 8,
		flex: 1,
		alignItems: 'center',
	},
	boxMenuKategori: {
		flex: 0.25,
		alignItems: 'center',
		shadowColor: Colors.BLACK,
		shadowOpacity: 0.8,
		elevation: 2,
		backgroundColor: Colors.WHITE,
		borderRadius: 5,
		padding: 15,
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
