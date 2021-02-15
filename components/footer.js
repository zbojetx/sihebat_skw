'use strict';

import React, {
	Component 
} from 'react';
import {
	AsyncStorage,
	View,
	Image,
	StyleSheet,
	Linking
} from 'react-native';
import {
	Footer,
	FooterTab,
	Button,
	Text
} from 'native-base';
import PropTypes from 'prop-types';
import {Actions} from 'react-native-router-flux';
import Colors from '../components/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default class footer extends Component {
	static propTypes = {
		activeIndex: PropTypes.number
	};

	static defaultProps = {
		activeIndex: 0
	};

	constructor(props) {
		super(props);
		this.state = {
			activeIndex: this.props.activeIndex ? this.props.activeIndex : 0,
			userId: null
		};
	};

	componentDidMount() {
		AsyncStorage.getItem('user', (error, result) => {
			if (result) {
				let resultParsed = JSON.parse(result)
				console.log(resultParsed)
				this.setState({
					userId: resultParsed.token.user_id
				});
			}
		});
	}

	render() {
		let { activeIndex } = this.props;
		return (
			<Footer style={{ borderTopWidth: 0 }}>
				<FooterTab style={{ backgroundColor: '#E9E9EB' }}>
					{
						activeIndex === 0 ?
							<Button onPress={() => Actions.home()}>
								<Image style={ styles.imageFooter } resizeMode='cover' source={require('../components/images/footer/homeActive.png')}></Image>
							</Button>
						:
							<Button onPress={() => Actions.home()}>
								<Image style={ styles.imageFooter } resizeMode='cover' source={require('../components/images/footer/home.png')}></Image>
							</Button>
					}
					{
						activeIndex === 1 ?
							<Button onPress={() => Actions.forum()}>
								<Image style={ styles.imageFooter } resizeMode='cover' source={require('../components/images/footer/timelineActive.png')}></Image>
							</Button>
						:
							<Button onPress={() => Actions.forum()}>
								<Image style={ styles.imageFooter } resizeMode='cover' source={require('../components/images/footer/timeline.png')}></Image>
							</Button>
					}
					{
						activeIndex === 2 ?
							<Button onPress={() => Actions.reportCreate()}>
								<Image style={ styles.imageFooterLapor } resizeMode='cover' source={require('../components/images/footer/lapor.png')}></Image>
							</Button>
						:
							<Button onPress={() => Actions.reportCreate()}>
								<Image style={ styles.imageFooterLapor } resizeMode='cover' source={require('../components/images/footer/lapor.png')}></Image>
							</Button>
					}
					{
						activeIndex === 3 ?
							<Button onPress={() => Linking.openURL("https://play.google.com/store/apps/details?id=com.mm.android.direct.gdmssphoneLite")}>
								<Image style={ styles.imageFooter } resizeMode='cover' source={require('../components/images/footer/cctvActive.png')}></Image>
							</Button>
						:
							<Button onPress={() => Linking.openURL("https://play.google.com/store/apps/details?id=com.mm.android.direct.gdmssphoneLite")}>
								<Image style={ styles.imageFooter } resizeMode='cover' source={require('../components/images/footer/cctv.png')}></Image>
							</Button>
					}
					{
						activeIndex === 4 ?
							<Button onPress={() => this.state.userId == null ? Actions.login() : Actions.profile()}>
								<Image style={ styles.imageFooter } resizeMode='cover' source={require('../components/images/footer/profileActive.png')}></Image>
							</Button>
						:
							<Button onPress={() => this.state.userId == null ? Actions.login() : Actions.profile()}>
								<Image style={ styles.imageFooter } resizeMode='cover' source={require('../components/images/footer/profile.png')}></Image>
							</Button>
					}
				</FooterTab>
			</Footer>
		);
	}
}

const styles = StyleSheet.create({
	imageFooter : {
		height: 25,
		width: 25
	},
	imageFooterLapor : {
		height: 32,
		width: 32
	}
});
