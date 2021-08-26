"use strict";
exports.__esModule = true;
// Meta rules for each bracket type (Map)
var brackets = {
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
brackets.escapeJsTemaple.startParent = brackets.jsTemplate;
brackets.escapeCSharpTemaple.startParent = brackets.cSharpTemplate;
// not in parent setting
brackets.lineComment.notInParents = [brackets.lineComment, brackets.multilineComment, brackets.double, brackets.single, brackets.jsTemplate, brackets.cSharpTemplate];
brackets.multilineComment.notInParents = [brackets.lineComment, brackets.multilineComment, brackets.double, brackets.single, brackets.jsTemplate, brackets.cSharpTemplate];
brackets.angle.notInParents = [brackets.lineComment, brackets.multilineComment, brackets.double, brackets.single, brackets.jsTemplate, brackets.cSharpTemplate];
brackets.peparentheses.notInParents = [brackets.lineComment, brackets.multilineComment, brackets.double, brackets.single, brackets.jsTemplate, brackets.cSharpTemplate];
brackets.square.notInParents = [brackets.lineComment, brackets.multilineComment, brackets.double, brackets.single, brackets.jsTemplate, brackets.cSharpTemplate];
brackets.curly.notInParents = [brackets.lineComment, brackets.multilineComment, brackets.double, brackets.single, brackets.jsTemplate, brackets.cSharpTemplate];
brackets.escapeJsTemaple.notInParents = [brackets.lineComment, brackets.multilineComment, brackets.double, brackets.single, brackets.cSharpTemplate];
brackets.escapeCSharpTemaple.notInParents = [brackets.lineComment, brackets.multilineComment, brackets.double, brackets.single, brackets.jsTemplate];
brackets.double.notInParents = [brackets.lineComment, brackets.multilineComment, brackets.single, brackets.jsTemplate, brackets.cSharpTemplate];
brackets.single.notInParents = [brackets.lineComment, brackets.multilineComment, brackets.double, brackets.jsTemplate, brackets.cSharpTemplate];
brackets.jsTemplate.notInParents = [brackets.lineComment, brackets.multilineComment, brackets.double, brackets.single, brackets.cSharpTemplate];
brackets.cSharpTemplate.notInParents = [brackets.lineComment, brackets.multilineComment, brackets.double, brackets.single, brackets.jsTemplate];
// not end in parent (use notInParents is not set)
brackets.lineComment.notEndInParents = [brackets.multilineComment, brackets.double, brackets.single, brackets.jsTemplate, brackets.cSharpTemplate];
brackets.multilineComment.notEndInParents = [brackets.lineComment, brackets.double, brackets.single, brackets.jsTemplate, brackets.cSharpTemplate];
// Map to list (For easy iteration)
var brackitSets = Object.values(brackets);
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
 * @param allowParents
 * @param throwErrors default false - if true: throw error with information
 * @returns
 */
function matchToken(code, token, allowParents, throwErrors) {
    var _a;
    if (allowParents === void 0) { allowParents = [undefined, brackets.curly]; }
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
