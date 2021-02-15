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

export default class CulinaryCategoryList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search: '',
			culinaryList: [],
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
		this.getCulinaryList();
	};

	handleBackButton = () => {
		this.props.from == 'list'? Actions.culinaryList():
		Actions.culinaryCategory();
		return true;
	};

	onRefresh() { 
		this.setState({refreshing: true}); 
		this.setState({
			page: 1
		}, () => {
			this.getCulinaryList();
		});
		setTimeout(() => {
			this.setState({refreshing: false});
		}, 2000);
	}

	getCulinaryList(){
		if(this.props.categoryId != null){
			axios({
				method: 'GET',
				url: Config.API_URL + '/api/v1/culinary?terms&paginate=1&limit=50&top=false&categories=[' + this.props.categoryId + ']',
				data: {},
				timeout: 35000
			}).then((response) => {
				if (response.data.header.message == 'Success') {
					this.setState({
						culinaryList: response.data.data.data
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
			console.log('a')
			axios({
				method: 'GET',
				url: Config.API_URL + '/api/v1/culinary?terms&paginate=1&limit=10&top=true',
				data: {},
				timeout: 35000
			}).then((response) => {
				if (response.data.header.message == 'Success') {
					this.setState({
						culinaryList: response.data.data.data
					})
				}
				else {
					Toast.message(response.data.header.reason.id);
				}
			}).catch((error) => {
				Toast.message(error.data.header.reason.id);
			});
		}
	}

	culinaryList(item){
		return(
			<TouchableOpacity onPress={() => this.props.categoryId == null ? Actions.culinaryDetail({culinaryId: item.id,categoryId: null, from: 'isFromCategoryList'}) : Actions.culinaryDetail({culinaryId: item.id, categoryId: this.props.categoryId, from: 'isFromCategoryList', categoryName: this.props.categoryName})}>
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
						<Text style={{ fontSize: 18, color: Colors.WHITE, fontFamily: Fonts.REGULAR, marginLeft: 16 }}>{this.props.categoryId == null ? 'Kuliner Populer' : this.props.categoryName }</Text>
					</Body>
					<Right/>
				</Header>
				<StatusBar barStyle="light-content" backgroundColor= {Colors.PRIMARY} />
				<Content style={{ backgroundColor: Colors.WHITE }}>
					<FlatList
						style={styles.flatlistCard}
						data={this.state.culinaryList}
						numColumns={1}
						extradata={false}
						onRefresh={this.onRefresh.bind(this)}
						refreshing={this.state.refreshing}
						renderItem={({ item }) => (
							this.culinaryList(item)
						)}
						keyExtractor={(item, index) => index.toString()}
					/>
				</Content>
			</Container>
		);
	};
};

const styles = StyleSheet.create({
	flatlistCard: {
		height:'100%',
		marginBottom: 15,
	}
});
