import I from 'immutable'

import TEXT_FONT_SIZE_OPTIONS from 'Consts/TEXT_FONT_SIZE_OPTIONS.const'
import TEXT_ALIGN_OPTIONS from 'Consts/TEXT_ALIGN_OPTIONS.const'
import TEXT_LETTER_SPACE_OPTIONS from 'Consts/TEXT_LETTER_SPACE_OPTIONS.const'
import TEXT_SHADOW_OPTIONS from 'Consts/TEXT_SHADOW_OPTIONS.const'
import TEXT_LETTER_CASE_OPTIONS from 'Consts/TEXT_LETTER_CASE_OPTIONS.const'

import IMAGE_SCALE_OPTIONS from 'Consts/IMAGE_SCALE_OPTIONS.const'
import IMAGE_BLUR_RADIUS_OPTIONS from 'Consts/IMAGE_BLUR_RADIUS_OPTIONS.const'

export function getBoxJustifyContentByLocations(titlePosition, authorPosition) {
    if (!titlePosition || !authorPosition)
        return "space-between"

    if (titlePosition.get("location") == authorPosition.get("location")) {
        if (titlePosition.get("location") == "top")
            return "flex-start"
        if (titlePosition.get("location") == "bottom")
            return "flex-end"
    }
    return "space-between"
}

export default class MasterDesigns {
    constructor(props) {
        Object.assign(this, props)

        this.foregroundImages = I.List.isList(this.foregroundImages) ? this.foregroundImages : I.List([this.foregroundImages])
        this.backgroundImages = I.List.isList(this.backgroundImages) ? this.backgroundImages : I.List([this.backgroundImages])
        this.bookTitleFonts = I.List.isList(this.bookTitleFonts) ? this.bookTitleFonts : I.List([this.bookTitleFonts])
        this.authorNameFonts = I.List.isList(this.authorNameFonts) ? this.authorNameFonts : I.List([this.authorNameFonts])
        this.subTitleFonts = I.List.isList(this.subTitleFonts) ? this.subTitleFonts : I.List([this.subTitleFonts])
    }

    getTextPosition() {
        return this.textPositions && this.textPositions.size ? this.textPositions.get(Math.floor(Math.random()*this.textPositions.size)) : null
    }

    getFont() {
        return this.textFonts && this.textFonts.size ? this.textFonts.get(Math.floor(Math.random()*this.textFonts.size)) : null
    }

    createDesign({
        foregroundImage,
        backgroundImage,

        bookTitle,
        bookTitleText,
        bookTitlePosition,
        bookTitleColor,
        bookTitleFont,

        authorName,
        authorNameText,
        authorNamePosition,
        authorNameColor,
        authorNameFont,

        subTitle,
        subTitleText,
        subTitlePosition,
        subTitleColor,
        subTitleFont,

        bookGenre,
    }) {
        return I.fromJS({
            foregroundImage: {
                position: {
                    x: "0%",
                    y: "-50%",
                },
                scale: IMAGE_SCALE_OPTIONS.first(),
                blurRadius: IMAGE_BLUR_RADIUS_OPTIONS.first(),
                ...foregroundImage.toJS(),
            },
            backgroundImage,
            bookTitle: {
                ...({
                    fontSize:TEXT_FONT_SIZE_OPTIONS.get(0),
                    textAlign:TEXT_ALIGN_OPTIONS.first(),
                    textLetterSpace:TEXT_LETTER_SPACE_OPTIONS.get(0),
                    textShadow:TEXT_SHADOW_OPTIONS.get(0),
                    textLetterCase:TEXT_LETTER_CASE_OPTIONS.get(0),
                }),
                ...(bookTitle ? bookTitle.toJS() : {}),
                text: bookTitleText,
                position: bookTitlePosition,
                defaultPosition: bookTitlePosition,
                color: bookTitleColor,
                font: bookTitleFont,
            },
            authorName:{
                ...({
                    fontSize:TEXT_FONT_SIZE_OPTIONS.get(1),
                    textAlign:TEXT_ALIGN_OPTIONS.first(),
                    textLetterSpace:TEXT_LETTER_SPACE_OPTIONS.get(1),
                    textShadow:TEXT_SHADOW_OPTIONS.get(1),
                    textLetterCase:TEXT_LETTER_CASE_OPTIONS.get(1),
                }),
                ...(authorName ? authorName.toJS() : {}),
                text: authorNameText,
                position: authorNamePosition,
                defaultPosition: authorNamePosition,
                color: authorNameColor,
                font: authorNameFont,
            },
            subTitle:{
                ...({
                    fontSize:TEXT_FONT_SIZE_OPTIONS.get(2),
                    textAlign:TEXT_ALIGN_OPTIONS.first(),
                    textLetterSpace:TEXT_LETTER_SPACE_OPTIONS.get(2),
                    textShadow:TEXT_SHADOW_OPTIONS.get(2),
                    textLetterCase:TEXT_LETTER_CASE_OPTIONS.get(2),
                }),
                ...(subTitle ? subTitle.toJS() : {}),
                text: subTitleText,
                position: subTitlePosition,
                defaultPosition: subTitlePosition,
                color: subTitleColor,
                font: subTitleFont,
            },
            bookGenre,
        })
    }

