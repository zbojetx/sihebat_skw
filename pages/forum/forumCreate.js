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
	Spinner,
	Textarea
} from 'native-base';
import {
	Toast
} from 'teaset';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ImagePicker from 'react-native-image-picker';
import Colors from '../../components/colors';
import Fonts from '../../components/fonts';
import {Actions} from 'react-native-router-flux';
import axios from 'axios';
import Config from '../../config.js';
import Loader from '../../components/loader';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class ForumCreate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: '',
			description: '',
			location: '',
			userId: '',
			isLoading: false,
			avatarSource: null,
			path: ''
		};

		this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
	};

	componentWillMount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
		AsyncStorage.getItem('user', (error, result) => {
			if (result) {
				let resultParsed = JSON.parse(result)
				this.setState({
					userId: resultParsed.token.user_id
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

	showLoading(loading) {
		this.setState({ isLoading: loading })
	};

	handleBackButton = () => {
		Actions.forum();
		return true;
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

	createReport() {
		if(this.state.avatarSource === null) {
			Toast.fail('Silahkan pilih gambar!');
		} else if (this.state.title == '') {
			Toast.fail('Judul harus diisi!');
		} else if (this.state.description == '') {
			Toast.fail('Isi postingan harus diisi!');
		} else {
			this.showLoading(true);
			axios({
				method: 'POST',
				url: Config.API_URL + '/api/v1/timeline',
				data: {
					user_id: this.state.userId,
					title: this.state.title,
					description: this.state.description,
					images: {
						image: this.state.path
					}
				},
				timeout: 35000
			}).then((response) => {
				if (response.data.header.message == 'Success') {
					this.showLoading(false);
					Actions.forum();
				} else {
					this.showLoading(false);
					Toast.message(response.data.header.reason.id);
				}
			}).catch((error) => {
				this.showLoading(false);
				Toast.message(error.response.data.header.reason.id);
			});
		}
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
						<Text style={{ fontSize: 18, color: Colors.WHITE, fontFamily: Fonts.REGULAR, marginLeft: 16 }}>Tambah Postingan</Text>
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
						{ this.state.avatarSource === null ?
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
					<View style={{ padding: 16, backgroundColor: '#e9e9eb' }}>
						<View>
							<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>Judul Postingan</Text>
							<Item regular style={{ marginTop: 8, borderColor: 'transparent' }}>
								<Input style={{ backgroundColor: '#F4F4F5', borderRadius: 8, fontFamily: Fonts.REGULAR }} value={this.state.title} onChangeText={(value) => this.setState({ title: value })} />
							</Item>
						</View>
						<View style={{ marginTop: 16 }}>
							<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>Isi Postingan</Text>
							<Textarea style={{ backgroundColor: '#F4F4F5', borderRadius: 8, fontFamily: Fonts.REGULAR, borderColor: 'transparent', marginTop: 8 }} rowSpan={10} bordered value={this.state.description} onChangeText={(value) => this.setState({ description: value })} />
						</View>
					</View>
				</Content>
				<Loader loading={this.state.isLoading} />
			</Container>
		);
	};
};
