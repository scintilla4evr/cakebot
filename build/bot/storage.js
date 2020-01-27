"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StorageUtil {
    static stringifyPath(path, delimiter) {
        return path.map(item => {
            if (typeof item === "object" && "id" in item)
                return item.id;
            return item.toString();
        }).join(delimiter ? delimiter : "/");
    }
}
exports.StorageUtil = StorageUtil;
//# sourceMappingURL=storage.js.map