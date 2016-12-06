import React, {Component} from 'react';
import _ from 'lodash';
import randomstring from 'randomstring';

export default class Thumbor extends Component {
	constructor(props) {
		super(props);
    this.state = {
      mounted: false,
      imageLoaded: false,
      imageRendered: false
    };
	}

  componentWillMount() {
    if (this.props.server) {
      this.server = this.props.server;
    } else {
      this.server = '';
    }
    var dimensions = this.smartlyGuessDimensions();
    this.height = this.newDimension(dimensions.height, dimensions.realHeight);
    this.width = this.newDimension(dimensions.width, dimensions.realWidth);
    this.type = this.getType();
    this.image = this.server + '/unsafe/' + this.width.real + 'x' + this.height.real + '/' + this.props.src;
  }

  componentDidMount() {
    this.loadedImageId = this.getRandomId();
    this.id = this.getRandomId();
    this.imageId = this.getRandomId();
    this.previewContentId = this.getRandomId();
    this.finalContentId = this.getRandomId();
    this.loadedImage = (<img id={this.loadedImageId} key="loadedImage" src={this.image} onLoad={this.imageLoaded.bind(this)} onError={this.imageError.bind(this)} hidden={true} />);
    this.setState({mounted: true});
  }

  componentDidUpdate() {
    if (this.state.imageLoaded && this.imageRendered) {
      var image = document.getElementById(this.imageId);
      setTimeout(() => {
        image.style.opacity = 1;
      }, 100);
      if (this.props.onRender) {
        this.props.onRender({
          id: this.id
        });
      }
      this.resized();
      window.addEventListener('resize', () => {
        this.resized();
      });
    }
  }

	render() {
    var placeholder = this.getPlaceholder();
    var rendered = [placeholder];
    if (this.state.mounted && !this.state.imageLoaded) {
      rendered.push(this.loadedImage);
    }
    if (this.state.imageLoaded && !this.imageRendered) {
      this.updateDimensions();
      rendered[0] = this.renderImage();
      if (this.props.debug) {
        console.log(this.width);
        console.log(this.height);
      }
    }
		return (<div id={this.id}>
      {rendered}
		</div>);
	}

  resized() {
    if (this.type === 'background') {
      var image = document.getElementById(this.imageId);
      var content = false;
      if (this.imageRendered) {
        content = document.getElementById(this.finalContentId);
      } else {
        content = document.getElementById(this.previewContentId);
      }
      content.style.width = (image.offsetWidth - this.pixelToNumber(content.style.paddingLeft) - this.pixelToNumber(content.style.paddingRight)) + 'px';
      content.style.height = (image.offsetHeight - this.pixelToNumber(content.style.paddingTop) - this.pixelToNumber(content.style.paddingBottom)) + 'px';
    }
  }

  renderImage() {
    var attrs = {};
    var preset = this.getPreset();
    attrs.style = _.extend(attrs.style, {
      transition: 'opacity 4s cubic-bezier(.5, 0, 0, 1)',
      opacity: 0
    });
    if (this.type === 'background') {
      attrs.style = _.extend(attrs.style, {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        backgroundPosition: 'center',
        backgroundImage: 'url("' + this.image + '")',
        width: '100%'
      });
      if (this.width.value) attrs.style = _.extend(attrs.style, {width: this.width.value + this.width.type});
      if (this.height.value) attrs.style = _.extend(attrs.style, {height: this.height.value + this.height.type});
      if (preset) attrs.style = _.extend(attrs.style, preset);
      if (this.props.width) attrs.style = _.extend(attrs.style, {width: this.props.width});
      if (this.props.height) attrs.style = _.extend(attrs.style, {height: this.props.height});
      if (this.props.backgroundPosition) attrs.style = _.extend(attrs.style, {backgroundPosition: this.props.backgroundPosition});
      if (this.props.backgroundRepeat) attrs.style = _.extend(attrs.style, {backgroundRepeat: this.props.backgroundRepeat});
      if (this.props.backgroundColor) attrs.style = _.extend(attrs.style, {backgroundColor: this.props.backgroundColor});
      if (this.props.backgroundSize) attrs.style = _.extend(attrs.style, {backgroundSize: this.props.backgroundSize});
    } else {
      attrs.style = _.extend(attrs.style, {
        maxWidth: '100%'
      });
      if (this.height.value) attrs.height = this.height.value + this.height.type;
      if (this.width.value) attrs.width = this.width.value + this.width.type;
      if (preset) attrs.style = _.extend(attrs.style, preset);
      if (this.props.width) attrs.style = _.extend(attrs.style, {width: this.props.width});
      if (this.props.height) attrs.style = _.extend(attrs.style, {height: this.props.height});
    }
    if (this.props.maxWidth) attrs.style = _.extend(attrs.style, {maxWidth: this.props.maxWidth});
    if (this.props.maxHeight) attrs.style = _.extend(attrs.style, {maxHeight: this.props.maxHeight});
    this.imageRendered = true;
    if (this.type === 'background') {
      return (<div key="div">
        <div id={this.finalContentId} style={this.getContentStyle()}>{this.props.children}</div>
        <div id={this.imageId} {...attrs}></div>
      </div>);
    } else {
      return (<img key="img" id={this.imageId} src={this.image} {...attrs} />);
    }
  }

