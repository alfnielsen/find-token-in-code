"use strict";
exports.__esModule = true;
exports.brackets = void 0;
// Meta rules for each bracket type (Map)
exports.brackets = {
    lineComment: { name: "lineComment", start: "//", end: "\n" },
    multilineComment: { name: "multilineComment", start: "/*", end: "*/" },
    angle: { name: "angle", start: "<", end: ">" },
    peparentheses: { name: "peparentheses", start: "(", end: ")" },
    square: { name: "square", start: "[", end: "]" },
    curly: { name: "curly", start: "{", end: "}" },
    escapeJsTemaple: { name: "escapeJsTemaple", notAfter: "\\", start: "${", end: "}" },
    escapeCSharpTemaple: { name: "escapeCSharpTemaple", notAfter: "{", start: "{", end: "}" },
    double: { name: "double", start: '"', end: '"', notEndAfter: "\\", isString: true },
    single: { name: "single", start: "'", end: "'", notEndAfter: "\\", isString: true },
    jsTemplate: { name: "jsTemplate", start: "`", end: "`", notEndAfter: "\\", isString: true, isTemplate: true },
    cSharpTemplate: { name: "cSharpTemplate", start: '$"', end: '"' }
};
// only start in parent
exports.brackets.escapeJsTemaple.startParent = exports.brackets.jsTemplate;
exports.brackets.escapeCSharpTemaple.startParent = exports.brackets.cSharpTemplate;
// not in parent setting
exports.brackets.lineComment.notInParents = [exports.brackets.lineComment, exports.brackets.multilineComment, exports.brackets.double, exports.brackets.single, exports.brackets.jsTemplate, exports.brackets.cSharpTemplate];
exports.brackets.multilineComment.notInParents = [exports.brackets.lineComment, exports.brackets.multilineComment, exports.brackets.double, exports.brackets.single, exports.brackets.jsTemplate, exports.brackets.cSharpTemplate];
exports.brackets.angle.notInParents = [exports.brackets.lineComment, exports.brackets.multilineComment, exports.brackets.double, exports.brackets.single, exports.brackets.jsTemplate, exports.brackets.cSharpTemplate];
exports.brackets.peparentheses.notInParents = [exports.brackets.lineComment, exports.brackets.multilineComment, exports.brackets.double, exports.brackets.single, exports.brackets.jsTemplate, exports.brackets.cSharpTemplate];
exports.brackets.square.notInParents = [exports.brackets.lineComment, exports.brackets.multilineComment, exports.brackets.double, exports.brackets.single, exports.brackets.jsTemplate, exports.brackets.cSharpTemplate];
exports.brackets.curly.notInParents = [exports.brackets.lineComment, exports.brackets.multilineComment, exports.brackets.double, exports.brackets.single, exports.brackets.jsTemplate, exports.brackets.cSharpTemplate];
exports.brackets.escapeJsTemaple.notInParents = [exports.brackets.lineComment, exports.brackets.multilineComment, exports.brackets.double, exports.brackets.single, exports.brackets.cSharpTemplate];
exports.brackets.escapeCSharpTemaple.notInParents = [exports.brackets.lineComment, exports.brackets.multilineComment, exports.brackets.double, exports.brackets.single, exports.brackets.jsTemplate];
exports.brackets.double.notInParents = [exports.brackets.lineComment, exports.brackets.multilineComment, exports.brackets.single, exports.brackets.jsTemplate, exports.brackets.cSharpTemplate];
exports.brackets.single.notInParents = [exports.brackets.lineComment, exports.brackets.multilineComment, exports.brackets.double, exports.brackets.jsTemplate, exports.brackets.cSharpTemplate];
exports.brackets.jsTemplate.notInParents = [exports.brackets.lineComment, exports.brackets.multilineComment, exports.brackets.double, exports.brackets.single, exports.brackets.cSharpTemplate];
exports.brackets.cSharpTemplate.notInParents = [exports.brackets.lineComment, exports.brackets.multilineComment, exports.brackets.double, exports.brackets.single, exports.brackets.jsTemplate];
// not end in parent (use notInParents is not set)
exports.brackets.lineComment.notEndInParents = [exports.brackets.multilineComment, exports.brackets.double, exports.brackets.single, exports.brackets.jsTemplate, exports.brackets.cSharpTemplate];
exports.brackets.multilineComment.notEndInParents = [exports.brackets.lineComment, exports.brackets.double, exports.brackets.single, exports.brackets.jsTemplate, exports.brackets.cSharpTemplate];
// Map to list (For easy iteration)
var brackitSets = Object.values(exports.brackets);
// test for matching start bracket (set)
var isStart = function (code, p, parent) {
    var char = code[p];
    var next = code.length > p + 1 ? code[p + 1] : undefined;
    var last = code.length > 1 ? code[p - 1] : undefined;
    return brackitSets.find(function (bracketSet) {
        if (bracketSet.start.length === 2 && (bracketSet.start[0] !== char || bracketSet.start[1] !== next))
            return false;
        else if (bracketSet.start.length === 1 && bracketSet.start !== char)
            return false;
        if (bracketSet.start === bracketSet.end && bracketSet === parent)
            return false; // string end
        if (parent && bracketSet.notInParents.includes(parent))
            return false;
        if (parent && bracketSet.startParent !== undefined && bracketSet.startParent !== parent)
            return false;
        if (bracketSet.notAfter && bracketSet.notAfter === last)
            return false;
        return true;
    });
};
// test for matching end bracket (set)
var isEnd = function (code, p, parent) {
    var char = code[p];
    var next = code.length > p + 1 ? code[p + 1] : undefined;
    var last = code.length > 1 ? code[p - 1] : undefined;
    return brackitSets.find(function (bracketSet) {
        if (bracketSet.end.length === 2 && (bracketSet.end[0] !== char || bracketSet.end[1] !== next))
            return false;
        else if (bracketSet.end.length === 1 && bracketSet.end !== char)
            return false;
        if (bracketSet !== parent)
            return false;
        if (bracketSet.notEndInParents) {
            // command cannot start in commment but end in them
            if (bracketSet.notEndInParents.includes(parent))
                return false;
        }
        else if (bracketSet.notInParents.includes(parent))
            return false;
        if (bracketSet.notEndAfter && bracketSet.notEndAfter === last)
            return false;
        return true;
    });
};
/**
 * if throwErrors is true, it throw (stop) with info.
 * else it return matching position,
 * or:
 * -3 if end bracket dont match start bracket
 * -1 if cursor comes to end of code without finding maching bracket
 *
 * @param code
 * @param token string | RegExp (the match will be done for cursor -1, so large lookbehind are not posible)
 * @param allowParents list of allow parent for the token
 * @param throwErrors default false - if true: throw error with information
 * @returns
 */
