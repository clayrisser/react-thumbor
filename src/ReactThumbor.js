import React, {Component} from 'react';
import _ from 'lodash';
import Chance from 'chance';

export default class Thumbor extends Component {
	constructor(props) {
		super(props);
    this.state = {
      imageLoaded: false,
      imageRendered: false
    };
	}

  componentWillMount() {
    this.chance = new Chance();
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
    this.loadedImage = (<img id={this.loadedImageId} key="loadedImage" src={this.image} onLoad={this.imageLoaded.bind(this)} onError={this.imageError.bind(this)} hidden={true} />);
  }

	render() {
    var rendered = [this.loadedImage];
    if (this.state.imageLoaded && !this.state.imageRendered) {
      this.updateDimensions();
      rendered.push(this.renderImage());
      console.log(this.width);
      console.log(this.height);
    }
		return (<div>
      {rendered}
		</div>);
	}

  renderImage() {
    var attrs = {};
    var preset = this.getPreset();
    var type = this.getType();
    attrs.style = _.extend(attrs.style, {
      backgroundImage: 'url("' + this.image + '")',
      maxWidth: '100%'
    });
    if (type === 'background') {
      attrs.style = _.extend(attrs.style, {
        backgroundPosition: 'center'
      });
      if (preset) attrs.style = _.extend(attrs.style, preset);
      if (this.height.value) attrs.style = _.extend(attrs.style, {height: this.height.value + this.height.type});
      if (this.width.value) attrs.style = _.extend(attrs.style, {width: this.width.value + this.width.type});
      if (this.props.backgroundPosition) attrs.style = _.extend(attrs.style, {backgroundPosition: this.props.backgroundPosition});
      if (this.props.backgroundRepeat) attrs.style = _.extend(attrs.style, {backgroundRepeat: this.props.backgroundRepeat});
      if (this.props.backgroundColor) attrs.style = _.extend(attrs.style, {backgroundColor: this.props.backgroundColor});
      if (this.props.backgroundSize) attrs.style = _.extend(attrs.style, {backgroundSize: this.props.backgroundSize});

      return (<div key="div" {...attrs}>{this.props.children}</div>);
    } else {
      if (this.height.value) attrs.height = this.height.value + this.height.type;
      if (this.width.value) attrs.width = this.width.value + this.width.type;
      return (<img key="img" src={this.image} {...attrs} />);
    }
    if (this.props.maxWidth) attrs.style = _.extend(attrs.style, {maxWidth: this.props.maxWidth});
    if (this.props.maxHeight) attrs.style = _.extend(attrs.style, {maxHeight: this.props.maxHeight});
    this.setState({imageRendered: true});
  }

  getPreset() {
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

  getType() {
    if (this.props.type) return this.props.type;
    switch (this.props.preset) {
      case 'responsive':
        return 'background';
      default:
        return 'image';
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

  smartlyGuessDimensions() {
    var width = this.props.width;
    var height = this.props.height;
    var realHeight = this.props.realHeight;
    var realWidth = this.props.realWidth;
    var maxHeight = this.props.maxHeight;
    var maxWidth = this.props.maxWidth;
    if ((!width || width.substring(width.length - 1) === '%') &&    // if i have to be smart
        (!height || height.substring(height.length - 1) === '%')) { // about guessing dimensions
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
      width,
      height,
      realHeight,
      realWidth,
    };
  }

  newDimension(dimension, real) {
    if (real && real.substring(real.length - 2) === 'px') {
      real = real.substring(0, real.length - 2);
    }
    if (dimension && dimension.substring(dimension.length - 1) === '%') { // percent
      return {
        value: Number(dimension.substring(0, dimension.length - 1)),
        type: '%',
        real: Number(real ? real : 0)
      };
    } else if (dimension && dimension.substring(dimension.length - 2) === 'px') { // px
      return {
        value: Number(dimension.substring(0, dimension.length - 2)),
        type: 'px',
        real: Number(real ? real : dimension.substring(0, dimension.length - 2))
      };
    } else { // assumed px
      return {
        value: dimension ? Number(dimension) : undefined,
        type: 'px',
        real: Number(real ? real : (dimension ? dimension : 0))
      };
    }
  }
}
