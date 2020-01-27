"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StorageUtil = /** @class */ (function () {
    function StorageUtil() {
    }
    StorageUtil.stringifyPath = function (path, delimiter) {
        return path.map(function (item) {
            if (typeof item === "object" && "id" in item)
                return item.id;
            return item.toString();
        }).join(delimiter ? delimiter : "/");
    };
    return StorageUtil;
}());
exports.StorageUtil = StorageUtil;
//# sourceMappingURL=storage.js.map