import './WizardStep6.less';
import React, { Component } from 'react';

import bem from 'Helpers/Bem.helper';
import classNames from 'classnames';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import User from 'UI/Containers/User/User.react';
import Config from 'Config/Config';
import I from 'immutable';

import TEXT_POSITIONS_CONST from 'Consts/TEXT_POSITIONS.const';
import TEXT_FONTS_BY_GENRE_SLUG_CONST from 'Consts/TEXT_FONTS_BY_GENRE_SLUG.const';
import TEXT_FONTS_FOR_AUTHOR_CONST from 'Consts/TEXT_FONTS_FOR_AUTHOR.const';
import IMAGE_SIZES from 'Consts/IMAGE_SIZES.const';

import Header from 'UI/Containers/Header/Header.react';
import Title from 'UI/Components/Title/Title.react';
import SubTitle from 'UI/Components/SubTitle/SubTitle.react';
import Center from 'UI/Components/Center/Center.react';
import Footer from 'UI/Components/Footer/Footer.react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Designs from 'UI/Containers/Designs/Designs.react';
import UserSelector from 'Redux/Selectors/User/User.selector';

import SignupModal from 'UI/Containers/SignupModal/SignupModal.react';
import BookCoverSelector from 'Redux/Selectors/BookCover/BookCover.selector';
import * as BookCoverActions from 'Redux/Actions/BookCover/BookCover.actions';
import * as EditorOptionsActions from 'Redux/Actions/EditorOptions/EditorOptions.actions';

class WizardStep6 extends Component {
	constructor(props) {
		super(props);
		this.blockName = 'WizardStep6';
		this.bem = bem.with(this.blockName);

		this.state = {
			limit: 8,
			loading: true,
			authorized: false
		};

		this.batch = null;
		this.currentPage = 0;
		this.firstTime = true;

		// this.handleScroll = () => this._handleScroll()
	}

	// _handleScroll() {
	//     if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500)) {
	//         // this.handleIncreaseLimit()
	//         this.removeScrollListener()
	//         setTimeout(() => {
	//             if (this.unmounted)
	//                 return
	//             this.addScrollListener()
	//         }, 2000)
	//     }
	// }

	handleChangeForegroundImages(foregroundImageAlternatives) {
		this.props.BookCoverActions.update({
			foregroundImageAlternatives
		});
	}

	handleChangeBackgroundImages(backgroundImageAlternatives) {
		console.log(backgroundImageAlternatives, "------")
		this.props.BookCoverActions.update({
			backgroundImageAlternatives
		});
	}

	getStyles() {
		const { bookCover } = this.props;
		const styles = bookCover
			.get('selectedStyles')
			.map(d => d.get('id'))
			.toJS();

		if (
			bookCover.get('selectedStyles').size > 1 &&
			!bookCover
				.get('selectedStyles')
				.some(i => i.get('src') === 'skipped')
		) {
			return styles;
		} else {
			return [-1];
		}
	}

