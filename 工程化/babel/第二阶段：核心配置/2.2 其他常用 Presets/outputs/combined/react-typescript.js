"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Counter = exports.ConditionalRender = void 0;
exports.Form = Form;
exports.List = List;
exports.default = exports.UserCard = void 0;
var _react = _interopRequireWildcard(require("react"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } // React + TypeScript 示例
// 演示同时使用 React 和 TypeScript
// 1. 函数组件类型定义
const Greeting = _ref => {
  let {
    name,
    age,
    onGreet
  } = _ref;
  const [count, setCount] = (0, _react.useState)(0);
  const [message, setMessage] = (0, _react.useState)('');
  (0, _react.useEffect)(() => {
    setMessage("Hello, ".concat(name, "!"));
    if (onGreet) {
      onGreet(name);
    }
  }, [name, onGreet]);
  const handleClick = () => {
    setCount(count + 1);
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    className: "greeting",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("h1", {
      children: message
    }), age && /*#__PURE__*/(0, _jsxRuntime.jsxs)("p", {
      children: ["Age: ", age]
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("p", {
      children: ["Count: ", count]
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
      onClick: handleClick,
      children: "Increment"
    })]
  });
};

// 2. 类组件类型定义

class Counter extends _react.default.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "handleIncrement", () => {
      const step = this.props.step || 1;
      this.setState({
        count: this.state.count + step
      });
    });
    this.state = {
      count: props.initialValue || 0
    };
  }
  render() {
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("h2", {
        children: ["Counter: ", this.state.count]
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
        onClick: this.handleIncrement,
        children: "+"
      })]
    });
  }
}

// 3. 泛型组件
exports.Counter = Counter;
function List(_ref2) {
  let {
    items,
    renderItem
  } = _ref2;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("ul", {
    children: items.map((item, index) => /*#__PURE__*/(0, _jsxRuntime.jsx)("li", {
      children: renderItem(item)
    }, index))
  });
}

// 4. 事件处理类型

function Form(_ref3) {
  let {
    onSubmit
  } = _ref3;
  const [name, setName] = (0, _react.useState)('');
  const handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    onSubmit(formData);
  };
  const handleChange = e => {
    setName(e.target.value);
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("form", {
    onSubmit: handleSubmit,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
      type: "text",
      value: name,
      onChange: handleChange,
      placeholder: "Enter name"
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
      type: "submit",
      children: "Submit"
    })]
  });
}

// 5. 使用类型和接口

const UserCard = _ref4 => {
  let {
    user,
    onSelect
  } = _ref4;
  const handleClick = () => {
    if (onSelect) {
      onSelect(user);
    }
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    onClick: handleClick,
    style: {
      cursor: 'pointer'
    },
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("h3", {
      children: user.name
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
      children: user.email
    })]
  });
};

// 6. 条件渲染类型安全
exports.UserCard = UserCard;
const ConditionalRender = _ref5 => {
  let {
    isLoggedIn,
    user
  } = _ref5;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    children: isLoggedIn && user ? /*#__PURE__*/(0, _jsxRuntime.jsxs)("p", {
      children: ["Welcome, ", user.name, "!"]
    }) : /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
      children: "Please log in."
    })
  });
};

// 导出
exports.ConditionalRender = ConditionalRender;
var _default = exports.default = Greeting;