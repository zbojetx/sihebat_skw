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
	Spinner,
	Textarea
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

export default class ForumCategory extends Component {
	constructor(props) {
		super(props);
		this.state = {
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
	};

	handleBackButton = () => {
		Actions.forumCreate();
		return true;
	};

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
						<Text style={{ fontSize: 18, color: Colors.WHITE, fontFamily: Fonts.REGULAR, marginLeft: 16 }}>Kategori</Text>
					</Body>
					<Right />
				</Header>
				<StatusBar barStyle="light-content" backgroundColor= {Colors.PRIMARY} />
				<Content style={{ backgroundColor: Colors.WHITE }}>
					<View style={{ padding: 32 }}>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
							<View>
								<Image style={{ height: 75, width: 75 }} resizeMode='cover' source={require('../../components/images/iconCategoryLapor.png')}></Image>
								<Text style={{ fontSize: 18, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 16 }}>Kategori</Text>
							</View>
							<View>
								<Image style={{ height: 75, width: 75 }} resizeMode='cover' source={require('../../components/images/iconCategoryLapor.png')}></Image>
								<Text style={{ fontSize: 18, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 16 }}>Kategori</Text>
							</View>
							<View>
								<Image style={{ height: 75, width: 75 }} resizeMode='cover' source={require('../../components/images/iconCategoryLapor.png')}></Image>
								<Text style={{ fontSize: 18, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 16 }}>Kategori</Text>
							</View>
							<View>
								<Image style={{ height: 75, width: 75 }} resizeMode='cover' source={require('../../components/images/iconCategoryLapor.png')}></Image>
								<Text style={{ fontSize: 18, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 16 }}>Kategori</Text>
							</View>
						</View>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 32 }}>
							<View>
								<Image style={{ height: 75, width: 75 }} resizeMode='cover' source={require('../../components/images/iconCategoryLapor.png')}></Image>
								<Text style={{ fontSize: 18, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 16 }}>Kategori</Text>
							</View>
							<View>
								<Image style={{ height: 75, width: 75 }} resizeMode='cover' source={require('../../components/images/iconCategoryLapor.png')}></Image>
								<Text style={{ fontSize: 18, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 16 }}>Kategori</Text>
							</View>
							<View>
								<Image style={{ height: 75, width: 75 }} resizeMode='cover' source={require('../../components/images/iconCategoryLapor.png')}></Image>
								<Text style={{ fontSize: 18, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 16 }}>Kategori</Text>
							</View>
							<View>
								<Image style={{ height: 75, width: 75 }} resizeMode='cover' source={require('../../components/images/iconCategoryLapor.png')}></Image>
								<Text style={{ fontSize: 18, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 16 }}>Kategori</Text>
							</View>
						</View>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 32 }}>
							<View>
								<Image style={{ height: 75, width: 75 }} resizeMode='cover' source={require('../../components/images/iconCategoryLapor.png')}></Image>
								<Text style={{ fontSize: 18, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 16 }}>Kategori</Text>
							</View>
							<View>
								<Image style={{ height: 75, width: 75 }} resizeMode='cover' source={require('../../components/images/iconCategoryLapor.png')}></Image>
								<Text style={{ fontSize: 18, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 16 }}>Kategori</Text>
							</View>
							<View>
								<Image style={{ height: 75, width: 75 }} resizeMode='cover' source={require('../../components/images/iconCategoryLapor.png')}></Image>
								<Text style={{ fontSize: 18, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 16 }}>Kategori</Text>
							</View>
							<View>
								<Image style={{ height: 75, width: 75 }} resizeMode='cover' source={require('../../components/images/iconCategoryLapor.png')}></Image>
								<Text style={{ fontSize: 18, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 16 }}>Kategori</Text>
							</View>
						</View>
					</View>
				</Content>
			</Container>
		);
	};
};
