const { HTMLElement, NodeList } = window

// HTMLElement .forEach
if (HTMLElement && !HTMLElement.prototype.forEach) {
  HTMLElement.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window

    callback.call(thisArg, this, this, this)
  }
}

// NodeList .forEach
if (NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window

    for (let i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this)
    }
  }
}

// NodeList .map
if (NodeList && !NodeList.prototype.map) {
  NodeList.prototype.map = Array.prototype.map
}

// NodeList .find
if (NodeList && !NodeList.prototype.find) {
  NodeList.prototype.find = Array.prototype.find
}

// NodeList .filter
if (NodeList && !NodeList.prototype.filter) {
  NodeList.prototype.filter = Array.prototype.filter
}

// NodeList .forEach
if (NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window

    for (let i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this)
    }
  }
}
