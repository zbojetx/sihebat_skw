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
	Spinner,
	Picker
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
import { AirbnbRating } from 'react-native-ratings';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class PlaceCategoryList extends Component {
	constructor(props) {
		super(props);
		this.state = {
            comment: '',
			rate: 3,
			selected: 0,
			isLoadingpage: false,
		};
	};

	componentWillMount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        this.showLoadingPage(true)
        AsyncStorage.getItem('user', (error, result) => {
			if (result) {
				let resultParsed = JSON.parse(result)
				this.setState({
					userId: resultParsed.token.user_id
				});
				this.showLoadingPage(false)
			}
			this.showLoadingPage(false)
		});
	};

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
	};

	componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
	};

	handleBackButton = () => {
		Actions.placeDetail({placeId: this.props.placeId})
		return true;
	};
	
	ratingCompleted = (rating) => { this.setState ({ selected: rating });}
    
    showLoadingPage(loadings) {
		this.setState({ isLoadingpage: loadings })
	};

    postReview() {
		this.showLoadingPage(true)
        axios({
            method: 'PUT',
            url: Config.API_URL + '/api/v1/place/review',
            data: {
                object_id: this.props.placeId,
                user_id: this.state.userId,
                comment: this.state.comment,
                rate: this.state.selected,
            },
            timeout: 35000
        }).then((response) => {
            if (response.data.header.message == 'Success') {
                this.showLoadingPage(false);
                Actions.placeDetail({placeId: this.props.placeId});
            }
            else {
                Toast.message(response.data.header.reason.id);
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
						<Text style={{ fontSize: 18, color: Colors.WHITE, fontFamily: Fonts.REGULAR, marginLeft: 16 }}>Tulis Ulasan</Text>
					</Body>
					<Right style={{ flex: 0 }}>
						<Button transparent onPress={() => this.postReview()}>
							<Text style={{ fontSize: 18, color: Colors.WHITE, fontFamily: Fonts.LIGHT, marginLeft: 16 }} uppercase={false} onPress={() => this.postReview()}>Kirim</Text>
						</Button>
					</Right>
				</Header>
				<StatusBar barStyle="light-content" backgroundColor= {Colors.PRIMARY} />
				<Content style={{ backgroundColor: Colors.WHITE }}>
                    <View style={{ padding: 10 }}>
                        <Text style={{ marginTop: 10, fontWeight: '500', fontSize: 16 }}>{this.props.placeName}</Text>
                        <Text style={{ marginTop: 15, fontSize: 13, paddingBottom: 10 }}>Berikan Rating</Text>
						<AirbnbRating
						type='star'
						ratingCount={5}
						defaultRating={1}
						reviewSize={25}
						showRating={false}
						onFinishRating={this.ratingCompleted}
						starContainerStyle={{ alignSelf: 'flex-start' }}
						/>					
                        <Text style={{ fontSize: 15, fontWeight: '500',paddingBottom: 5, paddingTop: 20 }}>Tulis Komentar</Text>
                        <Item inlineLabel>
                            <Input placeholder={'Mohon menuliskan ulasan Anda dengan sopan.'} style={{ fontFamily: Fonts.REGULAR, fontSize: 12 }} value={this.state.comment} onChangeText={(value) => this.setState({ comment: value })} />
                        </Item>
                    </View>
				</Content>
			</Container>
		);
	};
};

const styles = StyleSheet.create({

});
