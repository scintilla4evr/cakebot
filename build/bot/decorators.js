"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function AttachToBot(bot) {
    return function (target) {
        var original = target;
        var newCtor = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            bot.addCommand(this);
            return original.apply(this, args);
        };
        newCtor.prototype = original.prototype;
        return newCtor;
    };
}
exports.AttachToBot = AttachToBot;
function DefineCommand(name, params) {
    return function (target) {
        var original = target;
        var newCtor = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var ret = original.apply(this, args);
            ret.name = name;
            ret.parameters = params;
            return ret;
        };
        newCtor.prototype = original.prototype;
        return newCtor;
    };
}
exports.DefineCommand = DefineCommand;
function RestrictToServers() {
    var servers = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        servers[_i] = arguments[_i];
    }
    return function (target) {
        var original = target;
        var newCtor = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var ret = original.apply(this, args);
            var determinators = ret.permissionDeterminators.concat([
                function (message) {
                    if (!servers.includes(message.guild.id))
                        return false;
                    return true;
                }
            ]);
            ret.permissionDeterminators = determinators;
            return ret;
        };
        newCtor.prototype = original.prototype;
        return newCtor;
    };
}
exports.RestrictToServers = RestrictToServers;
function RestrictToChannels() {
    var channels = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        channels[_i] = arguments[_i];
    }
    return function (target) {
        var original = target;
        var newCtor = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var ret = original.apply(this, args);
            var determinators = ret.permissionDeterminators.concat([
                function (message) {
                    if (!channels.includes(message.channel.id))
                        return false;
                    return true;
                }
            ]);
            ret.permissionDeterminators = determinators;
            return ret;
        };
        newCtor.prototype = original.prototype;
        return newCtor;
    };
}
exports.RestrictToChannels = RestrictToChannels;
function RestrictToUsers() {
    var users = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        users[_i] = arguments[_i];
    }
    return function (target) {
        var original = target;
        var newCtor = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var ret = original.apply(this, args);
            var determinators = ret.permissionDeterminators.concat([
                function (message) {
                    if (!users.includes(message.author.id))
                        return false;
                    return true;
                }
            ]);
            ret.permissionDeterminators = determinators;
            return ret;
        };
        newCtor.prototype = original.prototype;
        return newCtor;
    };
}
exports.RestrictToUsers = RestrictToUsers;
