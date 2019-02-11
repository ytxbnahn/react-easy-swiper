import React, { Component } from "react";
import PropTypes from "prop-types";
// import ReactDOM from "react-dom";

import "./style.css";
class Swiper extends Component {
  static propTypes = {
    horizontal: PropTypes.bool
    // containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number])
  };
  static defaultProps = {
    horizontal: false,
    autoplay: false,
    autoplayTimeout: 3,
    index: 0,
    onChange: () => null
  };
  state = {
    transform: 0,
    criticalValue: 50,
    currentIndex: 0,
    oldTransform: 0,
    autoplayTimeout: 5
  };
  internals = {
    isScrolling: false,
    autoplayDirection: true
  };
  componentWillReceiveProps(newProps) { }
  componentDidMount() {
    const { horizontal, children } = this.props;
    this.internals.$container = this.refs.container;
    this.autoplay();

    this.setState({
      scrollWidth:
        this.refs.container.offsetWidth * (horizontal ? children.length : 1),
      scrollHeight:
        this.refs.container.offsetHeight * (horizontal ? 1 : children.length)
    });
  }
  handleTouchStart = e => {
    console.log(this);
    this.internals.isScrolling = true;
    this.autoplayTimer && clearTimeout(this.autoplayTimer);
    const touchPosition = this.props.horizontal
      ? e.targetTouches[0].pageX
      : e.targetTouches[0].pageY;
    this.internals.startPosition = this.state.transform - touchPosition;
  };
  handleTouchMove = e => {
    if (!this.internals.isScrolling) return;
    const touchMove = this.props.horizontal
      ? e.targetTouches[0].pageX
      : e.targetTouches[0].pageY;
    let diffStage = this.internals.startPosition + touchMove;

    this.setState({
      transform: diffStage
    });
  };
  handleTouchEnd = e => {
    const { isScrolling, $container } = this.internals;
    //   const { oldTransform, transform} = this.state
    if (!isScrolling) return;
    if (this.state.autoplay) {
      this.autoplay();
    }
    this.internals.isScrolling = false;
    const { transform, oldTransform, criticalValue, currentIndex } = this.state;
    if (transform > 0) {
      this.updateIndex({ transform: 0, currentIndex: 0 });
      return;
    }
    const maxLength = this.props.horizontal
      ? -$container.offsetWidth * 2
      : -$container.offsetHeight * 2;
    if (transform < maxLength) {
      this.updateIndex({
        transform: maxLength,
        currentIndex: 2
      });
      return;
    }
    let diff = Math.abs(oldTransform - transform);
    if (diff > criticalValue) {
      const distance = this.props.horizontal
        ? -$container.offsetWidth
        : -$container.offsetHeight;
      console.log(distance)
      if (oldTransform > transform) {
        let currentIndexs = currentIndex + 1;
        this.updateIndex({
          transform: distance * currentIndexs,
          currentIndex: currentIndexs
        });
      } else {
        let currentIndexs = currentIndex - 1;

        this.updateIndex({
          transform: distance * currentIndexs,
          currentIndex: currentIndexs
        });
      }
    } else {
      this.updateIndex({ transform: oldTransform });
    }
  };
  updateIndex(params) {
    console.log("--------" + JSON.stringify(params));
    this.setState({
      transform: params.transform,
      oldTransform: params.transform,
      currentIndex: params.currentIndex
    });
  }
  autoplay() {
    if (!Array.isArray(this.props.children) || !this.props.autoplay) return;
    console.log("autoplay");
    const { currentIndex } = this.state;
    const { $container, autoplayDirection } = this.internals;
    const { horizontal, children } = this.props;
    this.autoplayTimer && clearTimeout(this.autoplayTimer);
    this.autoplayTimer = setTimeout(() => {
      let transform;
      let tempCurrentIndex;
      //   if (
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
      transform = horizontal
        ? -tempCurrentIndex * $container.offsetWidth
        : -tempCurrentIndex * $container.offsetHeight;
      if (tempCurrentIndex === children.length - 1) {
        this.internals.autoplayDirection = false;
      }
      if (tempCurrentIndex === 0) {
        this.internals.autoplayDirection = true;
      }
      this.updateIndex({ transform, currentIndex: tempCurrentIndex });
      this.autoplay();
    }, this.props.autoplayTimeout * 1000);
  }
  render() {
    const { transform, scrollHeight, scrollWidth } = this.state;
    const { children, horizontal } = this.props;
    const { $container } = this.internals;
    const transformx = horizontal ? transform : 0;
    const transformy = horizontal ? 0 : transform;
    console.log(transformx, transformy);
    return (
      <div
        ref="container"
        className="react-easy-swiper"
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onTouchEnd={this.handleTouchEnd}
      >
        <div
          className="react-easy-swiper-wrapper"
          style={{
            transform: `translate(${transformx}px,${transformy}px)`,
            width: scrollWidth,
            height: scrollHeight
          }}
        >
          {children.map((child, i) => {
            return React.cloneElement(child, {
              className: child.className,
              key: i,
              style: {
                ...child.props.style,
                ...{
                  display: horizontal ? "inline-block" : "block",
                  verticalAlign: horizontal ? "top" : "bottom",
                  width: $container && $container.offsetWidth,
                  height: $container && $container.offsetHeight
                }
              }
            });
          })}
        </div>
      </div>
    );
  }
}
export default Swiper;
