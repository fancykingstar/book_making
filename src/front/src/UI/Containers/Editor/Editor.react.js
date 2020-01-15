import './Editor.less'
import React, { Component } from 'react'

import bem from 'Helpers/Bem.helper'
import classNames from 'classnames'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import domtoimage from 'dom-to-image'

import MobileDetector from 'UI/Components/MobileDetector/MobileDetector.react'
import Header from 'UI/Containers/Header/Header.react'
import Instruments from 'UI/Containers/Editor/Instruments.react'
import Tools from 'UI/Containers/Editor/Tools.react'
import EditorPreview from 'UI/Containers/Editor/EditorPreview.react'
import Options from 'UI/Containers/Editor/Options.react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import User from 'UI/Containers/User/User.react'

import IMAGE_SIZES from 'Consts/IMAGE_SIZES.const'

import * as EditorOptionsActions from 'Redux/Actions/EditorOptions/EditorOptions.actions'
import EditorOptionsSelector from 'Redux/Selectors/EditorOptions/EditorOptions.selector'
import SaveMasterReact from 'UI/Containers/SaveMaster/SaveMaster.react'

class Editor extends Component {
    state = {
        loading: {},
        editing: true,
    }

    constructor (props) {
        super(props)
        this.blockName = 'Editor'
        this.bem = bem.with(this.blockName)
    }

    componentDidMount() {
        this.checkImages()
    }

    componentDidUpdate(prevProps) {
        const {editorOptions} = this.props
        if (prevProps.editorOptions != editorOptions)
            this.checkImages()
    }

    checkImages(prevEditorOptions) {
        const {editorOptions} = this.props
        if (!editorOptions)
            return null

        const backgroundImage = editorOptions.getIn(["design", "backgroundImage"])
        if (backgroundImage.get("size") == IMAGE_SIZES.get("PREVIEW") &&
            !this.state.loading[backgroundImage.get("id")]) {

            this.setState(prevState => ({
                loading: {
                    ...prevState.loading,
                    [backgroundImage.get("id")]: true,
                },
            }))
            this.getLargeImage(backgroundImage.set("type", 0), d => {
                const design = editorOptions.get("design").update("backgroundImage", image =>
                    image
                    .set("src", `data:image/png;base64,${d.webformatBase64}`)
                    .set("size", IMAGE_SIZES.get("WEB_FORMAT"))
                )
                this.props.EditorOptionsActions.update({
                    design,
                })
                setTimeout(() => {
                    this.setState(prevState => ({
                        loading: {
                            ...prevState.loading,
                            [backgroundImage.get("id")]: false,
                        },
                    }))
                }, 200)
            })
        }

        const foregroundImage = editorOptions.getIn(["design", "foregroundImage"])
        if (foregroundImage.get("size") == IMAGE_SIZES.get("PREVIEW") &&
            !this.state.loading[foregroundImage.get("id")]) {

            this.setState(prevState => ({
                loading: {
                    ...prevState.loading,
                    [foregroundImage.get("id")]: true,
                },
            }))
            this.getLargeImage(foregroundImage.set("type", 1), d => {
                const design = editorOptions.get("design").update("foregroundImage", image =>
                    image.set("src", `data:image/png;base64,${d.webformatBase64}`)
                    .set("size", IMAGE_SIZES.get("WEB_FORMAT"))
                )
                this.props.EditorOptionsActions.update({
                    design,
                })
                setTimeout(() => {
                    this.setState(prevState => ({
                        loading: {
                            ...prevState.loading,
                            [foregroundImage.get("id")]: false,
                        },
                    }))
                }, 200)
            })
        }
    }

    handlePrevStep() {
        this.props.history.goBack()
    }

    handleNextStep() {
        const coverId = this.props.editorOptions.getIn(["design", "coverId"])
        this.props.history.push({
            pathname: "/rates",
            state: {
                coverId,
            },
        })
    }

    handleBack() {
        this.setState({
            editing: true,
        })
    }

    handleSaving() {
        this.setState({
            editing: false,
            complete: false,
        })
    }

