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
	SafeAreaView
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
import FooterBottom from '../components/footer';
import Colors from '../components/colors';
import Fonts from '../components/fonts';
import {Actions} from 'react-native-router-flux';
import axios from 'axios';
import Config from '../config.js';
import Loader from '../components/loader';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class Notification extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false
		};
	};

	showLoading(loading) {
		this.setState({ isLoading: loading })
	};

	componentWillMount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
		// this.showLoading(true)
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
		if (this.state.isLoading) {
			return (
				<SafeAreaView style={{ flex: 1, backgroundColor: Colors.GREY }}>
					<Loader loading={this.state.isLoading} />
				</SafeAreaView>
			);
		} else {
            return (
                <Container>
                    <Header style={{ backgroundColor: Colors.PRIMARY }}>
                        <Left style={{ flex: 0 }}>
                            <Button transparent onPress={() => this.handleBackButton()}>
                                <Image style={{ height: 18, width: 18, tintColor: Colors.WHITE }} resizeMode='contain' source={require('../components/images/back.png')}></Image>
                            </Button>
                        </Left>
                        <Body style={{ marginLeft: 5 }}>
                            <Text numberOfLines={1} style={{ width: '90%', color: Colors.WHITE }}>{this.props.bannerTitle}</Text>
                        </Body>
                        <Right />
                    </Header>
                    <StatusBar barStyle="light-content" backgroundColor={Colors.PRIMARY} />
                    <Content>
                        <Image style={{ height: 200, width: width,marginBottom: 10 }} resizeMode='cover' source={{uri: this.props.bannerImage}} />
                        <View style={{ padding: 10 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{this.props.bannerTitle}</Text>
                            <Text style={{ fontSize: 14 }}>{this.props.bannerDesc}</Text>
                        </View>                            
                    </Content>
                </Container>
            );
		}
	};
};

const styles = StyleSheet.create({
	
});
