import defaults from "lodash/object/defaults";
import property from "lodash/utility/property";

module.exports = {
  getPadding(props) {
    const padding = typeof props.padding === "number" ? props.padding : 0;
    const paddingObj = typeof props.padding === "object" ? props.padding : {};
    return {
      top: paddingObj.top || padding,
      bottom: paddingObj.bottom || padding,
      left: paddingObj.left || padding,
      right: paddingObj.right || padding
    };
  },

  getStyles(props, defaultStyles) {
    const style = props.style || defaultStyles;
    const {data, labels, parent} = style;
    return {
      parent: defaults({height: props.height, width: props.width}, defaultStyles.parent, parent),
      labels: defaults({}, labels, defaultStyles.labels),
      data: defaults({}, data, defaultStyles.data)
    };
  },

  evaluateProp(prop, data) {
    return typeof prop === "function" ? prop(data) : prop;
  },

  evaluateStyle(style, data) {
    if (!Object.keys(style).some((value) => typeof style[value] === "function")) {
      return style;
    }
    return Object.keys(style).reduce((prev, curr) => {
      prev[curr] = this.evaluateProp(style[curr], data);
      return prev;
    }, {});
  },

  getRange(props, axis) {
    // determine how to lay the axis and what direction positive and negative are
    const {horizontal} = props;
    const isVertical = (horizontal && axis === "x") || (!horizontal && axis !== "x");
    const isDependent = (horizontal && !isVertical) || (!horizontal && isVertical);
    const padding = this.getPadding(props);
    if (isVertical) {
      const bottomToTop = [props.height - padding.bottom, padding.top];
      return isDependent ? bottomToTop : bottomToTop.reverse();
    }
    return [padding.left, props.width - padding.right];
  },

  // for components that take single datasets
  getData(props) {
    if (props.data) {
      return this.formatData(props.data, props);
    }
  },

  formatData(dataset, props, stringMap) {
    if (!dataset) {
      return [];
    }
    stringMap = stringMap || {
      x: this.createStringMap(props, "x"),
      y: this.createStringMap(props, "y")
    };
    const accessor = {
      x: this.createAccessor(props.x),
      y: this.createAccessor(props.y)
    };

    return dataset.map((datum) => {
      const x = accessor.x(datum);
      const y = accessor.y(datum);
      const xName = typeof x === "string" ? {xName: x} : undefined;
      const yName = typeof y === "string" ? {yName: y} : undefined;
      return defaults({
        // map string data to numeric values, and add names
        x: typeof x === "string" ? stringMap.x[x] : x,
        y: typeof y === "string" ? stringMap.y[y] : y
      }, xName, yName, datum);
    });
  },

  createStringMap(props, axis) {
    const stringsFromData = this.getStringsFromData(props, axis);
    return stringsFromData.length === 0 ? null :
      stringsFromData.reduce((prev, curr, index) => {
        prev[curr] = index + 1;
        return prev;
      }, {});
  },

  getStringsFromData(props, axis) {
    if (!props.data) {
      return [];
    }
    const key = typeof props[axis] === "undefined" ? axis : props[axis];
    const accessor = this.createAccessor(key);
    const dataStrings = (props.data)
        .map((datum) => accessor(datum))
        .filter((datum) => typeof datum === "string");
    // return a unique set of strings
    return dataStrings.reduce((prev, curr) => {
      if (typeof curr !== "undefined" && curr !== null && prev.indexOf(curr) === -1) {
        prev.push(curr);
      }
      return prev;
    }, []);
  },

  createAccessor(key) {
    // creates a data accessor function
    // given a property key, path, array index, or null for identity.
    if (typeof key === "function") {
      return key;
    } else if (key === null || typeof key === "undefined") {
      // null/undefined means "return the data item itself"
      return (x) => x;
    }
    // otherwise, assume it is an array index, property key or path (_.property handles all three)
    return property(key);
  }
};
