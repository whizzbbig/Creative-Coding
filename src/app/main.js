import '../styles/index.scss'

import '@/utils/easings'
import '@/utils/polyfill'
import '@/utils/sw'

import Application from '@/classes/App'

import '@/components/sketch-01'
import '@/components/sketch-02'
import '@/components/sketch-03'
import '@/components/sketch-04'
import '@/components/sketch-05'

window.App = new Application()
