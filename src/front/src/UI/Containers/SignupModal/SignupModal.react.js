import './SignupModal.less';
import React, { Component } from 'react';

import bem from 'Helpers/Bem.helper';
import SignUp from 'UI/Containers/SignUp/SignUp.react';
import Login from 'UI/Containers/Login/Login.react';
import { Link } from 'react-router-dom';

class SignUpModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			show: true,
			isSignup: true
		};

		this.blockName = 'SignUpModal';
		this.bem = bem.with(this.blockName);

		this.onAuth = this.onAuth.bind(this);
		this.toggle = this.toggle.bind(this);
	}

	onAuth() {
		this.setState({ show: false });

		if (this.props.onSignup) {
			this.props.onSignup();
		}
	}

	toggle() {
		this.setState({ isSignup: !this.state.isSignup });
	}

	render() {
		return (
			<span>
				{this.state.show && (
					<div className={this.bem()}>
						<div className="modalContainer">
							{this.state.isSignup ? (
								<SignUp
									onToggle={this.toggle}
									onAuth={this.onAuth}
									hideHeader
								/>
							) : (
								<Login
									onToggle={this.toggle}
									location={{
										state: {
											subTitleText: '',
											confirmButtonText: ''
										}
									}}
									onAuth={this.onAuth}
									hideHeader
								/>
							)}
							<div className="terms">
								By continuing you agree to our{' '}
								<a
									href="https://deflamel.com/index.php/terms/"
									target="_blank"
								>
									Terms of Service
								</a>{' '}
								and{' '}
								<a
									href="https://deflamel.com/index.php/privacy-policy/"
									target="_blank"
								>
									Privacy policy
								</a>
							</div>
						</div>
					</div>
				)}
			</span>
		);
	}
}

export default SignUpModal;
