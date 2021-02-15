'use strict';

import React, {
	Component
} from 'react';
import {
	View,
	AsyncStorage,
	Linking
} from 'react-native';
import {
	Container,
	Root
} from 'native-base';
import {
	Router,
	Scene,
	Actions
} from 'react-native-router-flux';

import login from './pages/auth/login';
import register from './pages/auth/register';

import home from './pages/home';
import notification from './pages/notification';
import search from './pages/search';
import comment from './pages/comment';

import profile from './pages/profile/profile';
import profileEdit from './pages/profile/profileEdit';
import setting from './pages/profile/setting';
import password from './pages/profile/password';
import passwordForgot from './pages/profile/passwordForgot';
import bookmarks from './pages/profile/bookmarks';

import infoPanganList from './pages/info-pangan/infoPanganList';
import infoPanganDetail from './pages/info-pangan/infoPanganDetail';

import newsList from './pages/news/newsList';
import newsDetail from './pages/news/newsDetail';

import eventList from './pages/event/eventList';
import eventJelajahi from './pages/event/eventJelajahi';
import eventDetail from './pages/event/eventDetail';
import eventJelajahiList from './pages/event/eventJelajahiList';

import placeList from './pages/place/placeList';
import placeCategory from './pages/place/placeCategory';
import placeCategoryList from './pages/place/placeCategoryList';
import placeDetail from './pages/place/placeDetail';
import placeReview from './pages/place/placeReview';

import culinaryList from './pages/culinary/culinaryList';
import culinaryCategoryList from './pages/culinary/culinaryCategoryList';
import culinaryDetail from './pages/culinary/culinaryDetail';
import culinaryCategory from './pages/culinary/culinaryCategory';
import culinaryReview from './pages/culinary/culinaryReview';

import reportList from './pages/report/reportList';
import reportCreate from './pages/report/reportCreate';
import reportCategory from './pages/report/reportCategory';
import reportComment from './pages/report/reportComment';

import forum from './pages/forum';
import forumCreate from './pages/forum/forumCreate';
import forumCategory from './pages/forum/forumCategory';
import forumComment from './pages/forum/forumComment';

import cctv from './pages/cctv/cctv';

import bannerDetail from "./pages/bannerDetail";

export default class Singkawang extends Component<{}> {
	render() {
		return(
			<Root>
				<Container>
					<Router>
						<Scene key="root">
							<Scene key="login" component={login} type="replace" hideNavBar={true} />
							<Scene key="register" component={register} type="replace" hideNavBar={true} />

							<Scene key="home" component={home} type="replace" hideNavBar={true} initial={true} />
							<Scene key="notification" component={notification} type="replace" hideNavBar={true} />
							<Scene key="search" component={search} type="replace" hideNavBar={true} />
							<Scene key="comment" component={comment} type="replace" hideNavBar={true} />

							<Scene key="profile" component={profile} type="replace" hideNavBar={true} />
							<Scene key="profileEdit" component={profileEdit} type="replace" hideNavBar={true} />
							<Scene key="setting" component={setting} type="replace" hideNavBar={true} />
							<Scene key="password" component={password} type="replace" hideNavBar={true} />
							<Scene key="passwordForgot" component={passwordForgot} type="replace" hideNavBar={true} />
							<Scene key="bookmarks" component={bookmarks} type="replace" hideNavBar={true} />

							<Scene key="infoPanganList" component={infoPanganList} type="replace" hideNavBar={true} />
							<Scene key="infoPanganDetail" component={infoPanganDetail} type="replace" hideNavBar={true} />

							<Scene key="newsList" component={newsList} type="replace" hideNavBar={true} />
							<Scene key="newsDetail" component={newsDetail} type="replace" hideNavBar={true} />

							<Scene key="eventList" component={eventList} type="replace" hideNavBar={true} />
							<Scene key="eventJelajahi" component={eventJelajahi} type="replace" hideNavBar={true} />
							<Scene key="eventJelajahiList" component={eventJelajahiList} type="replace" hideNavBar={true} />
							<Scene key="eventDetail" component={eventDetail} type="replace" hideNavBar={true} />

							<Scene key="placeList" component={placeList} type="replace" hideNavBar={true} />
							<Scene key="placeCategory" component={placeCategory} type="replace" hideNavBar={true} />
							<Scene key="placeCategoryList" component={placeCategoryList} type="replace" hideNavBar={true} />
							<Scene key="placeDetail" component={placeDetail} type="replace" hideNavBar={true} />
							<Scene key="placeReview" component={placeReview} type="replace" hideNavBar={true} />

							<Scene key="culinaryList" component={culinaryList} type="replace" hideNavBar={true} />
							<Scene key="culinaryCategory" component={culinaryCategory} type="replace" hideNavBar={true} />
							<Scene key="culinaryCategoryList" component={culinaryCategoryList} type="replace" hideNavBar={true} />
							<Scene key="culinaryDetail" component={culinaryDetail} type="replace" hideNavBar={true} />
							<Scene key="culinaryReview" component={culinaryReview} type="replace" hideNavBar={true} />

							<Scene key="reportList" component={reportList} type="replace" hideNavBar={true} />
							<Scene key="reportCreate" component={reportCreate} type="replace" hideNavBar={true} />
							<Scene key="reportCategory" component={reportCategory} type="replace" hideNavBar={true} />
							<Scene key="reportComment" component={reportComment} type="replace" hideNavBar={true} />

							<Scene key="forum" component={forum} type="replace" hideNavBar={true} />
							<Scene key="forumCreate" component={forumCreate} type="replace" hideNavBar={true} />
							<Scene key="forumCategory" component={forumCategory} type="replace" hideNavBar={true} />
							<Scene key="forumComment" component={forumComment} type="replace" hideNavBar={true} />

							<Scene key="cctv" component={cctv} type="replace" hideNavBar={true} />

							<Scene key="bannerDetail" component={bannerDetail} type="replace" hideNavBar={true} />
						</Scene>
					</Router>
				</Container>
			</Root>
		);
	};
};