"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConditionalRender = ConditionalRender;
exports.Counter = void 0;
exports.EventHandlers = EventHandlers;
exports.List = List;
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } // React 组件示例
// 演示 JSX 语法和 React 特性
// 函数组件
function Greeting(_ref) {
  let {
    name = 'Guest'
  } = _ref;
  const [count, setCount] = (0, _react.useState)(0);
  (0, _react.useEffect)(() => {
    console.log("Component mounted, count is ".concat(count));
  }, [count]);
  const handleClick = () => {
    setCount(count + 1);
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "greeting"
  }, /*#__PURE__*/_react.default.createElement("h1", null, "Hello, ", name, "!"), /*#__PURE__*/_react.default.createElement("p", null, "Count: ", count), /*#__PURE__*/_react.default.createElement("button", {
    onClick: handleClick
  }, "Increment"));
}

// 类组件
class Counter extends _react.default.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "handleIncrement", () => {
      this.setState({
        count: this.state.count + 1
      });
    });
    this.state = {
      count: 0
    };
  }
  render() {
    return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("h2", null, "Counter: ", this.state.count), /*#__PURE__*/_react.default.createElement("button", {
      onClick: this.handleIncrement
    }, "+"));
  }
}

// 使用 Fragment
exports.Counter = Counter;
function List(_ref2) {
  let {
    items
  } = _ref2;
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("h3", null, "Items List"), /*#__PURE__*/_react.default.createElement("ul", null, items === null || items === void 0 ? void 0 : items.map((item, index) => /*#__PURE__*/_react.default.createElement("li", {
    key: index
  }, item))));
}

// 条件渲染
function ConditionalRender(_ref3) {
  let {
    isLoggedIn
  } = _ref3;
  return /*#__PURE__*/_react.default.createElement("div", null, isLoggedIn ? /*#__PURE__*/_react.default.createElement("p", null, "Welcome back!") : /*#__PURE__*/_react.default.createElement("p", null, "Please log in."));
}

// 事件处理
function EventHandlers() {
  const handleSubmit = e => {
    e.preventDefault();
    console.log('Form submitted');
  };
  return /*#__PURE__*/_react.default.createElement("form", {
    onSubmit: handleSubmit
  }, /*#__PURE__*/_react.default.createElement("input", {
    type: "text",
    placeholder: "Enter name"
  }), /*#__PURE__*/_react.default.createElement("button", {
    type: "submit"
  }, "Submit"));
}

// 导出组件
var _default = exports.default = Greeting;