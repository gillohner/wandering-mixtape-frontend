"use strict";
exports.__esModule = true;
// src/App.tsx
var react_1 = require("react");
require("./App.css");
var Map_tsx_1 = require("./Map.tsx");
var App = function () {
    return (react_1["default"].createElement("div", { className: "App" },
        react_1["default"].createElement("h1", null, "\u2708\uFE0F WanderingMixedTape \uD83D\uDCBF"),
        react_1["default"].createElement(Map_tsx_1["default"], null)));
};
exports["default"] = App;
