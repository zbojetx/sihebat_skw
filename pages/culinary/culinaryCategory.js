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

export default class CulinaryCategory extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search: '',
			refreshing: false,
			culinaryCategory: []
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
		this.getCulinaryCategory();
	};

	handleBackButton = () => {
		Actions.culinaryList();
		return true;
	};

	onRefresh() { 
		this.setState({refreshing: true}); 
		this.setState({
			page: 1
		}, () => {
			this.getCulinaryCategory();
		});
		setTimeout(() => {
			this.setState({refreshing: false});
		}, 2000);
	}

	getCulinaryCategory(){
		axios({
			method: 'GET',
			url: Config.API_URL + '/api/v1/culinary/category?terms=&paginate=1&limit=8',
			data: {},
			timeout: 35000
		}).then((response) => {
			console.log(response)
			if (response.data.header.message == 'Success') {
				this.setState({
					culinaryCategory: response.data.data.data
				})
			}
			else {
				Toast.message(response.data.header.reason.id);
			}
		}).catch((error) => {
			Toast.message(error.data.header.reason.id);
		});
	}

	boxCategory(item){
		return(
            <View style={{ marginTop: 10, marginBottom: 10, flex: 0.25 }}>
                <TouchableOpacity key={Math.random()} style={styles.boxMenuKategori} onPress={() => Actions.culinaryCategoryList({ categoryId: item.id, categoryName: item.name })}>
                    <Image style={{ height: 35, width: 35 }} resizeMode='cover' source={item.image == null ? '' : { uri: item.image }}></Image>
                    <Text style={{ fontSize: 10, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginTop: 12, textAlign: 'center' }}>{item.name}</Text>
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
					<Body style={{ flex: 1 }}>
						<Text style={{ fontSize: 18, color: Colors.WHITE, fontFamily: Fonts.REGULAR, marginLeft: 16 }}>Semua Kategori</Text>
					</Body>
				</Header>
				<StatusBar barStyle="light-content" backgroundColor= {Colors.PRIMARY} />
				<Content style={{ backgroundColor: Colors.WHITE }}>
						<FlatList
                            style={{ margin: 10 }}
							data={this.state.culinaryCategory}
							numColumns={4}
							extradata={false}
							onRefresh={this.onRefresh.bind(this)}
							refreshing={this.state.refreshing}
							renderItem={({ item }) => (
								this.boxCategory(item)
							)}
							keyExtractor={(item, index) => index.toString()}
						/>
				</Content>
			</Container>
		);
	};
};

const styles = StyleSheet.create({
	boxMenuKategori: {
		alignItems: 'center',
		shadowColor: Colors.BLACK,
		shadowOpacity: 0.8,
		elevation: 2,
		backgroundColor: Colors.WHITE,
		borderRadius: 5,
		padding: 5,
		marginLeft: 8,
		marginRight: 8,
	},
});
