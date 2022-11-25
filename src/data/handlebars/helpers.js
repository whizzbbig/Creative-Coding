import Handlebars from 'handlebars'

import * as prismicHelpers from '@prismicio/helpers'
import { prismicHelpersLinks } from '../prismic/helpers.js'

export const handlebarsHelpers = {
  breaklines: text => {
    text = Handlebars.Utils.escapeExpression(text)
    text = text.replace(/(\r\n|\n|\r)/gm, '<br>')

    return new Handlebars.SafeString(text)
  },

  prismicLink: data => {
    return prismicHelpers.asLink(data, prismicHelpersLinks)
  },

  prismicHTML: data => {
    return prismicHelpers.asHTML(data, prismicHelpersLinks)
  },

  prismicText: data => {
    return prismicHelpers.asText(data, prismicHelpersLinks)
  },

  prismicMedia: ({ url }) => {
    if (url) {
      url = url.replace('https://thieb.cdn.prismic.io/thieb/', '/medias/')
      url = url.replace('https://images.prismic.io/thieb/', '/medias/')
      url = url.replace('?auto=compress,format', '')
      url = url.replace(/\+/g, '-')
    }

    return url
  }
}

Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
  switch (operator) {
    case '==': return (v1 === v2) ? options.fn(this) : options.inverse(this)
    case '===': return (v1 === v2) ? options.fn(this) : options.inverse(this)
    case '!=': return (v1 !== v2) ? options.fn(this) : options.inverse(this)
    case '!==': return (v1 !== v2) ? options.fn(this) : options.inverse(this)
    case '<': return (v1 < v2) ? options.fn(this) : options.inverse(this)
    case '<=': return (v1 <= v2) ? options.fn(this) : options.inverse(this)
    case '>': return (v1 > v2) ? options.fn(this) : options.inverse(this)
    case '>=': return (v1 >= v2) ? options.fn(this) : options.inverse(this)
    case '&&': return (v1 && v2) ? options.fn(this) : options.inverse(this)
    case '||': return (v1 || v2) ? options.fn(this) : options.inverse(this)
    default: return options.inverse(this)
  }
})
