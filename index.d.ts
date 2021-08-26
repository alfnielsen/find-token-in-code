declare type StartBracket = "<" | "[" | "(" | "{" | "${" | '$"' | '"' | "'" | "`" | "//" | "/*";
declare type EndBracket = ">" | "]" | ")" | "}" | '"' | "'" | "`" | "\n" | "*/";
interface BracketSet {
    name: string;
    start: StartBracket;
    end: EndBracket;
    notAfter?: string;
    notEndAfter?: string;
    notInParents: BracketSet[];
    notEndInParents: BracketSet[];
    isString?: boolean;
    isTemplate?: boolean;
    startParent?: BracketSet;
    endParent?: BracketSet;
}
export declare const brackets: {
    lineComment: BracketSet;
    multilineComment: BracketSet;
    angle: BracketSet;
    peparentheses: BracketSet;
    square: BracketSet;
    curly: BracketSet;
    escapeJsTemaple: BracketSet;
    escapeCSharpTemaple: BracketSet;
    double: BracketSet;
    single: BracketSet;
    jsTemplate: BracketSet;
    cSharpTemplate: BracketSet;
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
 * @param allowParents default [undefined, brackets.curly] - list of allow parent for the token (undefined is global scope)
 * @param throwErrors default false - if true: throw error with information
 * @returns
 */
export default function matchToken(code: string, token: string | RegExp, allowParents?: BracketSet[], throwErrors?: boolean): number;
export {};
