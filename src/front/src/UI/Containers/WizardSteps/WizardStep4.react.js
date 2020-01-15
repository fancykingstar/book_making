import './WizardStep4.less'
import React, { Component } from 'react'

import bem from 'Helpers/Bem.helper'
import classNames from 'classnames'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import Header from 'UI/Containers/Header/Header.react'
import Title from 'UI/Components/Title/Title.react'
import SubTitle from 'UI/Components/SubTitle/SubTitle.react'
import Center from 'UI/Components/Center/Center.react'
import Colors from 'UI/Components/Colors/Colors.react'
import Footer from 'UI/Components/Footer/Footer.react'

import BookCoverSelector from 'Redux/Selectors/BookCover/BookCover.selector'
import * as BookCoverActions from 'Redux/Actions/BookCover/BookCover.actions'

class WizardStep4 extends Component {
    constructor (props) {
        super(props)
        this.blockName = 'WizardStep4'
        this.bem = bem.with(this.blockName)

        const {selectedColor} = props.bookCover.toJS()
        this.state = {
            selectedColor,
            colors: [
                {
                    palette: ["#212121","#1B0E3B","#281A27","#210F0B","#112121","#000000"],
                    paletteExtended: ["#000000", "#210f0b", "#212121", "#1e0900", "#281a27", "#2d2c0e", "#1b0e3b", "#142f2f", "#1d2619", "#291105", "#292929", "#202547"],
                    title: "Black",
                    id: "black",
                },
                {
                    palette: ["#DCDCDC","#C0C0C0","#919294","#86929F","#9B9389","#696969"],
                    paletteExtended: ["#808080", "#dcdcdc", "#d3d3d3", "#c0c0c0", "#a9a9a9", "#778899", "#708090", "#696969", "#919294", "#86929f", "#9b9389", "#65605a"],
                    title: "Gray",
                    id: "gray",
                },
                {
                    palette: ["#fffafa","#F5F5F5","#F8F8FF","#F0F8FF","#FFFFF0","#F5FFFA"],
                    paletteExtended: ["#FFFFFF", "#f5f5f5", "#f8f8ff", "#f0f8ff", "#f0ffff", "#f5fffa", "#f0fff0", "#fffff0", "#fffaf0", "#fdf5e6", "#fffafa", "#fff5ee"],
                    title: "White",
                    id: "white",
                },
                {
                    palette: ["#975f2c","#833C0C","#6c211e","#AC9373","#593A1E","#381613"],
                    paletteExtended: ["#800000", "#ac9373", "#8d795f", "#5a4646", "#a0522d", "#8b4513", "#6c211e", "#381613", "#975f2c", "#aa6a2c", "#784c25", "#593a1e"],
                    title: "Brown",
                    id: "brown",
                },

                {
                    palette: ["#FFE4B5","#FFC26C","#FFA500","#FF8C00","#ED7D31","#D2691E"],
                    paletteExtended: ["#FFA500", "#ffe4b5", "#ffc26c", "#ffa500", "#ff8c00", "#ffdab9", "#f4a460", "#ea9a69", "#d2691e", "#daa520", "#cd853f", "#b8860b"],
                    title: "Orange",
                    id: "orange",
                },
                {
                    palette: ["#FFF39C","#FDE910","#FFD700","#FFBF00","#EFC900","#DFBB00"],
                    paletteExtended: ["#FFFF00", "#ffffe0", "#fff39c", "#fde910", "#ffd700", "#ffbf00", "#efc900", "#dfbb00", "#fff8dc", "#eee8aa", "#f0e68c", "#cfb53b"],
                    title: "Yellow",
                    id: "yellow",
                },
                {
                    palette: ["#FA8072","#FF4500","#DD2000","#FF0000","#DC143C","#B22222"],
                    paletteExtended: ["#FF0000", "#ffa07a", "#ff7f50", "#fa8072", "#ff6347", "#ff4500", "#ff2400", "#dd2000", "#dc143c", "#d53e07", "#b22222", "#800000"],
                    title: "Red",
                    id: "red",
                },
                {
                    palette: ["#FFB6C1","#DB7093","#E75480","#FF69B4","#FF1493","#C71585"],
                    paletteExtended: ["#ff00ff", "#ffb6c1", "#f08080", "#db7093", "#e75480", "#ff69b4", "#ff1493", "#c71585", "#fc0fc0", "#f984e5", "#ee82ee", "#da70d6"],
                    title: "Pink",
                    id: "pink",
                },
                {
                    palette: ["#BA55D3","#9400D3","#8A2BE2","#9370DB","#7B68EE","#6A5ACD"],
                    paletteExtended: ["#800080", "#8b008b", "#800080", "#ba55d3", "#9932cc", "#9400d3", "#8a2be2", "#4b0082", "#9370db", "#7b68ee", "#6a5acd", "#483d8b"],
                    title: "Violet",
                    id: "lilac",
                },

                {
                    palette: ["#87CEFA","#00BFFF","#1E90FF","#4169E1","#0432FF","#0000CD"],
                    paletteExtended: ["#0000FF", "#87cefa", "#3a75c4", "#4682b4", "#87ceeb", "#00bfff", "#1e90ff", "#007fff", "#6495ed", "#4169e1", "#0000cd", "#00008b"],
                    title: "Blue",
                    id: "blue",
                },
                {
                    palette: ["#AFEEEE","#00EFF0","#00D1D2","#7FFFD4","#66CDAA","#009193"],
                    paletteExtended: ["#008080", "#afeeee", "#00eff0", "#00d1d2", "#7fffd4", "#40e0d0", "#48d1cc", "#00ced1", "#20b2aa", "#66cdaa", "#5f9ea0", "#008b8b"],
                    title: "Teal",
                    id: "turquoise",
                },
                {
                    palette: ["#98FB98","#00FF7F","#32CD32","#3CB371","#008F00","#006400"],
                    paletteExtended: ["#008000", "#00ff7f", "#3cb371", "#2e8b57", "#98fb98", "#32cd32", "#228b22", "#006400", "#adff2f", "#7cfc00", "#9acd32", "#6b8e23"],
                    title: "Green",
                    id: "green",
                }
            ],
        }
    }

    handlePrevStep() {
        this.props.history.goBack()
    }

    handleNextStep() {
        this.props.history.push("/wizard/5")
    }

    handleColorSelect(selectedColor) {
        this.setState({
            selectedColor,
        })

        setTimeout(() => {
            this.props.BookCoverActions.update({
                selectedColor,
                updated: true,
            })
        })
    }

    render () {
        const isNext = true
        const {selectedColor, colors} = this.state

        return (
            <article className={this.bem()}>
                <Header isPrev onPrevClick={(...args) => this.handlePrevStep(...args)}/>
                <Center>
                    <Title>Select color you like</Title>
                    <SubTitle>We will use it for inspiration</SubTitle>
                    <Colors
                        colors={colors}
                        selectedColor={selectedColor}
                        onSelect={(...args) => this.handleColorSelect(...args)}
                    />
                </Center>
                <Footer
                    hasNext={true}
                    activeNext={!!selectedColor}

                    onNextClick={::this.handleNextStep}
                />
            </article>
        )
    }
}

export default connect(
    state => ({
        bookCover: BookCoverSelector({state}),
    }),
    dispatch => ({
        BookCoverActions: bindActionCreators(BookCoverActions, dispatch),
    }),
)(WizardStep4)

