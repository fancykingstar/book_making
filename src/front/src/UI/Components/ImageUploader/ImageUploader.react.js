import './ImageUploader.less'
import React, { Component } from 'react'

import bem from 'Helpers/Bem.helper'
import classNames from 'classnames'

import MobileDetect from 'mobile-detect'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

export default class ImageUploader extends Component {
    constructor (props) {
        super(props)
        this.boxClassName = 'ImageUploader'
        this.bem = bem.with(this.boxClassName)

        this.state = {
            id: `${+new Date}${Math.floor(Math.random()*1e8)}`,
            src: null,
            sync: false,
        }

        this.refInput = React.createRef()
        this.refImage = React.createRef()
        this.refCanvas = React.createRef()
    }

    componentDidMount() {
        const {image} = this.props
        if (!image)
            return

        // const urlCreator = window.URL || window.webkitURL
        // if (!urlCreator)
        //     return
        // const imageUrl = urlCreator.createObjectURL(image)
        // if (!imageUrl)
        //     return
        this.handleImageLoad(image.src)
    }

    componentDidUpdate(prevProps, {src:prevSrc}) {
        const {src:currentSrc} = this.state
        if (currentSrc != prevSrc) {
            this.props.onChange(currentSrc)
        }
    }

    componendWillUnmount() {}

    getCroppedImg(image, pixelCrop, fileName) {

        const canvas = this.refCanvas.current
        canvas.width = pixelCrop.width
        canvas.height = pixelCrop.height
        const ctx = canvas.getContext('2d')

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height,
        )

        // As Base64 string
        const base64Image = canvas.toDataURL('image/png');
        return {
            id: `${+new Date} ${fileName}`,
            src: base64Image,
        }

        // As a blob
        // return new Promise((resolve, reject) => {
        //     canvas.toBlob(blob => {
        //         blob.name = fileName
        //         resolve(blob)
        //     }, 'image/jpeg')
        // })
    }

    async cropImage(...args) {
        return this.getCroppedImg(...args)
    }

    handleImageLoad(imageSource) {
        const {cropRatio, name} = this.props
        const image = new Image
        image.onload = () => {
            let {naturalWidth, naturalHeight} = image
            let baseCrop = {
                aspect: cropRatio,
                x: 0,
                y: 0,
                width: naturalWidth,
                height: naturalHeight,
            }
            if (naturalWidth / naturalHeight != cropRatio) {
                if (naturalWidth <= naturalHeight * cropRatio) {
                    baseCrop = {aspect:cropRatio, width:naturalWidth, height:naturalWidth/cropRatio}
                    baseCrop.x = 0
                    baseCrop.y = (naturalHeight - baseCrop.height) / 2

                } else if (naturalHeight <= naturalWidth / cropRatio) {
                    baseCrop = {aspect:cropRatio, height:naturalHeight, width:naturalHeight*cropRatio}
                    baseCrop.x = (naturalWidth - baseCrop.width) /2
                    baseCrop.y = 0
                }
            }
            this.cropImage(image, baseCrop, name).then(d => {
                this.setState({
                    src: d,
                    sync: false,
                    baseCrop,
                })
            })
        }
        image.src = imageSource
    }

    handleChange() {
        const file = this.refInput.current.files[0]
        if (!file)
            return

        this.setState({
            sync: true,
        })

        const reader  = new FileReader()
        reader.addEventListener("load", () => {
            this.handleImageLoad(reader.result)
        }, false)

        reader.readAsDataURL(file)
    }

    handleDeleteSrc() {
        this.setState({
            src: null,
        })
    }

    render () {
        const {image, className, cropRatio, baseWidth, baseHeight} = this.props
        const {id, src, sync, baseCrop} = this.state
        return (
            <div className={classNames(this.bem(), className)}>
                <div
                    className={this.bem("InputBox")}
                    style={{
                        width: baseWidth,
                        height: baseHeight || baseWidth/cropRatio,
                    }}
                >
                    <input
                        id={id}
                        ref={this.refInput}
                        type="file"
                        className={this.bem("Input")}
                        accept="image/*"
                        onChange={::this.handleChange}
                    />
                    <label className={this.bem("Input-Label", {active:!!src})} htmlFor={id}>
                        <FontAwesomeIcon
                            icon={["far", "file-image"]}
                            className={this.bem("Input-Label-Icon", {hidden:!!src})}
                        />
                        <span className={this.bem("Input-Label-Message", {hidden:!!src})}>click to upload</span>
                    </label>
                </div>
                <canvas
                    ref={this.refCanvas}
                    className={this.bem("Canvas", {active:!!src})}
                    style={{
                        transform: baseCrop ? `translate(-${baseWidth/2}px, -${baseWidth/cropRatio/2}px)` : null,
                        width: baseWidth,
                        height: baseWidth/cropRatio,
                    }}
                />
                <div className={this.bem("Controls")}>
                    <FontAwesomeIcon
                        icon={"sync"}
                        spin
                        className={this.bem("Controls-Sync", {active:sync})}
                    />
                    <FontAwesomeIcon
                        icon="times"
                        className={this.bem("Controls-Delete", {active:!!src})}
                        onClick={::this.handleDeleteSrc}
                    />
                </div>
            </div>
        )
    }
}
