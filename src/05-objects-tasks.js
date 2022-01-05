/* eslint-disable max-classes-per-file */
/* eslint-disable indent */
/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const result = Object.create(proto);
  // eslint-disable-next-line no-underscore-dangle
  const jsonObj = JSON.parse(json);
  const keys = Object.keys(jsonObj);
  // eslint-disable-next-line no-return-assign
  keys.map((e) => (result[e] = jsonObj[e]));
  return result;
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element.clas#ids[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
class CreateSelectors {
  constructor(selector1, combinator, selector2) {
    this.selector1 = selector1.stringify();
    this.selector2 = selector2.stringify();
    this.combinator = combinator;
  }

  stringify() {
    return `${this.selector1} ${this.combinator} ${this.selector2}`;
  }
}
class MySuperBaseElementSelector {
  constructor(selector, value) {
    this.elementString = '';
    this.idString = '';
    this.classString = '';
    this.attrString = '';
    this.pseudoClassString = '';
    this.pseudoElementString = '';
    this[selector](value);
  }

  element(value) {
    if (this.idString !== '' || this.classString !== '' || this.attrString !== '' || this.pseudoClassString !== '' || this.pseudoElementString !== '') {
      throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    if (this.elementString === undefined || this.elementString === '') {
      this.elementString = value;
      return this;
    }
    if (this.elementString !== undefined || this.elementString !== '') {
      throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    return this;
  }

  id(value) {
    if (this.classString !== '' || this.attrString !== '' || this.pseudoClassString !== '' || this.pseudoElementString !== '') {
      throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    if (this.idString === undefined || this.idString === '') {
      this.idString = `#${value}`;
      return this;
    }
    if (this.idString !== undefined || this.idString !== '') {
      throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    return this;
  }

  class(value) {
    if (this.attrString !== '' || this.pseudoClassString !== '' || this.pseudoElementString !== '') {
      throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    if (this.classString === undefined || this.classString === '') {
      this.classString = `.${value}`;
      return this;
    }
    this.classString = `${this.classString}.${value}`;
    return this;
  }

  attr(value) {
    if (this.pseudoClassString !== '' || this.pseudoElementString !== '') {
      throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    if (this.attrString === undefined || this.attrString === '') {
      this.attrString = `[${value}]`;
      return this;
    }
    this.attrString = `${this.attrString}.${value}`;
    return this;
  }

  pseudoClass(value) {
    if (this.pseudoElementString !== '') {
      throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    if (this.pseudoClassString === undefined || this.pseudoClassString === '') {
      this.pseudoClassString = `:${value}`;
      return this;
    }
    this.pseudoClassString = `${this.pseudoClassString}:${value}`;
    return this;
  }

  pseudoElement(value) {
    if (this.pseudoElementString === undefined || this.pseudoElementString === '') {
      this.pseudoElementString = `::${value}`;
      return this;
    }
    if (this.pseudoElementString !== undefined || this.pseudoElementString !== '') {
      throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    return this;
  }

  stringify() {
    return `${this.elementString}${this.idString}${this.classString}${this.attrString}${this.pseudoClassString}${this.pseudoElementString}`;
  }
}
const cssSelectorBuilder = {
  element(value) {
    return new MySuperBaseElementSelector('element', value);
  },

  id(value) {
    return new MySuperBaseElementSelector('id', value);
  },

  class(value) {
    return new MySuperBaseElementSelector('class', value);
  },

  attr(value) {
    return new MySuperBaseElementSelector('attr', value);
  },

  pseudoClass(value) {
    return new MySuperBaseElementSelector('pseudoClass', value);
  },

  pseudoElement(value) {
    return new MySuperBaseElementSelector('pseudoElement', value);
  },

  combine(selector1, combinator, selector2) {
    return new CreateSelectors(selector1, combinator, selector2);
  },
};
module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
