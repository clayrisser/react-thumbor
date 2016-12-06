import React, {Component} from 'react';
import _ from 'lodash';
import randomSeed from 'random-seed';
var rand = randomSeed.create();

export default class Thumbor extends Component {
	constructor(props) {
		super(props);
    this.state = {
      imageLoaded: false
    };
	}

  componentWillMount() {
    if (process.env.BROWSER) var global = window;
    if (global.reactThumbor && global.reactThumbor.server) {
      this.server = global.reactThumbor.server;
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
    this.loadedImage = (<img id={this.loadedImageId} key="loadedImage" src={this.image} onLoad={this.imageLoaded.bind(this)} onError={this.imageError.bind(this)} hidden={true} />);
  }

	render() {
    var rendered = [this.loadedImage];
    if (this.state.imageLoaded) {
      this.updateDimensions();
      console.log(this.height);
      console.log(this.width);
      rendered.push(this.renderImage());
    }
		return (<div>
      {rendered}
		</div>);
	}

  renderImage() {
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
      if (preset) attrs.style = _.extend(attrs.style, preset);
      if (this.height.value) attrs.style = _.extend(attrs.style, {height: this.height.value + this.height.type});
      if (this.width.value) attrs.style = _.extend(attrs.style, {width: this.width.value + this.width.type});
      if (this.props.backgroundPosition) attrs.style = _.extend(attrs.style, {backgroundPosition: this.props.backgroundPosition});
      if (this.props.backgroundRepeat) attrs.style = _.extend(attrs.style, {backgroundRepeat: this.props.backgroundRepeat});
      if (this.props.backgroundColor) attrs.style = _.extend(attrs.style, {backgroundColor: this.props.backgroundColor});
      if (this.props.maxHeight) attrs.style = _.extend(attrs.style, {maxHeight: this.props.maxHeight});
      if (this.props.maxWidth) attrs.style = _.extend(attrs.style, {maxWidth: this.props.maxWidth});
      if (this.props.backgroundSize) attrs.style = _.extend(attrs.style, {backgroundSize: this.props.backgroundSize});
      attrs.style = _.extend(attrs.style, {
        backgroundImage: 'url("' + this.image + '")'
      });
      return (<div key="div" {...attrs}>{this.props.children}</div>);
    } else {
      if (this.height.value) attrs.height = this.height.value + this.height.type;
      if (this.width.value) attrs.width = this.width.value + this.width.type;
      return (<img key="img" src={this.image} {...attrs} />);
    }
  }

  imageLoaded() {
    this.setState({imageLoaded: true});
  }

  imageError(err) {
    console.error(err);
  }

  updateDimensions() {
    var loadedImage = document.getElementById(this.loadedImageId);
    if (!this.props.height && !this.props.width) {
      this.width.value = loadedImage.naturalWidth;
      this.height.value = loadedImage.naturalHeight;
    }
  }

  newDimension(dimension, realOverride, realFallback) {
    if (dimension && dimension.substring(dimension.length - 1) === '%') { // percent
      return {
        value: Number(dimension.substring(0, dimension.length - 1)),
        type: '%',
        real: Number(realOverride ? realOverride : (realFallback ? realFallback : 1024))
      };
    } else if (dimension && dimension.substring(dimension.length - 2) === 'px') { // px
      return {
        value: Number(dimension.substring(0, dimension.length - 2)),
        type: 'px',
        real: Number(realOverride ? realOverride : dimension.substring(0, dimension.length - 2))
      };
    } else { // assumed px
      return {
        value: dimension ? Number(dimension) : undefined,
        type: 'px',
        real: Number(realOverride ? realOverride : (dimension ? dimension : 0))
      };
    }
  }

  getRandomId() {
    var random = rand(32);
    if (document.getElementById(random)) {
      random = getRandomId();
    }
    return random;
  }
}
