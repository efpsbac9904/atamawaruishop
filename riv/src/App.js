"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const AppContext_1 = require("./context/AppContext");
const router_1 = require("./router");
function App() {
    return (<AppContext_1.AppProvider>
      <react_router_dom_1.RouterProvider router={router_1.router}/>
    </AppContext_1.AppProvider>);
}
exports.default = App;
