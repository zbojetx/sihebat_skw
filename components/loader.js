import React, {
	Component 
} from 'react';
import {
	StyleSheet,
	View,
	Modal,
	Image,
	Animated, 
	Easing,
	Text
} from 'react-native';
import {
    Spinner 
} from 'native-base';
import Colors from '../components/colors';
import Fonts from '../components/fonts';

export default class loader extends Component {

	constructor(props){
		super(props)
		this.springValue = new Animated.Value(1);
	}

	componentDidMount() {
		this.spring();
	}

	spring() {
		this.springValue.setValue(1);
		Animated.spring(this.springValue, {
			toValue: 1.3,
			friction: 0.1,
			tension: 100,
		}).start();
	}

	render() {
		return (
			<Modal
				transparent={true}
				animationType={'none'}
				visible={this.props.loading}>
				<View style={styles.modalBackground}>
					<View style={styles.loadbox}>
                        <Spinner color={Colors.PRIMARY} />
						<Text style={{ fontSize: 12, color: Colors.BLACK, fontFamily: Fonts.REGULAR, marginBottom: 16 }}>Harap Tunggu ...</Text>
					</View>
				</View>
			</Modal>
		)
	}
}

const styles = StyleSheet.create({
	modalBackground: {
		flex: 1,
		alignItems: 'center',
		flexDirection: 'column',
		justifyContent: 'center',
		backgroundColor: '#00000040'
	},
	loadbox: {
	    width: 120,
	    borderRadius: 10,
	    backgroundColor: Colors.WHITE,
	    justifyContent: 'center',
		alignItems: 'center',
	}
});