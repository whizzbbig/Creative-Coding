import GUI from 'lil-gui'

export default window.location.search.indexOf('gui') > -1 ? new GUI() : null
