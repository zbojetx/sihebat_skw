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

export default class NewsList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search: ''
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
		Actions.home();
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
						<Text style={{ fontSize: 18, color: Colors.WHITE, fontFamily: Fonts.REGULAR, marginLeft: 16 }}>Berita</Text>
					</Body>
					<Right/>
				</Header>
				<StatusBar barStyle="light-content" backgroundColor= {Colors.PRIMARY} />
				<Content style={{ backgroundColor: Colors.WHITE }}>
					<View style={{ backgroundColor: Colors.PRIMARY, paddingLeft: 16, paddingRight: 16, paddingBottom: 16 }}>
						<Item style={{ backgroundColor: '#e8a8ab', borderRadius: 4, height: 40 }}>
							<Image style={{ height: 20, width: 20, margin: 10, tintColor: Colors.WHITE }} resizeMode='cover' source={require('../../components/images/footer/search.png')}></Image>
							<Input style={{ fontFamily: Fonts.LIGHT, color: Colors.WHITE, fontSize: 16 }} placeholder="Cari berita ..." placeholderTextColor={Colors.WHITE} value={this.state.search} onChangeText={(value) => this.setState({ search: value })} />
						</Item>
					</View>
					<View style={{ marginTop: 16 }}>
						<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
							<View style={{ margin: 8 }} />
							<TouchableOpacity style={styles.boxMenu} key={Math.random()} onPress={() => Actions.newsDetail()}>
								<Image style={{ height: 100, width: 300, borderTopLeftRadius: 5, borderTopRightRadius: 5 }} resizeMode='cover' resizeMethod='scale' source={require('../../components/images/berita/berita5.jpg')} />
								<View style={{ padding: 6 }}>
									<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Ratusan Orang di Singkawang Diduga Terinfeksi Hepatitis A</Text>
									<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 6 }}>Singkawang News</Text>
									<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.REGULAR, marginTop: 6 }}>12 Juli 2019</Text>
								</View>
							</TouchableOpacity>
							<TouchableOpacity style={styles.boxMenu} key={Math.random()} onPress={() => Actions.newsDetail()}>
								<Image style={{ height: 100, width: 300, borderTopLeftRadius: 5, borderTopRightRadius: 5 }} resizeMode='cover' resizeMethod='scale' source={require('../../components/images/berita/berita6.jpg')} />
								<View style={{ padding: 6 }}>
									<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Lapas Singkawang Perketat Izin bagi Tamu Napi Teroris Bom Thamrin</Text>
									<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 6 }}>Singkawang News</Text>
									<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.REGULAR, marginTop: 6 }}>12 Juli 2019</Text>
								</View>
							</TouchableOpacity>
						</ScrollView>
					</View>	

					<View style={{ marginTop: 8 }}>
						<TouchableOpacity style={{ flex: 1, flexDirection: 'row', paddingTop: 16, paddingLeft: 16, paddingRight: 16 }} onPress={() => Actions.newsDetail()}>
							<View style={{ flex: 0.7 }}>
								<View style={{ backgroundColor: '#55aadc', padding: 4, borderRadius: 4, alignSelf: 'flex-start' }}>
									<Text style={{ fontSize: 10, color: Colors.WHITE, fontFamily: Fonts.REGULAR }}>Pariwisata</Text>
								</View>
								<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.MEDIUM, marginTop: 6 }}>Klarifikasi Sinka Zoo Singkawang soal Viral Beruang Madu Kurus</Text>
								<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 6 }}>Singkawang News</Text>
								<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.REGULAR, marginTop: 6 }}>12 Juli 2019</Text>
							</View>
							<View style={{ flex: 0.3, alignItems: 'flex-end' }}>
								<Image style={{ height: 100, width: 100, borderRadius: 4 }} resizeMode='cover' resizeMethod='scale' source={require('../../components/images/berita/berita1.jpg')} />
							</View>
						</TouchableOpacity>
						<TouchableOpacity style={{ flex: 1, flexDirection: 'row', paddingTop: 16, paddingLeft: 16, paddingRight: 16 }} onPress={() => Actions.newsDetail()}>
							<View style={{ flex: 0.7 }}>
								<View style={{ backgroundColor: '#ff7800', padding: 4, borderRadius: 4, alignSelf: 'flex-start' }}>
									<Text style={{ fontSize: 10, color: Colors.WHITE, fontFamily: Fonts.REGULAR }}>Pariwisata</Text>
								</View>
								<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.MEDIUM, marginTop: 6 }}>Festival Seni Singkawang Agora, Eksplorasi dan Berkreasi di Ruang Terbuka</Text>
								<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 6 }}>Singkawang News</Text>
								<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.REGULAR, marginTop: 6 }}>12 Juli 2019</Text>
							</View>
							<View style={{ flex: 0.3, alignItems: 'flex-end' }}>
								<Image style={{ height: 100, width: 100, borderRadius: 4 }} resizeMode='cover' resizeMethod='scale' source={require('../../components/images/berita/berita2.jpg')} />
							</View>
						</TouchableOpacity>
						<TouchableOpacity style={{ flex: 1, flexDirection: 'row', paddingTop: 16, paddingLeft: 16, paddingRight: 16 }} onPress={() => Actions.newsDetail()}>
							<View style={{ flex: 0.7 }}>
								<View style={{ backgroundColor: '#dc5573', padding: 4, borderRadius: 4, alignSelf: 'flex-start' }}>
									<Text style={{ fontSize: 10, color: Colors.WHITE, fontFamily: Fonts.REGULAR }}>Pariwisata</Text>
								</View>
								<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.MEDIUM, marginTop: 6 }}>Pembangunan Bandara Singkawang Dimulai</Text>
								<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 6 }}>Singkawang News</Text>
								<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.REGULAR, marginTop: 6 }}>12 Juli 2019</Text>
							</View>
							<View style={{ flex: 0.3, alignItems: 'flex-end' }}>
								<Image style={{ height: 100, width: 100, borderRadius: 4 }} resizeMode='cover' resizeMethod='scale' source={require('../../components/images/berita/berita3.jpg')} />
							</View>
						</TouchableOpacity>
					</View>

					<View style={{ marginTop: 8 }}>
						<View style={{ padding: 16 }}>
							<Text style={{ fontSize: 16, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Kategori</Text>
							<View style={{ flexDirection: 'row', marginTop: 8, justifyContent: 'space-between' }}>
								<View style={{ backgroundColor: '#55aadc', borderRadius: 4, flex: 1, alignItems: 'center', marginRight: 4, marginLeft: 4, padding: 4 }}>
									<Text style={{ fontSize: 10, color: Colors.WHITE, fontFamily: Fonts.REGULAR }}>Pariwisata</Text>
								</View>
								<View style={{ backgroundColor: '#ff7800', borderRadius: 4, flex: 1, alignItems: 'center', marginRight: 4, marginLeft: 4, padding: 4 }}>
									<Text style={{ fontSize: 10, color: Colors.WHITE, fontFamily: Fonts.REGULAR }}>Kesehatan</Text>
								</View>
								<View style={{ backgroundColor: '#dc5573', borderRadius: 4, flex: 1, alignItems: 'center', marginRight: 4, marginLeft: 4, padding: 4 }}>
									<Text style={{ fontSize: 10, color: Colors.WHITE, fontFamily: Fonts.REGULAR }}>Makanan</Text>
								</View>
								<View style={{ backgroundColor: '#26d41b', borderRadius: 4, flex: 1, alignItems: 'center', marginRight: 4, marginLeft: 4, padding: 4 }}>
									<Text style={{ fontSize: 10, color: Colors.WHITE, fontFamily: Fonts.REGULAR }}>Ekonomi</Text>
								</View>
								<View style={{ backgroundColor: '#a427c2', borderRadius: 4, flex: 1, alignItems: 'center', marginRight: 4, marginLeft: 4, padding: 4 }}>
									<Text style={{ fontSize: 10, color: Colors.WHITE, fontFamily: Fonts.REGULAR }}>International</Text>
								</View>
							</View>
						</View>
					</View>

					<View style={{ marginTop: 8 }}>
						<TouchableOpacity style={{ flex: 1, flexDirection: 'row', paddingTop: 16, paddingLeft: 16, paddingRight: 16 }} onPress={() => Actions.newsDetail()}>
							<View style={{ flex: 0.7 }}>
								<View style={{ backgroundColor: '#26d41b', padding: 4, borderRadius: 4, alignSelf: 'flex-start' }}>
									<Text style={{ fontSize: 10, color: Colors.WHITE, fontFamily: Fonts.REGULAR }}>Pariwisata</Text>
								</View>
								<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.MEDIUM, marginTop: 6 }}>Singkawang Kota Paling Toleran di Indonesia</Text>
								<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 6 }}>Singkawang News</Text>
								<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.REGULAR, marginTop: 6 }}>12 Juli 2019</Text>
							</View>
							<View style={{ flex: 0.3, alignItems: 'flex-end' }}>
								<Image style={{ height: 100, width: 100, borderRadius: 4 }} resizeMode='cover' resizeMethod='scale' source={require('../../components/images/berita/berita4.jpg')} />
							</View>
						</TouchableOpacity>
						<TouchableOpacity style={{ flex: 1, flexDirection: 'row', paddingTop: 16, paddingLeft: 16, paddingRight: 16 }} onPress={() => Actions.newsDetail()}>
							<View style={{ flex: 0.7 }}>
								<View style={{ backgroundColor: '#a427c2', padding: 4, borderRadius: 4, alignSelf: 'flex-start' }}>
									<Text style={{ fontSize: 10, color: Colors.WHITE, fontFamily: Fonts.REGULAR }}>Kesehatan</Text>
								</View>
								<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.MEDIUM, marginTop: 6 }}>Ratusan Orang di Singkawang Diduga Terinfeksi Hepatitis A</Text>
								<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 6 }}>Singkawang News</Text>
								<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.REGULAR, marginTop: 6 }}>12 Juli 2019</Text>
							</View>
							<View style={{ flex: 0.3, alignItems: 'flex-end' }}>
								<Image style={{ height: 100, width: 100, borderRadius: 4 }} resizeMode='cover' resizeMethod='scale' source={require('../../components/images/berita/berita5.jpg')} />
							</View>
						</TouchableOpacity>
						<TouchableOpacity style={{ flex: 1, flexDirection: 'row', paddingTop: 16, paddingLeft: 16, paddingRight: 16 }} onPress={() => Actions.newsDetail()}>
							<View style={{ flex: 0.7 }}>
								<View style={{ backgroundColor: '#55aadc', padding: 4, borderRadius: 4, alignSelf: 'flex-start' }}>
									<Text style={{ fontSize: 10, color: Colors.WHITE, fontFamily: Fonts.REGULAR }}>Hukum</Text>
								</View>
								<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.MEDIUM, marginTop: 6 }}>Lapas Singkawang Perketat Izin bagi Tamu Napi Teroris Bom Thamrin</Text>
								<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 6 }}>Singkawang News</Text>
								<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.REGULAR, marginTop: 6 }}>12 Juli 2019</Text>
							</View>
							<View style={{ flex: 0.3, alignItems: 'flex-end' }}>
								<Image style={{ height: 100, width: 100, borderRadius: 4 }} resizeMode='cover' resizeMethod='scale' source={require('../../components/images/berita/berita6.jpg')} />
							</View>
						</TouchableOpacity>
					</View>
					<View style={{ margin: 16 }} />
				</Content>
			</Container>
		);
	};
};

const styles = StyleSheet.create({
	boxMenu: {
		width: 300,
		shadowColor: Colors.BLACK,
		shadowOpacity: 0.8,
		elevation: 2,
		backgroundColor: Colors.WHITE,
		borderRadius: 5,
		marginRight: 16,
		marginBottom: 8
	}
});
