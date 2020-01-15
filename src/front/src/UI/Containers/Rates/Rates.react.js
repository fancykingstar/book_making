import './Rates.less';
import React, { Component } from 'react';

import bem from 'Helpers/Bem.helper';
import { connect } from 'react-redux';

import Config from 'Config/Config';
import Header from 'UI/Containers/Header/Header.react';
import Title from 'UI/Components/Title/Title.react';
import { withRouter } from 'react-router';
import User from 'UI/Containers/User/User.react';

class Rates extends Component {
	constructor(props) {
		super(props);
		this.blockName = 'Rates';
		this.bem = bem.with(this.blockName);

		this.state = {
			tariffs: [],
			canDownload: false
		};
	}

	componentDidMount() {
		fetch(`/tariff/plans`, {
			method: 'GET'
		}).then(response => {
			if (!response.ok) return;

			response.json().then(tariffs => {
				this.setState({
					tariffs: tariffs
						.sort((a, b) => a.type - b.type)
						.map(tariff => {
							tariff.clientIdPayPal = `id-${Math.floor(
								Math.random() * 1e8
							)}`;
							const { price, discount } = tariff;
							tariff.oldPrice = discount ? price : 0;
							tariff.newPrice = discount
								? (price * (100 - discount)) / 100
								: price;
							return tariff;
						})
				});

				setTimeout(d => {
					this.paypalScript = document.createElement('script');
					this.paypalScript.src = `https://www.paypal.com/sdk/js?client-id=${Config.PAYPAL_CLIENT_ID}`;
					this.paypalScript.async = true;
					this.paypalScript.onload = () =>
						this.handlePayPalScriptLoad();
					document.body.appendChild(this.paypalScript);
				});
			});
		});
	}

	handlePayPalScriptLoad() {
		this.state.tariffs.forEach(tariff => {
			if (tariff.newPrice <= 0) return;

			const onApprove = () => {
				this.setState({
					canDownload: true
				});
			};

			window.paypal
				.Buttons({
					createOrder: function(_, actions) {
						return actions.order.create({
							purchase_units: [
								{
									amount: {
										value: tariff.newPrice
									},
									description: tariff.description
								}
							]
						});
					},
					onApprove: (_, actions) => {
						return actions.order.capture().then(details => {
							onApprove();

							const coverId = state && state.coverId;
							console.log('coverId: ', coverId);

							return fetch('/billing/success', {
								method: 'post',
								headers: {
									'content-type': 'application/json'
								},
								body: JSON.stringify({
									id: details.id,
									intent: details.intent,
									create_time: details.create_time,
									update_time: details.update_time,
									payer: details.payer,
									purchase_units: details.purchase_units,
									links: details.links,
									coverId
								})
							}).then(() => {
								window.location = `/api/cover/get?id=${coverId}`;
							});
						});
					}
				})
				.render(`#${tariff.clientIdPayPal}`);
		});
	}

	handlePrevStep() {
		this.props.history.goBack();
	}

	renderItem(tariff, index, user) {
		const {
			clientIdPayPal,
			name,
			description,
			discount,
			oldPrice,
			newPrice
		} = tariff;
		const { state } = this.props.location;
		const coverId = state && state.coverId;
		return (
			<li key={index} className={this.bem('Item')}>
				<div className={this.bem('Name')}>{name}</div>
				<div className={this.bem('DiscountBox')}>
					{oldPrice ? (
						<div
							className={this.bem('OldPrice')}
						>{`$ ${oldPrice}`}</div>
					) : null}
					{discount ? (
						<div
							className={this.bem('Discount')}
						>{`- ${discount}%`}</div>
					) : null}
				</div>
				<div className={this.bem('NewPrice')}>{`$ ${newPrice}`}</div>
				<div className={this.bem('Description')}>{description}</div>
				{/* {
                    coverId
                        ? user.get("CanDownload") || newPrice <= 0
                            ? (
                                <a
                                    className={this.bem("SubscribeButton", {active:true})}
                                    href={coverId ? `/api/cover/get?id=${coverId}` : ""}
                                    target="_blank"
                                >
                                    Download
                                </a>
                            )
                            : null
                        : null
                }
                {
                    newPrice <= 0 || user.get("CanDownload")
                        ? null
                        : ( */}
				<div id={clientIdPayPal} className={this.bem('PayPalBox')} />
			</li>
		);
	}

	render() {
		const { tariffs, canDownload } = this.state;
		const { state } = this.props.location;
		const coverId = state && state.coverId;
		return (
			<article className={this.bem()}>
				<Header isPrev onPrevClick={() => this.handlePrevStep()} />
				<div className={this.bem('Center')}>
					<Title>Choose your perfect design package</Title>
					<User key={canDownload}>
						{user => (
							<ul className={this.bem('List')}>
								{tariffs.map((tariff, index) =>
									this.renderItem(tariff, index, user)
								)}
							</ul>
						)}
					</User>
				</div>
			</article>
		);
	}
}

export default withRouter(
	connect(
		state => ({}),
		dispatch => ({})
	)(Rates)
);
