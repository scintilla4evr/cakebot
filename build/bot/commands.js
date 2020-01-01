"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
Object.defineProperty(exports, "__esModule", { value: true });
var MessageContent = /** @class */ (function () {
    function MessageContent() {
    }
    MessageContent.prototype.convertStringToLiteral = function (str) {
        if (!isNaN(+str)) {
            return +str;
        }
        else if (/^\<\@[0-9]+\>$/.test(str)) {
            var matches = /^\<\@([0-9]+)\>$/.exec(str);
            var userID_1 = matches[1];
            return this.message.mentions.members.find(function (member) { return member.id === userID_1; });
        }
        return str;
    };
    MessageContent.prototype.preparse = function () {
        var _this = this;
        var items = [];
        var strings = [], currentString = "";
        this.textContent.split("").forEach(function (character, i) {
            var isFirstCharacterInWord = i > 0 && /\s/.test(_this.textContent[i - 1]);
            if (isFirstCharacterInWord) {
                strings.push(currentString);
                currentString = character;
            }
            else {
                currentString += character;
            }
        });
        if (currentString)
            strings.push(currentString);
        strings.forEach(function (str, i) {
            var literal = _this.convertStringToLiteral(str.trim());
            if (items.length && typeof items[items.length - 1] === "string" && typeof literal === "string" && i > 1) {
                items[items.length - 1] += str;
            }
            else if (typeof literal === "string") {
                items.push(str);
            }
            else {
                items.push(literal);
            }
        });
        this.items = items.map(function (item) {
            if (typeof item === "string")
                return item.trim();
            return item;
        });
    };
    MessageContent.processMessage = function (bot, message) {
        var msgContent = new MessageContent();
        msgContent.message = message;
        msgContent.textContent = message.content.trim();
        msgContent.preparse();
        var commandName = msgContent.items[0];
        var command = bot.commands.find(function (cmd) {
            if (!commandName.startsWith(bot.commandPrefix))
                return false;
            if (cmd.name instanceof RegExp)
                return cmd.name.test(commandName.substring(1));
            return cmd.name.toLowerCase() === commandName.substring(1).toLowerCase();
        });
        if (command) {
            var argObject_1 = {};
            command.parameters.forEach(function (param, i) {
                if (i >= msgContent.items.length - 1)
                    return;
                argObject_1[param] = msgContent.items[i + 1];
            });
            if (Object.keys(argObject_1).length !== command.parameters.length)
                argObject_1 = null;
            if (command.determinePermissions(message))
                command.process(bot, message, argObject_1);
        }
    };
    return MessageContent;
}());
exports.MessageContent = MessageContent;
var Command = /** @class */ (function () {
    function Command() {
        this.permissionDeterminators = [];
    }
    Command.prototype.determinePermissions = function (message) {
        for (var _i = 0, _a = this.permissionDeterminators; _i < _a.length; _i++) {
            var p = _a[_i];
            if (!p(message))
                return false;
        }
        return true;
    };
    Command.prototype.process = function (bot, message, args) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    return Command;
}());
exports.Command = Command;