  pixelToNumber(pixel) {
    return Number(pixel.substring(0, pixel.length - 2));
  }

  getPlaceholder() {
    var style = {
      backgroundColor: 'rgba(255, 255, 255, 0)',
    };
    var preset = this.getPreset();
    if (this.height.value) style.height = this.height.value + this.height.type;
    if (this.width.value) style.width = this.width.value + this.width.type;
    if (preset.height) style.height = preset.height;
    if (preset.maxHeight) style.maxHeight = preset.maxHeight;
    if (preset.width) style.width = preset.width;
    if (preset.maxWidth) style.maxWidth = preset.maxWidth;
    if (this.props.height) style.height = this.props.height;
    if (this.props.maxHeight) style.maxHeight = this.props.maxHeight;
    if (this.props.width) style.width = this.props.width;
    if (this.props.maxWidth) style.maxWidth = this.props.maxWidth;
    if (this.props.backgroundColor) style.backgroundColor = this.props.backgroundColor;
    return (<div key="placeholder" style={style}>
      <div id={this.previewContentId} style={this.getContentStyle()}>{this.props.children}</div>
    </div>);
  }

  getContentStyle() {
    var style = {
      backgroundColor: 'rgba(255, 255, 255, 0)',
      zIndex: 1,
      position: 'absolute',
      padding: '10px 20px'
    };
    if (this.props.contentStyle) style = _.extend(style, this.props.contentStyle);
    return style;
  }

  getPreset() {
    switch (this.props.preset) {
      case 'responsive':
        return {
          width: '100%',
          backgroundPosition: 'top center',
          backgroundSize: 'cover',
          maxHeight: '600px',
          minHeight: '400px',
          height: 'calc(15vw + 300px)'
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
    if (this.type === 'background') {
      if (!this.props.height && !this.props.width) {
        this.width.value = loadedImage.naturalWidth;
        this.height.value = loadedImage.naturalHeight;
      } else {
        if (!this.props.height) {
          this.height.value = loadedImage.naturalHeight;
        } else if (!this.props.width) {
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
    if ((!width || width.substring(width.length - 1) === '%' ||
         width.substring(width.length - 1) === 'vh' ||
         width.substring(width.length - 1) === 'vw') &&
        (!height || height.substring(height.length - 1) === '%' ||
         height.substring(height.length - 1) === 'vh'||
         height.substring(height.length - 1) === 'vw') && !realWidth && !realHeight) {
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
    } else if (dimension && dimension.substring(dimension.length - 2) === 'vh') { // vh
      return {
        value: Number(dimension.substring(0, dimension.length - 1)),
        type: 'vh',
        real: Number(real ? real : 0)
      };
    } else if (dimension && dimension.substring(dimension.length - 2) === 'vw') { // vw
      return {
        value: Number(dimension.substring(0, dimension.length - 1)),
        type: 'vw',
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

  getRandomId() {
    var id = randomstring.generate(16);
    if (document.getElementById(id)) {
      id = getRandomId();
    }
    return id;
  }
}
