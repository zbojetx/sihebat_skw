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
	ScrollView,
	SafeAreaView
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
	Textarea
} from 'native-base';
import {
	Toast
} from 'teaset';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Colors from '../../components/colors';
import Fonts from '../../components/fonts';
import FooterBottom from '../../components/footer';
import {Actions} from 'react-native-router-flux';
import axios from 'axios';
import Config from '../../config.js';
import Loader from '../../components/loader';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class ReportCreate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: this.props.title,
			description: this.props.description,
			userId: '',
			jenis: this.props.jenis,
			categoryId: this.props.categoryId,
			categoryName: this.props.categoryName,
			categoryIcon: this.props.categoryIcon,
			avatarSource: this.props.avatarSource,
			path: this.props.path,
			street: this.props.street,
			additionalDescription: this.props.additionalDescription,
			isLoading: false,
			isLoadingInit: true
		};

		this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
	};

	componentWillMount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
		AsyncStorage.getItem('user', (error, result) => {
			if (result) {
				let resultParsed = JSON.parse(result)
				this.setState({
					userId: resultParsed.token.user_id,
					isLoadingInit: false
				});
			} else {
				this.setState({
					isLoadingInit: false
				});
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

	showLoading(loading) {
		this.setState({ isLoading: loading })
	};

	selectPhotoTapped() {
		const options = {
		  	quality: 1.0,
		  	maxWidth: 500,
		  	maxHeight: 500,
		  	storageOptions: {
				skipBackup: true,
		  	},
		};
	
		ImagePicker.showImagePicker(options, response => {
			if (response.didCancel) {
				console.log('User cancelled photo picker');
			} else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			} else if (response.customButton) {
				console.log('User tapped custom button: ', response.customButton);
			} else {
				let source = {uri: response.uri};
				this.setState({
					avatarSource: source,
					path : 'data:'+response.type+';base64,' +response.data
				});
			}
		});
	};

	openCategory() {
		Actions.reportCategory({
			title: this.state.title,
			description: this.state.description,
			jenis: this.state.jenis,
			path: this.state.path,
			avatarSource: this.state.avatarSource,
			additionalDescription: this.state.additionalDescription,
			street: this.state.street,
			categoryId: this.state.categoryId,
			categoryName: this.state.categoryName,
			categoryIcon: this.state.categoryIcon,
		})
	}

	createReport() {
		if(this.state.avatarSource == null) {
			Toast.message('Silahkan pilih gambar!');
		} else if (this.state.title == null) {
			Toast.message('Judul harus diisi!');
		} else if (this.state.description == null) {
			Toast.message('Isi laporan harus diisi!');
		} else if (this.state.jenis == null) {
			Toast.message('Silahkan pilih jenis laporan!');
		} else if (this.state.categoryId == null) {
			Toast.message('Silahkan pilih kategori!');
		} else if (this.state.street == null) {
			Toast.message('Alamat harus diisi!');
		} else if (this.state.additionalDescription == null) {
			Toast.message('Keterangan lokasi harus diisi!');
		} else {
			this.showLoading(true);
			axios({
				method: 'POST',
				url: Config.API_URL + '/api/v1/report',
				data: {
					user_id: this.state.userId,
					status_id: 1,
					category_id: this.state.categoryId,
					title: this.state.title,
					description: this.state.description,
					type: this.state.jenis,
					images: {
						image: this.state.path
					},
					address: {
						lat: '0.9041784',
						lng: '108.9772085',
						additional_description: this.state.additionalDescription,
						street_1: this.state.street,
					}
				},
				timeout: 35000
			}).then((response) => {
				if (response.data.header.message == 'Success') {
					this.showLoading(false);
					Toast.message('Laporan berhasil dikirim');
					Actions.home()
				} else {
					this.showLoading(false);
					Toast.message(response.data.header.reason.id);
				}
			}).catch((error) => {
				console.log(error.response);
				this.showLoading(false);
				Toast.message(error.response.data.header.reason.id);
			});
		}
	}

	render() {
		if(this.state.isLoadingInit) {
			return(
				<Container></Container>
			);
		} else {
			if(this.state.userId == ''){
				return(
					<Container>
						<StatusBar barStyle="dark-content" backgroundColor={Colors.WHITE} />
						<Content>
							<View style={{ padding: 50, flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
								<Image style={{ width: 175, height: 125, tintColor: Colors.PRIMARY }} resizeMode='cover' source={require('../../components/images/logoPotrait.png')}></Image>
								<View style={{ marginTop: 50 }}>
									<Text style={{ fontSize: 14, color: Colors.PRIMARY, fontFamily: Fonts.REGULAR }}>Harap Login Terlebih Dahulu!</Text>
									<Button block style={{ height: 35, widht: 50, marginTop: 16, borderRadius: 8, backgroundColor: Colors.PRIMARY }} onPress={() => Actions.login()}>
										<Text style={{ fontSize: 14, color: Colors.WHITE, fontFamily: Fonts.REGULAR }} uppercase={false}>Ke Halaman Login</Text>
									</Button>
								</View>
							</View>
						</Content>
						<FooterBottom activeIndex={1} />
					</Container>
				);
			} else {
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
							<Right>
								<Button style={{ backgroundColor: '#32cc34', height: 30, borderRadius: 4, marginRight: 8 }} onPress={() => this.createReport()}>
									<Text style={{ fontSize: 14, color: Colors.WHITE, fontFamily: Fonts.REGULAR }} uppercase={false}>Kirim</Text>
								</Button>
							</Right>
						</Header>
						<StatusBar barStyle="light-content" backgroundColor= {Colors.PRIMARY} />
						<Content style={{ backgroundColor: Colors.WHITE }}>
							<View style={{ margin: 16 }}>
								{ this.state.avatarSource == null ?
									<ImageBackground style={{ height: 200 }} source={require('../../components/images/backgroundProfile.png')}>
										<View style={{ alignItems: 'flex-end', flex: 1, justifyContent: 'flex-end', margin: 12 }}>
											<TouchableOpacity style={{ borderRadius: 50, backgroundColor: Colors.WHITE, height: 40, width: 40, alignItems: 'center', justifyContent: 'center' }} onPress={this.selectPhotoTapped.bind(this)}>
												<Image style={{ height: 22, width: 22, tintColor: Colors.PRIMARY }} resizeMode='contain' source={require('../../components/images/camera.png')}></Image>
											</TouchableOpacity>
										</View>
									</ImageBackground>
								:
									<ImageBackground style={{ height: 200 }} source={this.state.avatarSource}>
										<View style={{ alignItems: 'flex-end', flex: 1, justifyContent: 'flex-end', margin: 12 }}>
											<TouchableOpacity style={{ borderRadius: 50, backgroundColor: Colors.WHITE, height: 40, width: 40, alignItems: 'center', justifyContent: 'center' }} onPress={this.selectPhotoTapped.bind(this)}>
												<Image style={{ height: 22, width: 22, tintColor: Colors.PRIMARY }} resizeMode='contain' source={require('../../components/images/camera.png')}></Image>
											</TouchableOpacity>
										</View>
									</ImageBackground>
								}
							</View>
							<View style={{ padding: 16, backgroundColor: '#e9e9eb', flexDirection: 'row' }}>
								<View style={{ flex: 0.15 }}>
									<Image style={{ height: 40, width: 40 }} resizeMode='cover' source={require('../../components/images/avatar.png')}></Image>
								</View>
								<View style={{ flex: 0.85 }}>
									<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>Judul Laporan</Text>
									<Item regular style={{ marginTop: 8, borderColor: 'transparent' }}>
										<Input style={{ backgroundColor: '#F4F4F5', borderRadius: 8, fontFamily: Fonts.REGULAR }} value={this.state.title} onChangeText={(value) => this.setState({ title: value })} />
									</Item>
									<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 16 }}>Isi Laporan</Text>
									<Textarea style={{ backgroundColor: '#F4F4F5', borderRadius: 8, fontFamily: Fonts.REGULAR, borderColor: 'transparent', marginTop: 8 }} rowSpan={8} bordered value={this.state.description} onChangeText={(value) => this.setState({ description: value })} />
								</View>
							</View>
							<View style={{ padding: 16, backgroundColor: '#e9e9eb', marginTop: 16 }}>
								<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>Pilih Jenis Laporan</Text>
								<View style={{ flexDirection: 'row', marginTop: 8, justifyContent: 'space-between' }}>
									<TouchableOpacity style={{ backgroundColor: this.state.jenis == 'aduan' ? '#18af7b' : '#7e7674', borderRadius: 4, flex: 1, alignItems: 'center', marginRight: 4, marginLeft: 4, padding: 4 }} onPress={() => this.setState({ jenis: 'aduan' })}>
										<Text style={{ fontSize: 12, color: Colors.WHITE, fontFamily: Fonts.REGULAR }}>Aduan</Text>
									</TouchableOpacity>
									<TouchableOpacity style={{ backgroundColor: this.state.jenis == 'pujian' ? '#18af7b' : '#7e7674', borderRadius: 4, flex: 1, alignItems: 'center', marginRight: 4, marginLeft: 4, padding: 4 }} onPress={() => this.setState({ jenis: 'pujian' })}>
										<Text style={{ fontSize: 12, color: Colors.WHITE, fontFamily: Fonts.REGULAR }}>Pujian</Text>
									</TouchableOpacity>
									<TouchableOpacity style={{ backgroundColor: this.state.jenis == 'rekomendasi' ? '#18af7b' : '#7e7674', borderRadius: 4, flex: 1, alignItems: 'center', marginRight: 4, marginLeft: 4, padding: 4 }} onPress={() => this.setState({ jenis: 'rekomendasi' })}>
										<Text style={{ fontSize: 12, color: Colors.WHITE, fontFamily: Fonts.REGULAR }}>Rekomendasi</Text>
									</TouchableOpacity>
									<TouchableOpacity style={{ backgroundColor: this.state.jenis == 'saran' ? '#18af7b' : '#7e7674', borderRadius: 4, flex: 1, alignItems: 'center', marginRight: 4, marginLeft: 4, padding: 4 }} onPress={() => this.setState({ jenis: 'saran' })}>
										<Text style={{ fontSize: 12, color: Colors.WHITE, fontFamily: Fonts.REGULAR }}>Saran</Text>
									</TouchableOpacity>
								</View>
							</View>
							<View style={{ padding: 16, backgroundColor: '#e9e9eb', marginTop: 16 }}>
								<TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} onPress={() => this.openCategory()}>
									{
										this.state.categoryName == null ?
											<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>Pilih Kategori Laporan</Text>
										:
											<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>Kategori : {this.state.categoryName}</Text>										
									}
									{
										this.state.categoryIcon == null ?
											<View style={{ flexDirection: 'row', alignItems: 'center' }}>
												<Icon name="chevron-right" size={20} color={Colors.BLACK} style={{ marginLeft: 16 }} />
											</View>
										:
											<View style={{ flexDirection: 'row', alignItems: 'center' }}>
												<Image style={{ height: 45, width: 45 }} resizeMode='cover' source={require('../../components/images/iconCategoryLapor.png')}></Image>
												<Icon name="chevron-right" size={20} color={Colors.BLACK} style={{ marginLeft: 16 }} />
											</View>
									}
								</TouchableOpacity>
							</View>
							<View style={{ padding: 16, backgroundColor: '#e9e9eb', marginTop: 16 }}>
								<View style={{ flexDirection: 'row' }}>
									<View style={{ flex: 1 }}>
										<Item inlineLabel>
											<Input style={{ fontFamily: Fonts.REGULAR }} value={this.state.street} placeholder='Tentukan Lokasi' onChangeText={(value) => this.setState({ street: value })} />
										</Item>
									</View>
									{/* <View style={{ flex: 0.15, alignItems: 'center' }}>
										<Image style={{ height: 50, width: 50, alignSelf: 'flex-end' }} resizeMode='cover' resizeMethod='scale' source={{ uri: 'https://thumbs.dreamstime.com/t/street-map-sample-streets-river-parks-44060133.jpg' }} />
									</View> */}
								</View>
								<Item regular style={{ marginTop: 8, borderColor: 'transparent', marginTop: 16 }}>
									<Input style={{ backgroundColor: '#F4F4F5', borderRadius: 8, fontFamily: Fonts.REGULAR }} placeholder='Keterangan (cth. lokasi, nama bangunan)' value={this.state.additionalDescription} onChangeText={(value) => this.setState({ additionalDescription: value })} />
								</Item>
							</View>
						</Content>
						<Loader loading={this.state.isLoading} />
					</Container>
				);
			}
		}
	};
};
