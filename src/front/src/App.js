import 'regenerator-runtime'
import React from 'react'
import { render } from 'react-dom'
import RouterMap from 'UI/Router/Map.router.react'

import CONFIG from 'Config/Config'

import {library} from '@fortawesome/fontawesome-svg-core'
import {faCheck, faTrashAlt, faSync, faTimes, faHeart, faUndo, faArrowLeft} from '@fortawesome/free-solid-svg-icons'
import {faFileImage} from '@fortawesome/free-regular-svg-icons'

library.add(faFileImage, faCheck, faTrashAlt, faSync, faTimes, faHeart, faUndo, faArrowLeft)

render(RouterMap, document.getElementById('Stage'))