	getImage(image, successHandler) {
		const { bookCover } = this.props;
		const data = {
            modelId: image.get("modelId"),
            type: image.get("type"),
            url: image.get("src"),
            path: image.get("path"),
        }
        console.log(data, "**********");
		fetch('/api/images/get', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}).then(response => {
			if (!response.ok) return;

			response.json().then(json => {
				successHandler(json);
			});
		});
	}

	getImages() {
		const { bookCover } = this.props;

		const fImage = bookCover.get('foregroundImage');
		if (fImage) {
			this.props.BookCoverActions.update({
				foregroundImage: {
					id: fImage.get('id'),
					src: fImage.get('src')
				}
			});
		}

		const bImage = bookCover.get('backgroundImage');
		if (bImage) {
			this.props.BookCoverActions.update({
				backgroundImage: {
					id: bImage.get('id'),
					src: bImage.get('src')
				}
			});
		}

		const props = {
			color: 'orange', //`${bookCover.getIn(["selectedColor", "id"]).toLowerCase()}`,
			text: bookCover.get('bookDescription'),
			models: this.getStyles(),
			genre: bookCover.toJS().bookGenre.title,
			title: bookCover.toJS().bookTitleText
		};
		console.log("================", this.props.bookCover.get("data"));

		if (!this.props.bookCover.get("data")) {
			fetch(`/api/images/ResultNew`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(props)
			}).then(response => {
				if (!response.ok)
					return alert('Oops, something went wrong, try again please');

				response.json().then(json => {
					this.props.BookCoverActions.update({
						data: json
					});
					this.batchImages(json, props)
				});
			});
		} else {
			const data = this.props.bookCover.toJS().data
			this.batchImages(data, props)
		}
	}

	batchImages(json, props) {
		fetch(`/api/images/batch`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				...props,
				items: [
					...json.frontalImages.slice(0, 8),
					...json.backgroundImages.slice(0, 8)
				]
			})
		}).then(batchResponse => {
			batchResponse.json().then(json => {
				const backgroundImages = json.filter(
					img => img.type === 1
				);
				const foregroundImages = json.filter(
					img => img.type === 0
				);

				if (this.firstTime) {
					this.handleImages(
						backgroundImages,
						foregroundImages
					);
					this.firstTime = false;
				} else {
					this.batch = { backgroundImages, foregroundImages };

					if (this.state.loading) {
						this.batch = null;
						this.handleImages(
							backgroundImages,
							foregroundImages
						);
					}
					console.log('go...');
				}
			});
		});
	}

	handleImages(foregroundImages, backgroundImages) {
		if (backgroundImages && backgroundImages.length)
			this.handleChangeBackgroundImages(
				backgroundImages.map(d => ({
					src: d.url,
					modelId: d.modelId,
					path: d.path,
					size: IMAGE_SIZES.get('PREVIEW'),
					type: d.type,
					// id: Math.floor(Math.random()*1e6),
					// webformatUrl: d.webformatUrl,
					// largeImageUrl: d.largeImageUrl,
				}))
			);

		if (foregroundImages && foregroundImages.length)
			this.handleChangeForegroundImages(
				foregroundImages.map(d => ({
					src: d.url,
					modelId: d.modelId,
					path: d.path,
					size: IMAGE_SIZES.get('PREVIEW'),
					type: d.type,
					// id: Math.floor(Math.random()*1e6),
					// webformatUrl: d.webformatUrl,
					// largeImageUrl: d.largeImageUrl,
				}))
			);

		this.setState({
			loading: false
		});

		this.props.BookCoverActions.update({
			updated: false
		});

		this.getImages();
	}

	getBatch() {
		// this.setState({ loading: true });
		if (this.batch) {
			this.setState({ loading: true }, () => {
				this.handleImages(
					this.batch.frontalImages,
					this.batch.backgroundImages
				);
				this.batch = null;
			});
		} else {
			this.setState({ loading: true });
		}
	}

	componentDidMount() {
		const { bookCover } = this.props;
		// if (bookCover.get("updated")) {
		this.getImages();
		// }

		setTimeout(() => {
			this.setState({
				loading: true //bookCover.get("updated"),
			});
		}, 200);

		this.addScrollListener();
	}

	componentWillUnmount() {
		this.unmounted = true;
		this.removeScrollListener();
	}

	addScrollListener() {
		window.addEventListener('scroll', this.handleScroll);
	}

	removeScrollListener() {
		window.removeEventListener('scroll', this.handleScroll);
	}

	handlePrevStep() {
		this.props.history.goBack();
	}

	handleNextStep(design) {
		this.props.EditorOptionsActions.update({
			design,
			defaultDesign: design
		});
		this.props.history.push('/editor');
	}

	// handleIncreaseLimit() {
	//     this.setState(prevState => ({
	//         limit: prevState.limit + 28,
	//     }))
	// }

	render() {
		const { bookCover, user } = this.props;
		const foregroundImages = bookCover.get('foregroundImage')
			? I.List([bookCover.get('foregroundImage')])
			: bookCover.get('foregroundImageAlternatives');
		const backgroundImages = bookCover.get('backgroundImage')
			? I.List([bookCover.get('backgroundImage')])
			: bookCover.get('backgroundImageAlternatives');
		const { loading } = this.state;
		const isLoggedIn = user && user.get('IsAuthorized');

		const refreshStyle = {
			    "display": "-webkit-flex;",
			    "display": "flex",
			    "align-items": "center",
			    "justifyContent": "center",
			    "position": "fixed",
			    "bottom": "0",
			    "left": "0",
			    "right": "0",
			    "z-index": "10",
			    "background-color": "#fff",
			    "padding": "22px 0 20px",
			    "boxShadow": "0 0 10px rgba(0, 0, 0, 0.1)"
		}

		return (
			<article className={this.bem()}>
				<Header
					isPrev
					onPrevClick={(...args) => this.handlePrevStep(...args)}
				/>
				<Center>
					<Title>
						{loading
							? 'Bear with us, your designs are about to be ready!'
							: 'Click on a design to start personalizing!'}
					</Title>
					{/* 
                    {
                        loading &&
                        <div style={{ opacity: (isLoggedIn || this.state.authorized) ? 1 : 0 }} className={this.bem("Loading")}>
                            <div className={this.bem("Loading-Bot")}/>
                        </div>
                    }
                    {
                        !loading &&  */}
					<Designs
						limit={this.state.limit}
						className={this.bem('Designs')}
						// shouldUpdate={!!bookCover.get("updated")}
						width={200}
						height={300}
						scale={1 / 3}
						onClick={(...args) => this.handleNextStep(...args)}
						hoverEffect
						foregroundImages={foregroundImages}
						backgroundImages={backgroundImages}
						bookTitleColor={'orange'} //bookCover.getIn(["selectedColor", "paletteExtended"]).first()}
						authorNameColor={'orange'} //bookCover.getIn(["selectedColor", "paletteExtended"]).last()}
						subTitleColor={'orange'} //bookCover.getIn(["selectedColor", "paletteExtended"]).last()}
						// bookTitleColor={bookCover.getIn(["selectedColor", "paletteExtended"]).first()}
						// authorNameColor={bookCover.getIn(["selectedColor", "paletteExtended"]).last()}
						// subTitleColor={bookCover.getIn(["selectedColor", "paletteExtended"]).last()}

						bookTitleText={bookCover.get('bookTitleText')}
						authorNameText={bookCover.get('authorNameText')}
						subTitleText={''}
						bookGenre={bookCover.get('bookGenre')}
						textPositions={TEXT_POSITIONS_CONST}
						loading={this.state.loading}
						bookTitleFonts={TEXT_FONTS_BY_GENRE_SLUG_CONST.get(
							bookCover.getIn(['bookGenre', 'slug'])
						)}
						authorNameFonts={TEXT_FONTS_FOR_AUTHOR_CONST}
						subTitleFonts={TEXT_FONTS_FOR_AUTHOR_CONST.slice(0, 2)}
					/>
					{/* } */}
					<div style={refreshStyle}>
						<button
							style={{
								opacity: loading ? 0 : 1,
								pointerEvents: loading ? 'none' : 'all'
							}}
							className={this.bem('More-Button', { visible: true })}
							onClick={(...args) => this.getBatch()}
						>
							Refresh
						</button>
					</div>
				</Center>
				{!isLoggedIn && (
					<SignupModal
						onSignup={() => this.setState({ authorized: true })}
					/>
				)}
			</article>
		);
	}
}

export default connect(
	state => ({
		user: UserSelector({ state }),
		bookCover: BookCoverSelector({ state })
	}),
	dispatch => ({
		BookCoverActions: bindActionCreators(BookCoverActions, dispatch),
		EditorOptionsActions: bindActionCreators(EditorOptionsActions, dispatch)
	})
)(WizardStep6);
