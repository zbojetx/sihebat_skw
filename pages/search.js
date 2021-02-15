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
	Tabs,
	Tab
} from 'native-base';
import {
	Toast
} from 'teaset';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FooterBottom from '../components/footer';
import Colors from '../components/colors';
import Fonts from '../components/fonts';
import {Actions} from 'react-native-router-flux';
import axios from 'axios';
import Config from '../config.js';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class Search extends Component {
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
		if(this.state.doubleBackToExitPressedOnce) {
			BackHandler.exitApp();
		}

		this.setState({ doubleBackToExitPressedOnce: true });
		Toast.message('Tekan sekali lagi untuk keluar!');

		setTimeout(() => {
			this.setState({ doubleBackToExitPressedOnce: false });
		}, 3000);
		return true;
	};

	render() {
		return(
			<Container>
				<Header searchBar rounded style={{ backgroundColor: Colors.PRIMARY }}>
					<Item style={{ backgroundColor: '#e8a8ab' }}>
						<Image style={{ height: 20, width: 20, margin: 10, tintColor: Colors.WHITE }} resizeMode='cover' source={require('../components/images/footer/search.png')}></Image>
						<Input style={{ fontFamily: Fonts.LIGHT, color: Colors.WHITE, fontSize: 16 }} placeholder="Cari ..." placeholderTextColor={Colors.WHITE} value={this.state.search} onChangeText={(value) => this.setState({ search: value })} />
					</Item>
				</Header>
				<StatusBar barStyle="light-content" backgroundColor= {Colors.PRIMARY} />
				<Content>
					<Tabs tabBarUnderlineStyle={{ borderColor: Colors.PRIMARY, borderBottomWidth: 1 }} style={{ borderColor: '#979797', borderBottomWidth: 0.3 }}>
						<Tab heading="Laporan" tabStyle={{ backgroundColor: Colors.WHITE }} textStyle={{ color: '#7e7674', fontSize: 14, fontFamily: Fonts.LIGHT }} activeTabStyle={{ backgroundColor: Colors.WHITE }} activeTextStyle={{ color: Colors.PRIMARY, fontSize: 14, fontFamily: Fonts.REGULAR }}>
							<View style={{ borderTopWidth: 1, borderColor: Colors.BORDER, borderBottomWidth: 1, marginTop: 16 }}>
								<View style={{ flexDirection: 'row', padding: 12, justifyContent: 'space-between', alignItems: 'center' }}>
									<View style={{ flexDirection: 'row', alignItems: 'center' }}>
										<Image style={{ height: 40, width: 40 }} resizeMode='cover' source={require('../components/images/avatar.png')}></Image>
										<View style={{ marginLeft: 20 }}>
											<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>Pius Edi W P</Text>
											<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.LIGHT }}>3 jam yang lalu</Text>
											<View style={{ flexDirection: 'row', marginTop: 2 }}>
												<Icon name="map-marker-alt" size={10} color={'#3d619b'} />
												<Text style={{ fontSize: 12, color: '#3d619b', fontFamily: Fonts.LIGHT, marginLeft: 5, textDecorationLine: 'underline' }}>Singkawang Barat</Text>
											</View>
										</View>
									</View>
									<View>
										<Image style={{ height: 40, width: 40 }} resizeMode='cover' source={require('../components/images/iconCategoryLapor.png')}></Image>
									</View>
								</View>
								<Image style={{ height: 200 }} resizeMode='cover' source={require('../components/images/report/report1.jpg')}></Image>
								<View style={{ flexDirection: 'row', padding: 12, flex: 1 }}>
									<View style={{ flex: 0.7, marginRight: 6 }}>
										<Text style={{ fontSize: 12, color: '#a9a8a8', fontFamily: Fonts.REGULAR }}>Jalan berlubang menyebabkan kecelakaan membuat prihatin warga.</Text>
									</View>
									<View style={{ flex: 0.3, marginLeft: 6, alignItems: 'flex-end' }}>
										<View style={{ backgroundColor: '#18af7b', padding: 4, borderRadius: 3 }}>
											<Text style={{ fontSize: 10, color: Colors.WHITE, fontFamily: Fonts.REGULAR }}>Aduan</Text>
										</View>
										<View style={{ backgroundColor: '#697278', padding: 4, borderRadius: 3, marginTop: 4 }}>
											<Text style={{ fontSize: 10, color: Colors.WHITE, fontFamily: Fonts.REGULAR }}>Tertunda</Text>
										</View>
									</View>
								</View>
								<View style={{ borderTopWidth: 0.5, borderColor: Colors.BORDER, borderBottomWidth: 0.5, marginTop: 6, flexDirection: 'row', }}>
									<View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, borderColor: Colors.BORDER, borderRightWidth: 0.5 }}>
										<Image style={{ height: 18, width: 18 }} resizeMode='contain' source={require('../components/images/likeOutline.png')}></Image>
										<View style={{ marginLeft: 6 }}>
											<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>20</Text>
											<Text style={{ fontSize: 10, color: Colors.GREY, fontFamily: Fonts.LIGHT }}>Suka</Text>
										</View>
									</View>
									<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 12, borderColor: Colors.BORDER, borderRightWidth: 0.5 }} onPress={() => Actions.comment()}>
										<Image style={{ height: 18, width: 18 }} resizeMode='contain' source={require('../components/images/commentOutline.png')}></Image>
										<View style={{ marginLeft: 6 }}>
											<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>2</Text>
											<Text style={{ fontSize: 10, color: Colors.GREY, fontFamily: Fonts.LIGHT }}>Komentar</Text>
										</View>
									</TouchableOpacity>
								</View>
								<View style={{ padding: 12 }}>
									<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
										<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>Pendang</Text>
										<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.LIGHT, marginLeft: 4 }}>Tolong segera diperbaiki</Text>
									</View>
									<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
										<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>Edi Werda</Text>
										<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.LIGHT, marginLeft: 4 }}>lubangnya parah</Text>
									</View>
									<TouchableOpacity onPress={() => Actions.comment()}>
										<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.LIGHT, marginTop: 8 }}>Lihat komentar lainnya...</Text>
									</TouchableOpacity>
								</View>
							</View>
						</Tab>
						<Tab heading="Tempat" tabStyle={{ backgroundColor: Colors.WHITE }} textStyle={{ color: '#7e7674', fontSize: 14, fontFamily: Fonts.LIGHT }} activeTabStyle={{ backgroundColor: Colors.WHITE }} activeTextStyle={{ color: Colors.PRIMARY, fontSize: 14, fontFamily: Fonts.REGULAR }}>
							<TouchableOpacity onPress={() => Actions.placeDetail()}>
								<View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, padding: 16 }}>
									<View style={{ flex: 0.3, justifyContent: 'center' }}>
										<Image style={{ height: 75, width: '100%', borderRadius: 4 }} resizeMode='cover' source={require('../components/images/tempat/tempat1.jpg')}></Image>
									</View>
									<View style={{ marginLeft: 20, flex: 0.7 }}>
										<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Pantai Pasir Panjang</Text>
										<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.LIGHT, marginTop: 4 }}>Kecamatan Singkawang Selatan, Kota Singkawang.</Text>
									</View>
								</View>
								<View style={{ height: 1, backgroundColor: Colors.BORDER }}></View>
							</TouchableOpacity>
						</Tab>
						<Tab heading="Acara" tabStyle={{ backgroundColor: Colors.WHITE }} textStyle={{ color: '#7e7674', fontSize: 14, fontFamily: Fonts.LIGHT }} activeTabStyle={{ backgroundColor: Colors.WHITE }} activeTextStyle={{ color: Colors.PRIMARY, fontSize: 14, fontFamily: Fonts.REGULAR }}>
							<View style={{ padding: 16 }}>
								<TouchableOpacity style={styles.boxMenu} key={Math.random()} onPress={() => Actions.eventDetail()}>
									<Image style={{ height: 150, width: '100%', borderTopLeftRadius: 5, borderTopRightRadius: 5 }} resizeMode='cover' resizeMethod='scale' source={require('../components/images/acara/acara1.jpg')} />
									<View style={{ padding: 12 }}>
										<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Cap Go Meh Singkawang 2019</Text>
										<View style={{ flexDirection: 'row', marginTop: 16, flex: 1, alignItems: 'center' }}>
											<View style={{ flex: 0.6 }}>
												<View style={{ flexDirection: 'row' }}>
													<Icon name="calendar-alt" size={10} color={Colors.BLACK} />
													<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginLeft: 8 }}>5 November 2019</Text>
												</View>
												<View style={{ flexDirection: 'row', marginTop: 8 }}>
													<Icon name="map-marker-alt" size={10} color={Colors.BLACK} />
													<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginLeft: 8 }}>Lapangan Singkawang</Text>
												</View>
											</View>
											<View style={{ flex: 0.4 }}>
												<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>Harga mulai dari :</Text>
												<Text style={{ fontSize: 14, color: '#f73d44', fontFamily: Fonts.MEDIUM, marginTop: 4 }}>Rp 60.000</Text>
											</View>
										</View>
									</View>
								</TouchableOpacity>
							</View>
						</Tab>
					</Tabs>
				</Content>
				<FooterBottom activeIndex={1} />
			</Container>
		);
	};
};

const styles = StyleSheet.create({
	
});
