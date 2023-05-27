"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiResponse = exports.genderStatus = exports.userStatus = void 0;
exports.userStatus = {
    labour: 0,
    contractor: 1,
    officer: 2,
    builder: 3
};
exports.genderStatus = {
    Male: 0,
    Female: 1
};
class apiResponse {
    constructor(status, message, data, error) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.error = error;
    }
}
exports.apiResponse = apiResponse;
//# sourceMappingURL=index.js.map