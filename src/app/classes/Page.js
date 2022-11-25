import GSAP from 'gsap'
import Prefix from 'prefix'

import Component from '@/classes/Component'

export default class Page extends Component {
  constructor () {
    super({
      classes: {
        menuActive: 'menu--active'
      },
      element: '.home',
      elements: {
        wrapper: '.home__wrapper'
      }
    })

    this.transform = Prefix('transform')

    this.create()
  }

  create () {
    super.create()

    this.timeline = GSAP.timeline({
      delay: 2.5
    })

    // this.timeline.fromTo(this.elements.headerArrow, {
    //   y: '-20rem'
    // }, {
    //   duration: 2,
    //   ease: 'expo.inOut',
    //   y: 0
    // }, 0)

    // this.timeline.fromTo(this.elements.headerArrowDash, {
    //   scaleY: 0
    // }, {
    //   duration: 1,
    //   ease: 'expo.in',
    //   onComplete: _ => {
    //     GSAP.to(this.elements.headerArrowDash, {
    //       duration: 1,
    //       ease: 'expo.out',
    //       scaleY: 1
    //     })
    //   },
    //   scaleY: 2
    // }, 0)

    // this.timeline.fromTo(this.elements.headerArrowTriangle, {
    //   scale: 0,
    //   y: '2rem'
    // }, {
    //   duration: 1,
    //   ease: 'expo.out',
    //   scale: 1,
    //   transformOrigin: '0 100%',
    //   y: 0
    // }, 1)
  }

  /**
   * Events.
   */

  /**
   * Animation.
   */
  show () {

  }

  /**
   * Loop.
   */
  update () {

  }

  /**
   * Events.
   */
  addEventListeners () {
    window.addEventListener('mousewheel', this.onWheel, {
      passive: true
    })
    window.addEventListener('wheel', this.onWheel, {
      passive: true
    })

    window.addEventListener('keydown', this.onKeyDown)
  }
}
