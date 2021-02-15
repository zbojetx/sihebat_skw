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

export default class EventJelajahi extends Component {
	constructor(props) {
		super(props);
		this.state = {
			EventJelajahiData: []
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
		this.getEventJelajahi()
	};

	handleBackButton = () => {
		Actions.eventList();
		return true;
	};

	getEventJelajahi(){
		axios({
			method: 'GET',
			url: Config.API_URL + '/api/v1/event?terms&paginate=1&limit=10&top=false&categories=[' + this.props.eventCategoryId + ']',
			data: {},
			timeout: 35000
		}).then((response) => {
			if (response.data.header.message == 'Success') {
				this.setState({
					EventJelajahiData: response.data.data.data
				})
			}
		}).catch((error) => {
			Toast.message(error.data.header.reason.id);
		});
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
						<Text style={{ fontSize: 18, color: Colors.WHITE, fontFamily: Fonts.REGULAR, marginLeft: 16 }}>Musik</Text>
					</Body>
					<Right/>
				</Header>
				<StatusBar barStyle="light-content" backgroundColor= {Colors.PRIMARY} />
				<Content style={{ backgroundColor: Colors.WHITE }}>
					<View style={{ padding: 16 }}>
						{
							this.state.EventJelajahiData.length < 0 ?
							this.state.EventJelajahiData.map((items) => (
								<TouchableOpacity style={styles.boxMenu} key={Math.random()} onPress={() => Actions.eventDetail()}>
									<Image style={{ height: 150, width: '100%', borderTopLeftRadius: 5, borderTopRightRadius: 5 }} resizeMode='cover' resizeMethod='scale' source={items.related_images[0].image.path != null ? {uri: items.related_images[0].image.path} : require('../../components/images/placeholderSquare.png')} />
									<View style={{ padding: 12 }}>
										<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.MEDIUM }}>{items.title}</Text>
										<View style={{ flexDirection: 'row', marginTop: 16, flex: 1, alignItems: 'center' }}>
											<View style={{ flex: 0.6 }}>
												<View style={{ flexDirection: 'row' }}>
													<Icon name="calendar-alt" size={10} color={Colors.BLACK} />
													<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginLeft: 8 }}>{items.attributes[2].value.value != null && items.attributes[2].value.value != '' ? items.attributes[2].value.value : '-'}</Text>
												</View>
												<View style={{ flexDirection: 'row', marginTop: 8 }}>
													<Icon name="map-marker-alt" size={10} color={Colors.BLACK} />
													<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginLeft: 8 }}>{items.attributes[0].value.value != null && items.attributes[0].value.value != '' ? items.attributes[0].value.value : '-'}</Text>
												</View>
											</View>
											<View style={{ flex: 0.4 }}>
												<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR }}>Harga mulai dari :</Text>
												<Text style={{ fontSize: 14, color: '#f73d44', fontFamily: Fonts.MEDIUM, marginTop: 4 }}>{items.attributes[1].value.value != null && items.attributes[1].value.value != '' ? items.attributes[1].value.value : '-' }</Text>
											</View>
										</View>
									</View>
								</TouchableOpacity>
							))
							: 
							<View>
								<Text>Belum ada data...</Text>
							</View>
						}
					</View>
				</Content>
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
