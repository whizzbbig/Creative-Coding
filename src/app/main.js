import '../styles/index.scss'

import '@/utils/easings'
import '@/utils/polyfill'
import '@/utils/sw'

import Application from '@/classes/App'

window.App = new Application()