function matchToken(code, token, allowParents, throwErrors) {
    var _a;
    if (allowParents === void 0) { allowParents = [undefined, exports.brackets.curly]; }
    if (throwErrors === void 0) { throwErrors = false; }
    debugger;
    var stack = [];
    var c = undefined;
    var isString = typeof token === "string";
    var reg = isString ? new RegExp("\\b" + token + "\\b") : token;
    var allowed = allowParents.includes(c);
    for (var p = 1; p < code.length - 1; p++) {
        if (allowed) {
            var matchCode = code.substring(p - 1);
            if (matchCode.search(reg) === 1) {
                return p;
            }
        }
        var start = isStart(code, p, c);
        if (start) {
            if (start.start.length == 2) {
                p += 1;
            }
            stack.push(start);
            c = start;
            allowed = allowParents.includes(c);
            continue;
        }
        var end = isEnd(code, p, c);
        if (end) {
            if (c !== end) {
                if (throwErrors) {
                    throw new Error("matchBracket missmatch start: " + ((_a = c === null || c === void 0 ? void 0 : c.name) !== null && _a !== void 0 ? _a : 'global') + " end: " + end.name + " at position " + p);
                }
                return -3;
            }
            stack.pop();
            c = stack.length === 0 ? undefined : stack[stack.length - 1];
            allowed = allowParents.includes(c);
            continue;
        }
    }
    return -1;
}
exports["default"] = matchToken;
