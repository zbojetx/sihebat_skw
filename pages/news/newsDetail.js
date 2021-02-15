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
	StyleSheet
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

export default class NewsDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			comment: ''
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
		Actions.newsList();
		return true;
	};

	render() {
		return(
			<Container>
				<Header style={{ backgroundColor: Colors.WHITE }}>
					<Left style={{ flex: 0 }}>
						<Button transparent onPress={() => this.handleBackButton()}>
							<Image style={{ height: 18, width: 18, tintColor: Colors.PRIMARY }} resizeMode='contain' source={require('../../components/images/back.png')}></Image>
						</Button>
					</Left>
					<Body>
						<Text style={{ fontSize: 18, color: Colors.PRIMARY, fontFamily: Fonts.REGULAR, marginLeft: 16 }}>Klarifikasi Sinka Zoo...</Text>
					</Body>
					<Right>
						<Button transparent onPress={() => alert('share')}>
							<Image style={{ height: 18, width: 18, tintColor: Colors.PRIMARY }} resizeMode='contain' source={require('../../components/images/shareOutline.png')}></Image>
						</Button>
					</Right>
				</Header>
				<StatusBar barStyle="dark-content" backgroundColor={Colors.WHITE} />
				<Content style={{ backgroundColor: Colors.WHITE }}>
					<View style={{ padding: 16 }}>
						<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.REGULAR }}>Singkawang News, 12 Juli 2019</Text>
						<Text style={{ fontSize: 22, color: Colors.BLACK, fontFamily: Fonts.BOLD, marginTop: 16 }}>Klarifikasi Sinka Zoo Singkawang soal Viral Beruang Madu Kurus</Text>
						<Image style={{ height: 200, width: '100%', marginTop: 16 }} resizeMode='cover' source={require('../../components/images/berita/berita1.jpg')}></Image>
						<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 16 }}>Pengelola Sinka Zoo, Tanjung Bajau Singkawang akhirnya memberikan keterangan mengenai kondisi beruang madu yang kurus dan sempat viral di media sosial. Pihak kebun binatang menyatakan bahwa satwa tersebut dalam kondisi sehat. "Sebenarnya beruang madu tersebut sudah kita karantina dan itu berkat permintaan dari Balai Konservasi Wilayah III Singkawang," kata salah satu tim kesehatan Sinka Zoo Singkawang, Ruby Hadi Saputra, memberikan klarifikasi kepada wartawan di lokasi di Singkawang, Sabtu, 15 Juni 2019, dilansir Antara.</Text>
						<Text style={{ fontSize: 14, color: '#4b4b4b', fontFamily: Fonts.MEDIUM, marginTop: 32 }}>Komentar</Text>
						<Textarea style={{ backgroundColor: Colors.INPUT, borderRadius: 8, fontFamily: Fonts.REGULAR, borderColor: 'transparent', marginTop: 8 }} rowSpan={3} bordered placeholder="Tulis komentar ..." placeholderTextColor='#6b6b6b' value={this.state.comment} onChangeText={(value) => this.setState({ comment: value })} />
						<View style={{ flex: 1, marginTop: 12 }}>
							<Button style={{ height: 30, backgroundColor: Colors.PRIMARY, borderRadius: 6, alignSelf: 'flex-end' }} onPress={() => Actions.newsList()}>
								<Text style={{ fontSize: 14, color: Colors.WHITE, fontFamily: Fonts.REGULAR }} uppercase={false}>Kirim</Text>
							</Button>
						</View>
					</View>
					<View style={{ padding: 16, backgroundColor: Colors.INPUT, marginTop: 8 }}>
						<View style={{ padding: 8, backgroundColor: Colors.WHITE, borderRadius: 8, marginBottom: 8 }}>
							<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Pius Edi</Text>
							<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 4 }}>kasihan beruangnya</Text>
							<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.LIGHT, marginTop: 8 }}>15 menit yang lalu</Text>
						</View>
						<View style={{ padding: 8, backgroundColor: Colors.WHITE, borderRadius: 8, marginBottom: 8 }}>
							<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Javear</Text>
							<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 4 }}>harus segera diusut</Text>
							<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.LIGHT, marginTop: 8 }}>17 menit yang lalu</Text>
						</View>
					</View>
				</Content>
			</Container>
		);
	};
};
