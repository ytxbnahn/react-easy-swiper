function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from "react";
import PropTypes from "prop-types"; // import ReactDOM from "react-dom";

import "./style.css";

var Swiper =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(Swiper, _Component);

  function Swiper() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Component.call.apply(_Component, [this].concat(args)) || this;

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
      transform: 0,
      criticalValue: 50,
      currentIndex: 0,
      oldTransform: 0,
      autoplayTimeout: 5
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "internals", {
      isScrolling: false,
      autoplayDirection: true
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleTouchStart", function (e) {
      console.log(_assertThisInitialized(_assertThisInitialized(_this)));
      _this.internals.isScrolling = true;
      _this.autoplayTimer && clearTimeout(_this.autoplayTimer);
      var touchPosition = _this.props.horizontal ? e.targetTouches[0].pageX : e.targetTouches[0].pageY;
      _this.internals.startPosition = _this.state.transform - touchPosition;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleTouchMove", function (e) {
      if (!_this.internals.isScrolling) return;
      var touchMove = _this.props.horizontal ? e.targetTouches[0].pageX : e.targetTouches[0].pageY;
      var diffStage = _this.internals.startPosition + touchMove;

      _this.setState({
        transform: diffStage
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleTouchEnd", function (e) {
      var _this$internals = _this.internals,
          isScrolling = _this$internals.isScrolling,
          $container = _this$internals.$container; //   const { oldTransform, transform} = this.state

      if (!isScrolling) return;

      if (_this.state.autoplay) {
        _this.autoplay();
      }

      _this.internals.isScrolling = false;
      var _this$state = _this.state,
          transform = _this$state.transform,
          oldTransform = _this$state.oldTransform,
          criticalValue = _this$state.criticalValue,
          currentIndex = _this$state.currentIndex;

      if (transform > 0) {
        _this.updateIndex({
          transform: 0,
          currentIndex: 0
        });

        return;
      }

      var maxLength = _this.props.horizontal ? -$container.offsetWidth * 2 : -$container.offsetHeight * 2;

      if (transform < maxLength) {
        _this.updateIndex({
          transform: maxLength,
          currentIndex: 2
        });

        return;
      }

      var diff = Math.abs(oldTransform - transform);

      if (diff > criticalValue) {
        var distance = _this.props.horizontal ? -$container.offsetWidth : -$container.offsetHeight;
        console.log(distance);

        if (oldTransform > transform) {
          var currentIndexs = currentIndex + 1;

          _this.updateIndex({
            transform: distance * currentIndexs,
            currentIndex: currentIndexs
          });
        } else {
          var _currentIndexs = currentIndex - 1;

          _this.updateIndex({
            transform: distance * _currentIndexs,
            currentIndex: _currentIndexs
          });
        }
      } else {
        _this.updateIndex({
          transform: oldTransform
        });
      }
    });

    return _this;
  }

  var _proto = Swiper.prototype;

  _proto.componentWillReceiveProps = function componentWillReceiveProps(newProps) {};

  _proto.componentDidMount = function componentDidMount() {
    var _this$props = this.props,
        horizontal = _this$props.horizontal,
        children = _this$props.children;
    this.internals.$container = this.refs.container;
    this.autoplay();
    this.setState({
      scrollWidth: this.refs.container.offsetWidth * (horizontal ? children.length : 1),
      scrollHeight: this.refs.container.offsetHeight * (horizontal ? 1 : children.length)
    });
  };

  _proto.updateIndex = function updateIndex(params) {
    console.log("--------" + JSON.stringify(params));
    this.setState({
      transform: params.transform,
      oldTransform: params.transform,
      currentIndex: params.currentIndex
    });
  };

  _proto.autoplay = function autoplay() {
    var _this2 = this;

    if (!Array.isArray(this.props.children) || !this.props.autoplay) return;
    console.log("autoplay");
    var currentIndex = this.state.currentIndex;
    var _this$internals2 = this.internals,
        $container = _this$internals2.$container,
        autoplayDirection = _this$internals2.autoplayDirection;
    var _this$props2 = this.props,
        horizontal = _this$props2.horizontal,
        children = _this$props2.children;
    this.autoplayTimer && clearTimeout(this.autoplayTimer);
    this.autoplayTimer = setTimeout(function () {
      var transform;
      var tempCurrentIndex; //   if (
      //     !this.props.loop &&
      //     (this.props.autoplayDirection
      //       ? this.state.index === this.state.total - 1
      //       : this.state.index === 0)
      //   )
      //     return this.setState({ autoplayEnd: true });

      if (autoplayDirection) {
        tempCurrentIndex = currentIndex + 1;
      } else {
        console.log(autoplayDirection);
        tempCurrentIndex = currentIndex - 1;
      }

      transform = horizontal ? -tempCurrentIndex * $container.offsetWidth : -tempCurrentIndex * $container.offsetHeight;

      if (tempCurrentIndex === children.length - 1) {
        _this2.internals.autoplayDirection = false;
      }

      if (tempCurrentIndex === 0) {
        _this2.internals.autoplayDirection = true;
      }

      _this2.updateIndex({
        transform: transform,
        currentIndex: tempCurrentIndex
      });

      _this2.autoplay();
    }, this.props.autoplayTimeout * 1000);
  };

  _proto.render = function render() {
    var _this$state2 = this.state,
        transform = _this$state2.transform,
        scrollHeight = _this$state2.scrollHeight,
        scrollWidth = _this$state2.scrollWidth;
    var _this$props3 = this.props,
        children = _this$props3.children,
        horizontal = _this$props3.horizontal;
    var $container = this.internals.$container;
    var transformx = horizontal ? transform : 0;
    var transformy = horizontal ? 0 : transform;
    console.log(transformx, transformy);
    return React.createElement("div", {
      ref: "container",
      className: "react-easy-swiper",
      onTouchStart: this.handleTouchStart,
      onTouchMove: this.handleTouchMove,
      onTouchEnd: this.handleTouchEnd
    }, React.createElement("div", {
      className: "react-easy-swiper-wrapper",
      style: {
        transform: "translate(" + transformx + "px," + transformy + "px)",
        width: scrollWidth,
        height: scrollHeight
      }
    }, children.map(function (child, i) {
      return React.cloneElement(child, {
        className: child.className,
        key: i,
        style: _extends({}, child.props.style, {
          display: horizontal ? "inline-block" : "block",
          verticalAlign: horizontal ? "top" : "bottom",
          width: $container && $container.offsetWidth,
          height: $container && $container.offsetHeight
        })
      });
    })));
  };

  return Swiper;
}(Component);

_defineProperty(Swiper, "propTypes", {
  horizontal: PropTypes.bool // containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number])

});

_defineProperty(Swiper, "defaultProps", {
  horizontal: false,
  autoplay: false,
  autoplayTimeout: 3,
  index: 0,
  onChange: function onChange() {
    return null;
  }
});

export default Swiper;