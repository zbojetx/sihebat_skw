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
	Spinner,
	Textarea
} from 'native-base';
import {
	Toast
} from 'teaset';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Colors from '../../components/colors';
import Fonts from '../../components/fonts';
import {Actions} from 'react-native-router-flux';
import axios from 'axios';
import Config from '../../config.js';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class ReportCategory extends Component {
	constructor(props) {
		super(props);
		this.state = {
			reportCategory: [],
			isLoading: true,

			title: this.props.title,
			description: this.props.description,
			jenis: this.props.jenis,
			categoryId: this.props.categoryId,
			categoryName: this.props.categoryName,
			categoryIcon: this.props.categoryIcon,
			path: this.props.path,
			avatarSource: this.props.avatarSource,
			street: this.props.street,
			additionalDescription: this.props.additionalDescription,
		};
	};

	componentWillMount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
		this.getReportCategory()
	};

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
	};

	componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
	};

	handleBackButton = () => {
		this.backToCreateReport(this.state.categoryId, this.state.categoryName, this.state.categoryIcon);
		return true;
	};

	backToCreateReport(categoryId, categoryName, categoryIcon) {
		Actions.reportCreate({
			title: this.state.title,
			description: this.state.description,
			jenis: this.state.jenis,
			path: this.state.path,
			avatarSource: this.state.avatarSource,
			additionalDescription: this.state.additionalDescription,
			street: this.state.street,
			categoryId: categoryId,
			categoryName: categoryName,
			categoryIcon: categoryIcon,
		});
	}

	showLoading(loading) {
		this.setState({ isLoading: loading })
	};

	getReportCategory(){
		axios({
			method: 'GET',
			url: Config.API_URL + '/api/v1/report/category?terms&paginate=1&limit=100&parent=0&type='+this.state.jenis,
			data: {},
			timeout: 35000
		}).then((response) => {
			if (response.data.header.message == 'Success') {
				this.setState({
					reportCategory: response.data.data.data
				})
				this.showLoading(false);
			}
			else {
				this.showLoading(false);
				Toast.message(response.data.header.reason.id);
			}
		}).catch((error) => {
			this.showLoading(false);
			Toast.message(response.data.header.reason.id);
		});
	}

	onRefresh() { 
		this.setState({isLoading: true}); 
		this.getPlaceCategory();
		setTimeout(() => {
			this.setState({isLoading: false});
		}, 2000);
	}

	ReportCategoryList(item){
		return(
			<View style={{ margin: 15, flex: 1 }}>
				<TouchableOpacity style={{ alignItems: 'center', flex: 1 }} onPress={() => this.backToCreateReport(item.id, item.name, item.icon)}>
					<Image style={{ height: 50, width: 50 }} resizeMode='cover' source={item.icon == null || item.icon == '' ? require('../../components/images/iconCategoryLapor.png'): { uri: item.icon }}></Image>
					<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 10 }}>{item.name}</Text>
				</TouchableOpacity>
			</View>
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
						<Text style={{ fontSize: 18, color: Colors.WHITE, fontFamily: Fonts.REGULAR, marginLeft: 16 }}>Kategori</Text>
					</Body>
					<Right />
				</Header>
				<StatusBar barStyle="light-content" backgroundColor= {Colors.PRIMARY} />
				<Content style={{ backgroundColor: Colors.WHITE }}>
					{
						this.state.isLoading ?
							<Spinner color={Colors.PRIMARY} />
						:
							<FlatList
								data={this.state.reportCategory}
								numColumns={4}
								extradata={false}
								onRefresh={this.onRefresh.bind(this)}
								refreshing={this.state.isLoading}
								renderItem={({ item }) => (
									this.ReportCategoryList(item)
								)}
								keyExtractor={(item, index) => index.toString()}
							/>
					}
				</Content>
			</Container>
		);
	};
};
