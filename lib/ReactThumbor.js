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

var _randomSeed = require('random-seed');

var _randomSeed2 = _interopRequireDefault(_randomSeed);

var rand = _randomSeed2['default'].create();

var Thumbor = (function (_Component) {
  _inherits(Thumbor, _Component);

  function Thumbor(props) {
    _classCallCheck(this, Thumbor);

    _get(Object.getPrototypeOf(Thumbor.prototype), 'constructor', this).call(this, props);
    this.state = {
      imageLoaded: false
    };
  }

  _createClass(Thumbor, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      if (window.reactThumbor && window.reactThumbor.server) {
        this.server = window.reactThumbor.server;
      }
      if (this.props.server) {
        this.server = this.props.server;
      }
      this.height = this.newDimension(this.props.height, this.props.realHeight, 768);
      this.width = this.newDimension(this.props.width, this.props.realWidth, 1024);
      if (this.width.value && this.height.value) {
        if (this.width.type === '%' && this.height.type === 'px') {
          this.width.real = 0;
        } else if (this.height.type === '%' && this.width.type === 'px') {
          this.height.real = 0;
        }
      }
      this.image = this.server + '/unsafe/' + this.width.real + 'x' + this.height.real + '/' + this.props.src;
      this.loadedImageId = this.getRandomId();
      this.loadedImage = _react2['default'].createElement('img', { id: this.loadedImageId, key: 'loadedImage', src: this.image, onLoad: this.imageLoaded.bind(this), onError: this.imageError.bind(this), hidden: true });
    }
  }, {
    key: 'render',
    value: function render() {
      var rendered = [this.loadedImage];
      if (this.state.imageLoaded) {
        this.updateDimensions();
        console.log(this.height);
        console.log(this.width);
        rendered.push(this.renderImage());
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
      var preset = false;
      var type = 'image';
      switch (this.props.preset) {
        case 'responsive':
          preset = {
            width: '100%',
            backgroundPosition: 'top center',
            backgroundSize: 'cover',
            maxHeight: '360px'
          };
          type = 'background';
          break;
      }
      if (this.props.type) type = this.props.type;
      if (type === 'background') {
        if (preset) attrs.style = _lodash2['default'].extend(attrs.style, preset);
        if (this.height.value) attrs.style = _lodash2['default'].extend(attrs.style, { height: this.height.value + this.height.type });
        if (this.width.value) attrs.style = _lodash2['default'].extend(attrs.style, { width: this.width.value + this.width.type });
        if (this.props.backgroundPosition) attrs.style = _lodash2['default'].extend(attrs.style, { backgroundPosition: this.props.backgroundPosition });
        if (this.props.backgroundRepeat) attrs.style = _lodash2['default'].extend(attrs.style, { backgroundRepeat: this.props.backgroundRepeat });
        if (this.props.backgroundColor) attrs.style = _lodash2['default'].extend(attrs.style, { backgroundColor: this.props.backgroundColor });
        if (this.props.maxHeight) attrs.style = _lodash2['default'].extend(attrs.style, { maxHeight: this.props.maxHeight });
        if (this.props.maxWidth) attrs.style = _lodash2['default'].extend(attrs.style, { maxWidth: this.props.maxWidth });
        if (this.props.backgroundSize) attrs.style = _lodash2['default'].extend(attrs.style, { backgroundSize: this.props.backgroundSize });
        attrs.style = _lodash2['default'].extend(attrs.style, {
          backgroundImage: 'url("' + this.image + '")'
        });
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
      if (!this.props.height && !this.props.width) {
        this.width.value = loadedImage.naturalWidth;
        this.height.value = loadedImage.naturalHeight;
      }
    }
  }, {
    key: 'newDimension',
    value: function newDimension(dimension, realOverride, realFallback) {
      if (dimension && dimension.substring(dimension.length - 1) === '%') {
        // percent
        return {
          value: Number(dimension.substring(0, dimension.length - 1)),
          type: '%',
          real: Number(realOverride ? realOverride : realFallback ? realFallback : 1024)
        };
      } else if (dimension && dimension.substring(dimension.length - 2) === 'px') {
        // px
        return {
          value: Number(dimension.substring(0, dimension.length - 2)),
          type: 'px',
          real: Number(realOverride ? realOverride : dimension.substring(0, dimension.length - 2))
        };
      } else {
        // assumed px
        return {
          value: dimension ? Number(dimension) : undefined,
          type: 'px',
          real: Number(realOverride ? realOverride : dimension ? dimension : 0)
        };
      }
    }
  }, {
    key: 'getRandomId',
    value: (function (_getRandomId) {
      function getRandomId() {
        return _getRandomId.apply(this, arguments);
      }

      getRandomId.toString = function () {
        return _getRandomId.toString();
      };

      return getRandomId;
    })(function () {
      var random = rand(32);
      if (document.getElementById(random)) {
        random = getRandomId();
      }
      return random;
    })
  }]);

  return Thumbor;
})(_react.Component);

exports['default'] = Thumbor;
module.exports = exports['default'];