    getOptions() {
        let options = I.List()
        this.foregroundImages.forEach(fi => {
            this.backgroundImages.filter(d => fi.get("modelId") ? d.get("modelId") == fi.get("modelId") : true).forEach(bi => {

                const position = this.getTextPosition()

                let properties = {
                    foregroundImage:fi,
                    backgroundImage:bi,

                    bookGenre:this.bookGenre,
                }

                properties = {
                    ...properties,
                    bookTitle:this.bookTitle,
                    bookTitleText:this.bookTitleText,
                    bookTitlePosition:position ? position.get("bookTitle") : this.bookTitlePosition,
                    bookTitleColor:this.bookTitleColor,
                }

                properties = {
                    ...properties,
                    authorName:this.authorName,
                    authorNameText:this.authorNameText,
                    authorNamePosition:position ? position.get("authorName") : this.authorNamePosition,
                    authorNameColor:this.authorNameColor,
                }

                properties = {
                    ...properties,
                    subTitle:this.subTitle,
                    subTitleText:this.subTitleText,
                    subTitlePosition:position ? position.get("subTitle") : this.subTitlePosition,
                    subTitleColor:this.subTitleColor,
                }

                if (
                    this.bookTitleFonts && this.bookTitleFonts.size &&
                    this.authorNameFonts && this.authorNameFonts.size &&
                    this.subTitleFonts && this.subTitleFonts.size
                ) {
                    // console.log(this.bookTitleFonts)
                    // console.log(this.authorNameFonts)
                    // console.log(this.subTitleFonts)

                    for (const bookTitle = 0; bookTitle < this.bookTitleFonts.length; bookTitle++) {
                        for (const authorName = 0; authorName < this.authorNameFonts.length; authorName++) {
                            for (const subTitle = 0; subTitle < this.subTitleFonts.length; subTitle++) {
                                const bookTitleFont = this.bookTitleFonts[bookTitle]
                                const authorNameFont = this.authorNameFonts[authorName]
                                const subTitleFont = this.subTitleFonts[subTitle]

                                if (bookTitleFont) {
                                    properties = {
                                        ...properties,
                                        bookTitleFont,
                                    }
                                }
                                if (authorNameFont) {
                                    properties = {
                                        ...properties,
                                        authorNameFont,
                                    }
                                }
                                if (subTitleFont) {
                                    properties = {
                                        ...properties,
                                        subTitleFont,
                                    }
                                }
                                options = options.push(this.createDesign(properties))
                            }
                        }
                    }
                    
                    for (let i = 0; i < 10; i++) {
                        const newProps = {
                            ...properties,
                            bookTitleFont: this.bookTitleFonts.get(Math.floor(Math.random() *  this.bookTitleFonts.size)),
                            authorNameFont: this.authorNameFonts.get(Math.floor(Math.random() *  this.authorNameFonts.size)),
                            subTitleFont: this.subTitleFonts.get(Math.floor(Math.random() *  this.subTitleFonts.size)),
                        }

                        // console.log(this.bookTitleFonts)
                        // console.log(this.bookTitleFonts.get(1))
                        // console.log(this.bookTitleFonts[1])
                        // console.log(this.bookTitleFonts.length)
                        // console.log(Math.random() *  this.bookTitleFonts.length)
                        // console.log(Math.floor(Math.random() *  this.bookTitleFonts.length))
                        // // console.log(Math.floor(Math.random() *  this.bookTitleFonts.length))
                        // console.log('newProps')
                        // console.log(newProps)
                        options = options.push(this.createDesign(newProps))
                    }

                    this.bookTitleFonts.forEach(bookTitleFont => {
                        this.authorNameFonts.forEach(authorNameFont => {
                            this.subTitleFonts.forEach(subTitleFont => {
                                let newProps = { ...properties }
                                if (bookTitleFont) {
                                    newProps = {
                                        ...newProps,
                                        bookTitleFont,
                                    }
                                }
                                if (authorNameFont) {
                                    newProps = {
                                        ...newProps,
                                        authorNameFont,
                                    }
                                }
                                if (subTitleFont) {
                                    newProps = {
                                        ...newProps,
                                        subTitleFont,
                                    }
                                }
                                options.push(this.createDesign(newProps))
                            })
                        })
                    })
                } else {
                    options.push(this.createDesign(properties))
                }
            })
        })

        if (!this.noShuffle)
            options = options.sortBy(Math.random)

        return options
    }
}
