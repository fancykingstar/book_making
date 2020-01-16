import './Saved.less'
import React, { Component } from 'react'

import bem from 'Helpers/Bem.helper'
import classNames from 'classnames'
import I from 'immutable'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import Header from 'UI/Containers/Header/Header.react'
import Title from 'UI/Components/Title/Title.react'
import Center from 'UI/Components/Center/Center.react'
import Design from 'UI/Containers/Design/Design.react'
import User from 'UI/Containers/User/User.react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Config from 'Config/Config'

import * as EditorOptionsActions from 'Redux/Actions/EditorOptions/EditorOptions.actions'

class Saved extends Component {
    constructor (props) {
        super(props)
        this.blockName = 'Saved'
        this.bem = bem.with(this.blockName)

        this.state = {
            limit: 8,
            list: I.List(),
            loading: false,
        }

        this.refForm = React.createRef()
    }

    componentDidMount() {
        this.setState({
            loading: true,
        })
        fetch("/api/cover/all", {
            method: "GET",
        }).then(response => {
            if (!response.ok)
                return alert("Oops, something went wrong, try again please")

            response.json().then(response => {
                this.setState({
                    list: I.fromJS(response.map(d => ({
                        ...d,
                        state: JSON.parse(d.state),
                    }))),
                    loading: false,
                })
            })
        })
    }

    handlePrevStep() {
        this.props.history.goBack()
    }

    handleEdit(design) {
        this.props.EditorOptionsActions.update({
            design,
        })
        this.props.history.push("/editor")
    }

    handleBilling(d) {
        this.props.history.push({
            pathname: "/rates",
            state: {
                coverId: d.get("coverId"),
            },
        })
    }

    handleDelete(d, index) {
        if (window.confirm("Do you want to delete design? This action couldn't be undone.")) {
            fetch(`${Config.API_ROOT_HTTP}/api/cover/delete?id=${d.get("coverId")}`, {
                method: "GET",
            }).then(response => {
                if (!response.ok)
                    return alert("Oops, something went wrong, try again please")
    
                response.json().then(response => {
                    if (response) {
                        this.setState(prevState => ({
                            list: prevState.list.splice(index, 1),
                        }))
                    } else {
                        alert("Oops, something went wrong, try again please")
                    }
                })
            })//
        }
    }

    renderControls(user, design) {
        return (
            <div className={this.bem("Controls")} style={{ opacity: design ? 1 : 0, pointerEvents: design ? 'all' : 'none'}}>
                <a
                    target="_blank"
                    href={`/api/cover/get?id=${design ? design.get("coverId") : ''}`}
                    className={this.bem("DownloadButton", {visible:user && user.get("CanDownload")})}
                >
                    Download
                </a>
                <button
                    className={this.bem("DownloadButton", {visible:user && !user.get("CanDownload")})}
                    onClick={() => this.handleBilling(design)}
                    onKeyPress={target => target.charCode == 13 && this.handleBilling()}
                >
                    Download
                </button>
                <div
                    className={this.bem("DeleteButton")}
                    onClick={() => this.handleDelete(design, index)}
                >
                    <FontAwesomeIcon
                        icon="times"
                        className={this.bem("DeleteButtonIcon")}
                    />
                </div>
            </div>
        )
    }

    render () {
        const {className} = this.props
        const {list, loading, limit} = this.state
        const designs = list.map(d => d
            .getIn(["state", "editorOptions", "design"])
            .set("coverId", d.get("coverId"))
            .set("applicationUserId", d.get("applicationUserId"))
        )
        const width = 200
        const height = 300

        return (
            <article className={this.bem()}>
                <Header isPrev onPrevClick={::this.handlePrevStep}/>
                <div className={this.bem("Center")}>
                    <Title>Saved designs</Title>
                    <User>
                        {user => 
                            (
                                <ul className={this.bem("List")}>
                                    {designs.size
                                        ? designs.map((d, index) => (
                                            <li
                                                key={index}
                                                className={this.bem("Item")}
                                            >
                                                <Design
                                                    design={d}
                                                    width={width}
                                                    height={height}
                                                    scale={1/3}
                                                    hoverEffect
                                                    hoverText="Edit"
                                                    onClick={() => this.handleEdit(d)}
                                                />
                                                {this.renderControls(user, d)}
                                            </li>
                                        ))
                                    : 
                                    [...Array(limit)].map((e, i) =>
                                        <li
                                            key={i}
                                            className={this.bem("Item")}
                                            
                                        >
                                            <div className={this.bem("Placeholder")} style={{ width, height }}>
                                                <img src="/images/gifs/loading.gif" />
                                            </div>
                                            {this.renderControls(user, null)}
                                        </li>)
                                    }
                                </ul>
                            )
                        }
                    </User>
                </div>
            </article>
        )
    }
}

export default connect(
    state => ({}),
    dispatch => ({
        EditorOptionsActions: bindActionCreators(EditorOptionsActions, dispatch),
    }),
)(Saved)

