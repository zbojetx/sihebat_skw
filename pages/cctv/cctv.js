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
import FooterBottom from '../../components/footer';
import Colors from '../../components/colors';
import Fonts from '../../components/fonts';
import {Actions} from 'react-native-router-flux';
import axios from 'axios';
import Config from '../../config.js';
import Loader from '../../components/loader';

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
		this.showLoading(false)
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
                        <Left style={{ marginLeft: 10, flex: 0, width: '100%' }}>
                            <Text style={{ fontSize: 18, color: Colors.WHITE, fontFamily: Fonts.REGULAR }}>CCTV</Text>
                        </Left>
                        <Body />
                        <Right />
                    </Header>
                    <StatusBar barStyle="light-content" backgroundColor={Colors.PRIMARY} />
                    <Content>
                    </Content>
                    <FooterBottom activeIndex={3} />
                </Container>
            );
        }
    }
};

const styles = StyleSheet.create({
	
});
