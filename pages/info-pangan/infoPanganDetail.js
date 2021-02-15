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

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class InfoPanganDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			origin: this.props.origin,
			email: ''
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
		Actions.infoPanganList();
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
						<Text style={{ fontSize: 18, color: Colors.PRIMARY, fontFamily: Fonts.REGULAR, marginLeft: 16 }}>Beras Pandan Wangi</Text>
					</Body>
					<Right/>
				</Header>
				<StatusBar barStyle="dark-content" backgroundColor={Colors.WHITE} />
				<Content style={{ backgroundColor: Colors.WHITE }}>
					<View style={styles.boxMenuPrimary}>
						<View style={styles.boxMenu}>
							<View style={{ flex: 0.4 }}>
								<Image style={{ height: 120, width: '100%', borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }} resizeMode='cover' source={require('../../components/images/info-pangan/info4.jpg')}></Image>
							</View>
							<View style={{ flex: 0.6, height: 120, justifyContent: 'space-between', padding: 10 }}>
								<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.LIGHT }}>{moment().format('DD MMM YYYY')}</Text>
								<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>Beras</Text>
								<Text style={{ fontSize: 16, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Rp 12.500/Kg</Text>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<Icon name="caret-up" size={25} color={'#D31800'} />
									<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.LIGHT, marginLeft: 4 }}>Turun Rp 300</Text>
								</View>
							</View>
						</View>
						<View style={styles.boxMenu}>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, flex: 1, alignItems: 'center' }}>
								<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.LIGHT }}>11 Juli 2019</Text>
								<Text style={{ fontSize: 16, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Rp 12.800/Kg</Text>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<Icon name="caret-up" size={25} color={'#D31800'} />
									<View style={{ marginLeft: 6 }}>
										<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.LIGHT }}>Naik</Text>
										<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.LIGHT }}>Rp 200</Text>
									</View>
								</View>
							</View>
						</View>
						<View style={styles.boxMenu}>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, flex: 1, alignItems: 'center' }}>
								<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.LIGHT }}>10 Juli 2019</Text>
								<Text style={{ fontSize: 16, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>Rp 12.300/Kg</Text>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<Icon name="caret-down" size={25} color={'#7FB500'} />
									<View style={{ marginLeft: 6 }}>
										<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.LIGHT }}>Turun</Text>
										<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.LIGHT }}>Rp 100</Text>
									</View>
								</View>
							</View>
						</View>
					</View>
				</Content>
			</Container>
		);
	};
};

const styles = StyleSheet.create({
	boxMenuPrimary: {
		paddingTop: 8,
		paddingRight: 16,
		paddingBottom: 8,
		paddingLeft: 16,
		alignItems: 'center',
	},
	boxMenu: {
		flexDirection: 'row',
		alignItems: 'center',
		shadowColor: Colors.BLACK,
		shadowOpacity: 0.8,
		elevation: 2,
		backgroundColor: Colors.WHITE,
		borderRadius: 5,
		marginBottom: 16
	}
});
