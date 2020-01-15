import './Preview.less'
import React, { Component } from 'react'

import bem from 'Helpers/Bem.helper'
import classNames from 'classnames'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import Header from 'UI/Containers/Header/Header.react'
import Design from 'UI/Containers/Design/Design.react'
import BookCover3D from 'UI/Components/BookCover3D/BookCover3D.react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import html2canvas from 'html2canvas'
import domtoimage from 'dom-to-image'

import BookCoverSelector from 'Redux/Selectors/BookCover/BookCover.selector'
import EditorOptionsSelector from 'Redux/Selectors/EditorOptions/EditorOptions.selector'
import * as EditorOptionsActions from 'Redux/Actions/EditorOptions/EditorOptions.actions'

class Preview extends Component {
    refDesign = React.createRef()

    state =  {
        rotate3d: false,
    }

    constructor (props) {
        super(props)
        this.blockName = 'Preview'
        this.bem = bem.with(this.blockName)
    }

    componentDidMount() {
        setTimeout(() => {
            domtoimage.toPng(this.refDesign.current)
                .then(function (dataUrl) {
                    console.log("dataUrl \n\n")
                    console.log(dataUrl)
                    var img = new Image()
                    img.src = dataUrl
                    document.body.appendChild(img)
                })
                .catch(function (error) {
                    console.error('oops, something went wrong!', error)
                })

                // const {editorOptions, bookCover} = this.props
                // const FrontalImage = bookCover.getIn(["foregroundImage", "src"])
                // const BackgroundImage = bookCover.getIn(["backgroundImage", "src"])
                // fetch("/api/cover/post", {
                //     method: "POST",
                //     credentials: 'include',
                //     headers: {
                //         "Content-Type": "application/json",
                //     },
                //     body: JSON.stringify({
                //         CoverId: editorOptions.getIn(["design", "coverId"]),
                //         ApplicationUserId: editorOptions.getIn(["design", "applicationUserId"]),
                //         FrontalImage: FrontalImage ? FrontalImage.split(",")[1] : FrontalImage,
                //         BackgroundImage: BackgroundImage ? BackgroundImage.split(",")[1] : BackgroundImage,
                //         State: JSON.stringify({
                //             editorOptions: editorOptions.toJS(),
                //             bookDescription: bookCover.get("bookDescription"),
                //             selectedStyles: bookCover.get("selectedStyles"),
                //             selectedColor: bookCover.get("selectedColor"),
                //         }),
                //         Result: base64Image.split(",")[1],
                //     }),
                // }).then(response => {
                //     if (!response.ok)
                //         return

                //     response.json().then(({ coverId, applicationUserId }) => {
                //         const design = editorOptions.get("design")
                //             .set("coverId", coverId)
                //             .set("applicationUserId", applicationUserId)
                //         this.props.EditorOptionsActions.update({
                //             design,
                //         })
                //     })
                // })

                // this.setState({
                //     rotate3d: true,
                // })
        }, 500)
    }

    handlePrevStep() {
        this.props.history.goBack()
    }

    render () {
        const {editorOptions} = this.props
        if (!editorOptions)
            return null

        const {rotate3d} = this.state

        return (
            <article className={this.bem()}>
                <Header isPrev onPrevClick={::this.handlePrevStep}/>
                <section className={this.bem("Box")}>
                    <BookCover3D
                        width={1333}
                        height={2000}
                        action={rotate3d}
                    >
                        <Design
                            currentRef={this.refDesign}
                            design={editorOptions.get("design")}
                            width={1333}
                            height={2000}
                            scale={2.2}
                            noShadow
                        />
                    </BookCover3D>
                    <Link className={this.bem("Download")} to={`/api/cover/get?id=${editorOptions.getIn(["design", "coverId"])}`} target="_blank">
                        Download
                    </Link>
                    <div className={this.bem("Loading", {active:!rotate3d})}>
                        <FontAwesomeIcon
                            icon={["fa", "sync"]}
                            spin
                            className={this.bem("Loading-Icon")}
                        />
                    </div>
                </section>
            </article>
        )
    }
}

export default connect(
    state => ({
        editorOptions: EditorOptionsSelector({state}),
        bookCover: BookCoverSelector({state}),
    }),
    dispatch => ({
        EditorOptionsActions: bindActionCreators(EditorOptionsActions, dispatch),
    }),
)(Preview)
