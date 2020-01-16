import './SaveMaster.less';
import React, { Component } from 'react';

import bem from 'Helpers/Bem.helper';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Config from 'Config/Config';
import Design from 'UI/Containers/Design/Design.react';
import { Link } from 'react-router-dom';

import domtoimage from 'dom-to-image';

import BookCoverSelector from 'Redux/Selectors/BookCover/BookCover.selector';
import EditorOptionsSelector from 'Redux/Selectors/EditorOptions/EditorOptions.selector';
import * as EditorOptionsActions from 'Redux/Actions/EditorOptions/EditorOptions.actions';

class SaveMaster extends Component {
	constructor(props) {
		super(props);
		this.blockName = 'SaveMaster';
		this.bem = bem.with(this.blockName);

		this.state = {
			imagesLoaded: false,
			options: [
				{
					id: '600x900',
					width: 600,
					height: 900,
					scale: 1,
					ref: React.createRef()
				},
				{
					id: '1333x2000',
					width: 1333,
					height: 2000,
					scale: 2.2,
					ref: React.createRef()
				}
				// {
				//     id: "1400x1873",
				//     width: 1400,
				//     height: 1873,
				//     scale: 2.21,
				//     ref: React.createRef(),
				// },
				// {
				//     id: "1400x2100",
				//     width: 1400,
				//     height: 2100,
				//     scale: 2.3,
				//     ref: React.createRef(),
				// },
				// {
				//     id: "1563x2500",
				//     width: 1563,
				//     height: 2500,
				//     scale: 2.69,
				//     ref: React.createRef(),
				// },
				// {
				//     id: "1600x2400",
				//     width: 1600,
				//     height: 2400,
				//     scale: 2.6,
				//     ref: React.createRef(),
				// },
				// {
				//     id: "1618x2500",
				//     width: 1618,
				//     height: 2500,
				//     scale: 2.73,
				//     ref: React.createRef(),
				// }
			]
		};

		console.time();
		const { editorOptions } = this.props;

		Promise.all(
			this.state.options.map((data, _, options) => {
				return Promise.all(
					[
						{
							key: 'backgroundImage',
							type: 0
						},
						{
							key: 'foregroundImage',
							type: 1
						}
					].map(({ key, type }) => {
						return this.getImage(
							editorOptions
								.getIn(['design', key])
								.set('type', type)
								.set('width', data.width)
								.set('height', data.height),
							d => {
								this.setState({
									options: options.map(o => {
										if (o.id == data.id) {
											o[key] = `${d.src}`;
										}
										return o;
									})
								});
							}
						);
					})
				);
			})
		).then(d => {
			this.setState({
				imagesLoaded: true
			});
		});
	}

	componentDidUpdate() {
		if (this.state.imagesLoaded) {
			if (this.inProgress) {
				return;
			}
			this.inProgress = true;
			setTimeout(() => {
				const list = [];
				this.state.options.forEach((data, i, l) => {
					setTimeout(() => {
						list.push(this.node2png(data));
						if (l.length - 1 == i) {
							Promise.all(list).then(list => {
								console.timeEnd();
								console.log('promise all');
								this.save(list);
							});
						}
					}, i * 100);
				});
			}, 100);
		}
	}

	getImage(image, successHandler) {
		return fetch(`/api/images/get`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				modelId: image.get("modelId"),
	            type: image.get("type"),
	            url: image.get("src"),
	            path: image.get("path"),
				Width: image.get('width'),
				Height: image.get('height')
			})
		}).then(response => {
			if (!response.ok) return;

			response.json().then(json => {
				successHandler(json);
			});
		});
	}

	save(results) {
		console.log('saving');
		const { editorOptions, bookCover } = this.props;
		const FrontalImage = bookCover.getIn(['foregroundImage', 'src']);
		const BackgroundImage = bookCover.getIn(['backgroundImage', 'src']);

		const split = str => str && str.split(',')[1];

		// console.log('results');
		// console.log(results[0]);
		// return;

		fetch(`/api/cover/post`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				CoverId: editorOptions.getIn(['design', 'coverId']),
				ApplicationUserId: editorOptions.getIn([
					'design',
					'applicationUserId'
				]),
				FrontalImage: FrontalImage
					? FrontalImage.split(',')[1]
					: FrontalImage,
				BackgroundImage: BackgroundImage
					? BackgroundImage.split(',')[1]
					: BackgroundImage,
				State: JSON.stringify({
					editorOptions: editorOptions.toJS(),
					bookDescription: bookCover.get('bookDescription'),
					selectedStyles: bookCover.get('selectedStyles'),
					selectedColor: bookCover.get('selectedColor'),
					bookGenre: bookCover.get('bookGenre')
				}),
				Size_600_900: split(results[0]),
				Size_1333_2000: split(results[1])
				// Size_1400_1873: split(results[2]),
				// Size_1400_2100: split(results[3]),
				// Size_1563_2500: split(results[4]),
				// Size_1600_2400: split(results[5]),
				// Size_1618_2500: split(results[6]),
			})
		}).then(response => {
			console.log('res');
			if (!response.ok) return;

			response.json().then(({ coverId, applicationUserId }) => {
				console.log('coverId: ', coverId);
				const design = editorOptions
					.get('design')
					.set('coverId', coverId)
					.set('applicationUserId', applicationUserId);
				this.props.EditorOptionsActions.update({
					design
				});
				this.props.handleComplete();
			});
		});
	}

	node2png({ ref, width, height }) {
		console.log('converting image');
		// domtoimage.toJpeg(ref.current, { quality: 0.95, height, width }).then(dataURL => console.log(dataURL))
		console.log(ref.current);
		return domtoimage
			.toJpeg(ref.current, { quality: 0.95, height, width })
			.then(function(dataUrl) {
				return dataUrl;
			})
			.catch(function(error) {
				console.error('oops, something went wrong!', error);
			});
	}

	renderOption({
		id,
		width,
		height,
		backgroundImage,
		foregroundImage,
		scale,
		ref
	}) {
		const { editorOptions } = this.props;
		return (
			<Design
				key={id}
				currentRef={ref}
				design={editorOptions
					.get('design')
					.setIn(['backgroundImage', 'src'], backgroundImage)
					.setIn(['foregroundImage', 'src'], foregroundImage)}
				width={width}
				height={height}
				scale={scale}
				noShadow
			/>
		);
	}

	render() {
		const { imagesLoaded } = this.state;
		if (!imagesLoaded) return null;

		const { editorOptions } = this.props;
		if (!editorOptions) return null;

		return (
			<article className={this.bem()}>
				{this.state.options.map((...args) =>
					this.renderOption(...args)
				)}
			</article>
		);
	}
}

export default connect(
	state => ({
		editorOptions: EditorOptionsSelector({ state }),
		bookCover: BookCoverSelector({ state })
	}),
	dispatch => ({
		EditorOptionsActions: bindActionCreators(EditorOptionsActions, dispatch)
	})
)(SaveMaster);
