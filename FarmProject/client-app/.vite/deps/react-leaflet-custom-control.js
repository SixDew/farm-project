import {
  useMap
} from "./chunk-Z72P76O7.js";
import "./chunk-Q2OYXIDF.js";
import {
  require_leaflet_src
} from "./chunk-JCT2QDAK.js";
import "./chunk-PHQRXABF.js";
import {
  require_react
} from "./chunk-OO3FSR4X.js";
import {
  __toESM
} from "./chunk-2TUXWMP5.js";

// node_modules/react-leaflet-custom-control/lib/Control.js
var import_leaflet = __toESM(require_leaflet_src());
var import_react = __toESM(require_react());
var __assign = function() {
  __assign = Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
        t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
var POSITION_CLASSES = {
  bottomleft: "leaflet-bottom leaflet-left",
  bottomright: "leaflet-bottom leaflet-right",
  topleft: "leaflet-top leaflet-left",
  topright: "leaflet-top leaflet-right"
};
var Control = function(props) {
  var _a, _b;
  var _c = import_react.default.useState(document.createElement("div")), portalRoot = _c[0], setPortalRoot = _c[1];
  var positionClass = props.position && POSITION_CLASSES[props.position] || POSITION_CLASSES.topright;
  var controlContainerRef = import_react.default.createRef();
  var map = useMap();
  import_react.default.useEffect(function() {
    if (controlContainerRef.current !== null) {
      import_leaflet.default.DomEvent.disableClickPropagation(controlContainerRef.current);
      import_leaflet.default.DomEvent.disableScrollPropagation(controlContainerRef.current);
    }
  }, [controlContainerRef]);
  import_react.default.useEffect(function() {
    var mapContainer = map.getContainer();
    var targetDiv = mapContainer.getElementsByClassName(positionClass);
    setPortalRoot(targetDiv[0]);
  }, [positionClass]);
  import_react.default.useEffect(function() {
    if (portalRoot !== null) {
      if (props.prepend !== void 0 && props.prepend === true) {
        portalRoot.prepend(controlContainerRef.current);
      } else {
        portalRoot.append(controlContainerRef.current);
      }
    }
  }, [portalRoot, props.prepend, controlContainerRef]);
  var className = (((_b = (_a = props.container) === null || _a === void 0 ? void 0 : _a.className) === null || _b === void 0 ? void 0 : _b.concat(" ")) || "") + "leaflet-control";
  return import_react.default.createElement("div", __assign({}, props.container, { ref: controlContainerRef, className }), props.children);
};
var Control_default = Control;
export {
  Control_default as default
};
//# sourceMappingURL=react-leaflet-custom-control.js.map
