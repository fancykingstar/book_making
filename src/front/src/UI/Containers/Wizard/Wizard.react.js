import './Wizard.less';
import React, { Component } from 'react';

import bem from 'Helpers/Bem.helper';
import classNames from 'classnames';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';

import { Route, Switch, Redirect } from 'react-router-dom';

import {
	WizardStep1,
	WizardStep2,
	WizardStep3,
	WizardStep4,
	WizardStep5,
	WizardStep6
} from 'UI/Containers/WizardSteps';
import Editor from 'UI/Containers/Editor/Editor.react';
import Preview from 'UI/Containers/Preview/Preview.react';
import Rates from 'UI/Containers/Rates/Rates.react';
import Login from 'UI/Containers/Login/Login.react';
import SignUp from 'UI/Containers/SignUp/SignUp.react';

import Saved from 'UI/Containers/Saved/Saved.react';

import BookCoverSelector from 'Redux/Selectors/BookCover/BookCover.selector';
import * as BookCoverActions from 'Redux/Actions/BookCover/BookCover.actions';
import * as UserActions from 'Redux/Actions/User/User.actions';

class Wizard extends Component {
	constructor(props) {
		super(props);
		this.blockName = 'Wizard';
		this.bem = bem.with(this.blockName);
	}

	componentDidMount() {
		this.props.BookCoverActions.update({
			bookTitleText: '',
			authorNameText: '',
			subTitleText: '',
			bookDescription: '',
			bookGenre: null,
			foregroundImage: null,
			foregroundImageAlternatives: [],
			backgroundImage: null,
			backgroundImageAlternatives: [],
			selectedColor: null,
			selectedStyles: []
		});
	}

	render() {
		if (!this.props.bookCover) return null;

		// return <Saved />;
		return (
			<span>
				<Switch>
					<Route path="/wizard/1" component={WizardStep1} />
					<Route path="/wizard/2" component={WizardStep2} />
					<Route path="/wizard/3" component={WizardStep3} />
					<Route path="/wizard/4" component={WizardStep4} />
					<Route path="/wizard/5" component={WizardStep5} />
					<Route path="/wizard/6" component={WizardStep6} />
					<Route path="/editor" component={Editor} />
					<Route path="/preview" component={Preview} />
					<Route path="/rates" component={Rates} />

					<Route path="/login" component={Login} />
					<Route path="/signup" component={SignUp} />

					<Route path="/saved" component={Saved} />

					<Switch>
						<Redirect exact strict from="/" to="/wizard/6" />
					</Switch>
				</Switch>
			</span>
		);
	}
}

export default withRouter(
	connect(
		state => ({
			bookCover: BookCoverSelector({ state })
		}),
		dispatch => ({
			BookCoverActions: bindActionCreators(BookCoverActions, dispatch),
			UserActions: bindActionCreators(UserActions, dispatch)
		})
	)(Wizard)
);
