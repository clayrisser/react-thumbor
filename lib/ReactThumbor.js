'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

var Thumbor = (function (_Component) {
  _inherits(Thumbor, _Component);

  function Thumbor(props) {
    _classCallCheck(this, Thumbor);

    _get(Object.getPrototypeOf(Thumbor.prototype), 'constructor', this).call(this, props);
    this.state = {
      imageLoaded: false,
      imageRendered: false
    };
  }

  _createClass(Thumbor, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.chance = new _chance2['default']();
      if (this.props.server) {
        this.server = this.props.server;
      } else {
        this.server = '';
      }
      var dimensions = this.smartlyGuessDimensions();
      this.height = this.newDimension(dimensions.height, dimensions.realHeight);
      this.width = this.newDimension(dimensions.width, dimensions.realWidth);
      this.image = this.server + '/unsafe/' + this.width.real + 'x' + this.height.real + '/' + this.props.src;
      this.loadedImageId = this.chance.string();
      this.loadedImage = _react2['default'].createElement('img', { id: this.loadedImageId, key: 'loadedImage', src: this.image, onLoad: this.imageLoaded.bind(this), onError: this.imageError.bind(this), hidden: true });
    }
  }, {
    key: 'render',
    value: function render() {
      var rendered = [this.loadedImage];
      if (this.state.imageLoaded && !this.state.imageRendered) {
        this.updateDimensions();
        rendered.push(this.renderImage());
        console.log(this.width);
        console.log(this.height);
      }
      return _react2['default'].createElement(
        'div',
        null,
        rendered
      );
    }
  }, {
    key: 'renderImage',
    value: function renderImage() {
      var attrs = {};
      var preset = this.getPreset();
      var type = this.getType();
      attrs.style = _lodash2['default'].extend(attrs.style, {
        backgroundImage: 'url("' + this.image + '")',
        maxWidth: '100%'
      });
      if (type === 'background') {
        attrs.style = _lodash2['default'].extend(attrs.style, {
          backgroundPosition: 'center'
        });
        if (preset) attrs.style = _lodash2['default'].extend(attrs.style, preset);
        if (this.height.value) attrs.style = _lodash2['default'].extend(attrs.style, { height: this.height.value + this.height.type });
        if (this.width.value) attrs.style = _lodash2['default'].extend(attrs.style, { width: this.width.value + this.width.type });
        if (this.props.backgroundPosition) attrs.style = _lodash2['default'].extend(attrs.style, { backgroundPosition: this.props.backgroundPosition });
        if (this.props.backgroundRepeat) attrs.style = _lodash2['default'].extend(attrs.style, { backgroundRepeat: this.props.backgroundRepeat });
        if (this.props.backgroundColor) attrs.style = _lodash2['default'].extend(attrs.style, { backgroundColor: this.props.backgroundColor });
        if (this.props.backgroundSize) attrs.style = _lodash2['default'].extend(attrs.style, { backgroundSize: this.props.backgroundSize });

        return _react2['default'].createElement(
          'div',
          _extends({ key: 'div' }, attrs),
          this.props.children
        );
      } else {
        if (this.height.value) attrs.height = this.height.value + this.height.type;
        if (this.width.value) attrs.width = this.width.value + this.width.type;
        return _react2['default'].createElement('img', _extends({ key: 'img', src: this.image }, attrs));
      }
      if (this.props.maxWidth) attrs.style = _lodash2['default'].extend(attrs.style, { maxWidth: this.props.maxWidth });
      if (this.props.maxHeight) attrs.style = _lodash2['default'].extend(attrs.style, { maxHeight: this.props.maxHeight });
      this.setState({ imageRendered: true });
    }
  }, {
    key: 'getPreset',
    value: function getPreset() {
      switch (this.props.preset) {
        case 'responsive':
          return {
            maxWidth: '100%',
            backgroundPosition: 'top center',
            backgroundSize: 'cover',
            maxHeight: '360px'
          };
        default:
          return false;
      }
    }
  }, {
    key: 'getType',
    value: function getType() {
      if (this.props.type) return this.props.type;
      switch (this.props.preset) {
        case 'responsive':
          return 'background';
        default:
          return 'image';
      }
    }
  }, {
    key: 'imageLoaded',
    value: function imageLoaded() {
      this.setState({ imageLoaded: true });
    }
  }, {
    key: 'imageError',
    value: function imageError(err) {
      console.error(err);
    }
  }, {
    key: 'updateDimensions',
    value: function updateDimensions() {
      var loadedImage = document.getElementById(this.loadedImageId);
      if (this.props.type === 'background') {
        if (!this.props.height && !this.props.width) {
          this.width.value = loadedImage.naturalWidth;
          this.height.value = loadedImage.naturalHeight;
        } else {
          if (!this.props.height) {
            this.height.value = loadedImage.naturalHeight;
          } else if (!this.props.width && this.height.type === '%') {
            this.width.value = loadedImage.naturalWidth;
          }
        }
      }
    }
  }, {
    key: 'smartlyGuessDimensions',
    value: function smartlyGuessDimensions() {
      var width = this.props.width;
      var height = this.props.height;
      var realHeight = this.props.realHeight;
      var realWidth = this.props.realWidth;
      var maxHeight = this.props.maxHeight;
      var maxWidth = this.props.maxWidth;
      if ((!width || width.substring(width.length - 1) === '%') && ( // if i have to be smart
      !height || height.substring(height.length - 1) === '%')) {
        // about guessing dimensions
        var guessed = false;
        if (maxWidth) {
          if (maxWidth.substring(maxWidth.length - 2) === 'px') {
            maxWidth = maxWidth.substring(0, maxWidth.length - 2);
          }
          if (Number(maxWidth) <= 1024) {
            realWidth = maxWidth;
            guessed = true;
          }
        } else if (maxHeight) {
          if (maxHeight.substring(maxHeight.length - 2) === 'px') {
            maxHeight = maxHeight.substring(0, maxHeight.length - 2);
          }
          if (Number(maxHeight) <= 768) {
            realHeight = maxHeight;
            guessed = true;
          }
        }
        if (!guessed) {
          realWidth = '1024';
        }
      }
      return {
        width: width,
        height: height,
        realHeight: realHeight,
        realWidth: realWidth
      };
    }
  }, {
    key: 'newDimension',
    value: function newDimension(dimension, real) {
      if (real && real.substring(real.length - 2) === 'px') {
        real = real.substring(0, real.length - 2);
      }
      if (dimension && dimension.substring(dimension.length - 1) === '%') {
        // percent
        return {
          value: Number(dimension.substring(0, dimension.length - 1)),
          type: '%',
          real: Number(real ? real : 0)
        };
      } else if (dimension && dimension.substring(dimension.length - 2) === 'px') {
        // px
        return {
          value: Number(dimension.substring(0, dimension.length - 2)),
          type: 'px',
          real: Number(real ? real : dimension.substring(0, dimension.length - 2))
        };
      } else {
        // assumed px
        return {
          value: dimension ? Number(dimension) : undefined,
          type: 'px',
          real: Number(real ? real : dimension ? dimension : 0)
        };
      }
    }
  }]);

  return Thumbor;
})(_react.Component);

exports['default'] = Thumbor;
module.exports = exports['default'];