    handleUndo() {
        const defaultDesign = this.props.editorOptions.get("defaultDesign")
        this.props.EditorOptionsActions.update({
            design: defaultDesign,
        })
    }

    getLargeImage(image, successHandler) {
        const {bookCover} = this.props
        const data = {
            modelId: image.get("modelId"),
            type: image.get("type"),
            base64: image.get("base64"),
            url: image.get("url"),
            path: image.get("path"),
            width: image.get("width"),
            height: image.get("height"),
            titleColor: image.get("titleColor"),
            authorColor: image.get("authorColor"),
            key: image.get("key")
        }
        fetch("/api/images/get", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then(response => {
            if (!response.ok)
                return

            response.json().then(json => {
                successHandler(json)
            })
        })
    }

    render () {
        const {editorOptions} = this.props
        if (!editorOptions)
            return null

        const {editing, complete, canDownload} = this.state

        return (
            <MobileDetector>
                {({ isMobile }) => (
                    <article className={this.bem()}>
                        <Header isPrev onPrevClick={::this.handlePrevStep}/>
                        <section className={this.bem("Box", {overlay:!editing, isMobile})}>
                            <Instruments className={this.bem("Left", {isMobile})} isMobile={isMobile}/>
                            <div className={this.bem("Center", {isMobile})}>
                                <Tools/>
                                <Options/>
                            </div>
                            <User>
                                {user => 
                                    (
                                    <EditorPreview className={this.bem("Right", {active:!editing})} rotate3d={!editing} isMobile={isMobile}>
                                        <button
                                            className={this.bem("UndoButton", {visible:editing})}
                                            onClick={(...args) => this.handleUndo(...args)}
                                            onKeyPress={target => target.charCode == 13 && this.handleUndo()}
                                        >
                                            <FontAwesomeIcon
                                                className={this.bem("UndoButton-Icon")}
                                                icon={["fa", "undo"]}
                                            />
                                        </button>
                                        <button
                                            className={this.bem("NextButton", {visible:editing})}
                                            onClick={(...args) => this.handleSaving(...args)}
                                            onKeyPress={target => target.charCode == 13 && this.handleSaving()}
                                        >
                                            Save
                                        </button>
                                        <button
                                            className={this.bem("BackButton", {visible:!editing})}
                                            onClick={(...args) => this.handleBack(...args)}
                                            onKeyPress={target => target.charCode == 13 && this.handleBack()}
                                        >
                                            <FontAwesomeIcon
                                                className={this.bem("BackButton-Icon")}
                                                icon={["fa", "arrow-left"]}
                                            />
                                        </button>
                                        <a
                                            target="_blank"
                                            href={`/api/cover/get?id=${this.props.editorOptions.getIn(["design", "coverId"])}`}
                                            className={this.bem("NextButton", {visible:!editing && this.props.editorOptions.getIn(["design", "coverId"]) && user.get("CanDownload")})}
                                        >
                                            Download
                                        </a>
                                        <button
                                            className={this.bem("NextButton", {visible:!editing && this.props.editorOptions.getIn(["design", "coverId"]) && !user.get("CanDownload")})}
                                            onClick={(...args) => this.handleNextStep(...args)}
                                            onKeyPress={target => target.charCode == 13 && this.handleNextStep()}
                                        >
                                            Download
                                        </button>
                                    </EditorPreview>
                                )}
                            </User>
                        </section>
                        {
                            editing
                                ? null
                                : (
                                    <SaveMasterReact
                                        handleComplete={() => this.setState({
                                            complete: true,
                                        })}
                                    />
                                )
                        }
                        {
                            !editing && !complete
                                ? (
                                    <div className={this.bem("Loading")}>
                                        <h3 className={this.bem("Loading-Message")}>Please wait, this might take several minutes</h3>
                                        <div className={this.bem("Loading-Bot")}/>
                                    </div>
                                )
                                : null
                        }
                    </article>
                )}
            </MobileDetector>
        )
    }
}

export default connect(
    state => ({
        editorOptions: EditorOptionsSelector({state}),
    }),
    dispatch => ({
        EditorOptionsActions: bindActionCreators(EditorOptionsActions, dispatch),
    }),
)(Editor)
