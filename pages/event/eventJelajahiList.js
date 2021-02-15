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

export default class PlaceCategoryList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search: '',
			eventList: [],
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
		this.getEventList()
	};

	handleBackButton = () => {
		this.props.from == 'list'? Actions.placeList():
		Actions.eventList();
		return true;
	};

	onRefresh() { 
		this.setState({refreshing: true}); 
		this.setState({
			page: 1
		}, () => {
			this.getEventList();
		});
		setTimeout(() => {
			this.setState({refreshing: false});
		}, 2000);
	}

    getEventList() {
        axios({
            method: 'GET',
            url: Config.API_URL + '/api/v1/event?terms&paginate=1&limit=50&top=false&categories=[' + this.props.eventCategoryId + ']',
            data: {},
            timeout: 35000
        }).then((response) => {
            if (response.data.header.message == 'Success') {
                this.setState({
                    eventList: response.data.data.data
                })
            }
            else {
                Toast.message(response.data.header.reason.id);
            }
        }).catch((error) => {
            Toast.message(error.data.header.reason.id);
        });
    }

	eventList(item){
		return(
			<TouchableOpacity onPress={() => Actions.eventDetail({eventId: item.id, from: 'isFromCategoryList', categoryName: this.props.categoryName, eventCategoryId: this.props.eventCategoryId})}>
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
						<Text style={{ fontSize: 18, color: Colors.WHITE, fontFamily: Fonts.REGULAR, marginLeft: 16 }}>{this.props.categoryName}</Text>
					</Body>
					<Right/>
				</Header>
				<StatusBar barStyle="light-content" backgroundColor= {Colors.PRIMARY} />
				<Content style={{ backgroundColor: Colors.WHITE }}>
					<FlatList
						style={styles.flatlistCard}
						data={this.state.eventList}
						numColumns={1}
						extradata={false}
						onRefresh={this.onRefresh.bind(this)}
						refreshing={this.state.refreshing}
						renderItem={({ item }) => (
							this.eventList(item)
						)}
						keyExtractor={(item, index) => index.toString()}
					/>
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
		flexGrow: 4
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
		height: '100%'
	},
	flatlistCard: {
		height:'100%',
		marginBottom: 15,
	}
});
