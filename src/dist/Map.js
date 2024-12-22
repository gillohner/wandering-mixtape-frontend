"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var react_leaflet_1 = require("react-leaflet");
require("leaflet/dist/leaflet.css");
var axios_1 = require("axios");
var leaflet_1 = require("leaflet");
var Map = function () {
    var _a = react_1.useState([]), images = _a[0], setImages = _a[1];
    var _b = react_1.useState(true), loading = _b[0], setLoading = _b[1];
    var _c = react_1.useState(null), error = _c[0], setError = _c[1];
    var fetchImages = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1["default"].get('http://localhost:1337/api/images?populate=*')];
                case 1:
                    response = _a.sent();
                    setImages(response.data.data);
                    setLoading(false);
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    setError('Failed to fetch images');
                    setLoading(false);
                    console.error(err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    react_1.useEffect(function () {
        fetchImages();
    }, []);
    if (loading)
        return react_1["default"].createElement("div", null, "Loading...");
    if (error)
        return react_1["default"].createElement("div", null, error);
    return (react_1["default"].createElement(react_leaflet_1.MapContainer, { center: [0, 0], zoom: 2, style: { height: '100vh', width: '100%' } },
        react_1["default"].createElement(react_leaflet_1.TileLayer, { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", attribution: '\u00A9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }),
        images.map(function (image) {
            var _a;
            var customIcon = leaflet_1["default"].icon({
                iconUrl: "http://localhost:1337" + image.image.formats.small.url,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
            });
            return (react_1["default"].createElement(react_leaflet_1.Marker, { key: image.documentId, position: [image.location.lat, image.location.lng], icon: customIcon },
                react_1["default"].createElement(react_leaflet_1.Popup, null,
                    react_1["default"].createElement("h3", null, image.locationName),
                    ((_a = image.image) === null || _a === void 0 ? void 0 : _a.formats) && (react_1["default"].createElement("img", { src: "http://localhost:1337" + image.image.formats.large.url, alt: image.locationName, style: { maxWidth: '200px' } })),
                    image.description.map(function (para, index) { return (react_1["default"].createElement("p", { key: index }, para.children.map(function (child, childIndex) { return (react_1["default"].createElement("span", { key: childIndex, style: {
                            fontWeight: child.bold ? 'bold' : 'normal',
                            fontStyle: child.italic ? 'italic' : 'normal',
                            textDecoration: child.underline ? 'underline' : 'none'
                        } }, child.text)); }))); }))));
        })));
};
exports["default"] = Map;
