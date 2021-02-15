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
    Footer
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

export default class Comment extends Component {
	constructor(props) {
		super(props);
		this.state = {
            comments: ''
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
        AsyncStorage.getItem('user', (error, result) => {
			if (result) {
				let resultParsed = JSON.parse(result)
				this.setState({
					userId: resultParsed.token.user_id
				});
			}
		});
	};

	handleBackButton = () => {
		this.props.from == 'reportList' ? Actions.reportList() : Actions.home();
		return true;
    };
    
    formatDate(date) {
		return moment(date).format('DD MMM YYYY, HH:mm A')
    }
    
    postComment(){
        axios({
			method: 'PUT',
			url: Config.API_URL + '/api/v1/report/comment',
			data: {
                object_id: this.props.objectId,
                user_id: this.state.userId ,
                comment: this.state.comments
            },
			timeout: 35000
		}).then((response) => {
			if (response.data.header.message == 'Success') {
				this.setState({
					comments: ''
				})
				Toast.message('Comment berhasil dikirim')
				this.props.from == 'reportList' ? Actions.reportList() : Actions.home()
			} else {
				Toast.message(response.data.header.reason.id);
			}
		}).catch((error) => {
			Toast.message(error.response.data.header.reason.id);
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
						<Text style={{ fontSize: 18, color: Colors.WHITE, fontFamily: Fonts.REGULAR, marginLeft: 16 }}>Komentar</Text>
					</Body>
					<Right/>
				</Header>
				<StatusBar barStyle="light-content" backgroundColor= {Colors.PRIMARY} />
				<Content style={{ backgroundColor: Colors.WHITE }}>
					<View style={{ padding: 20 }}>
						<View style={{ flexDirection: 'row', flex: 1 }}>
							<View style={{ flex: 0.13 }}>
								<Image style={{ height: 40, width: 40 }} resizeMode='cover' source={require('../../components/images/avatar.png')}></Image>
							</View>
							<View style={{ marginLeft: 20, flex: 0.87 }}>
								<Text style={{ fontSize: 14, color: Colors.BLACK, fontFamily: Fonts.LIGHT }}>{this.props.description}</Text>
								<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.LIGHT, marginTop: 6 }}>{this.formatDate(this.props.createdAt)}</Text>
							</View>
						</View>
					</View>
					<View style={{ height: 1, backgroundColor: Colors.BORDER }}></View>
					<View style={{ padding: 20 }}>
						<Text style={{ fontSize: 12, color: Colors.GREY, fontFamily: Fonts.LIGHT }}>Semua Komentar</Text>
                        {
                            this.props.comment.map((itemsComment) => (
                                <View style={{ flexDirection: 'row', flex: 1, marginTop: 15 }}>
                                    <View style={{ flex: 0.13, justifyContent: 'center' }}>
                                        <Image style={{ height: 40, width: 40 }} resizeMode='cover' source={require('../../components/images/avatar.png')}></Image>
                                    </View>
                                    <View style={{ marginLeft: 20, flex: 0.87 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.LIGHT, marginLeft: 4, marginTop: 5 }}><Text style={{ fontWeight: '500', fontSize: 13, marginRight: 5 }}>{itemsComment.user.fullname}</Text>  {itemsComment.review.comment}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))
                        }
					</View>
				</Content>
                <Footer style={{ backgroundColor: 'transparent' }}>
                    <Body style={{ borderTopWidth: 1, borderTopColor: Colors.BORDER, flexDirection: 'row' }}>
                        <View style={{ flex: 0.80 }}>
                            <Item>
                                <Input ref={input => { this.Input = input }} placeholder={'Tulis Komentar'} placeholderTextColor={Colors.FONT_LIGHT} style={{ fontFamily: Fonts.REGULAR, fontSize: 15 }} value={this.state.comments} onChangeText={(value) => this.setState({ comments: value })} />
                            </Item>
                        </View>
                        <TouchableOpacity style={{ flex: 0.15, alignItems: 'center' }} onPress={() => this.postComment()}>
                            <Text style={{ color: Colors.PRIMARY, marginLeft: 15 }}>Kirim</Text>
                        </TouchableOpacity>
                    </Body>
                </Footer>
			</Container>
		);
	};
};