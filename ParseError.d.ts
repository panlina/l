import { MatchResult } from "ohm-js";
declare class ParseError extends Error {
	constructor(matchResult: MatchResult);
	matchResult: MatchResult;
}
export = ParseError;
