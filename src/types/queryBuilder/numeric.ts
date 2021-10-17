import { BaseFieldType, NumArg, QueryObject } from '../queryBuilder';

/** @ignore */
export type NumericalOpObject = Record<string, BaseFieldType | QueryObject>;

/** @ignore */
type NumericalOpFunction = (vals: NumericalOpObject) => string;

export type CeilFloorArg = {
  val: NumArg;
  significance?: NumArg;
};

export type LogArg = {
  num: NumArg;
  base?: NumArg;
};

export type ModArg = {
  val: NumArg;
  divisor: NumArg;
};

export type PowerArg = {
  base: NumArg;
  power: NumArg;
};

export type RoundArg = {
  val: NumArg;
  precision: NumArg;
};

export type SingleArgNumFunc = (arg: NumArg) => string;
export type ArrayArgNumFunc = (arg: NumArg[]) => string;
export type CeilFloorNumFunc = (arg: CeilFloorArg) => string;
export type LogNumFunc = (arg: LogArg) => string;
export type ModNumFunc = (arg: ModArg) => string;
export type PowerNumFunc = (arg: PowerArg) => string;
export type RoundNumFunc = (arg: RoundArg) => string;

export interface SingleArgNumFunctions
  extends Record<string, SingleArgNumFunc> {
  $abs: SingleArgNumFunc;
  $even: SingleArgNumFunc;
  $exp: SingleArgNumFunc;
  $int: SingleArgNumFunc;
  $odd: SingleArgNumFunc;
  $sqrt: SingleArgNumFunc;
}

export interface ArrayArgNumFunctions extends Record<string, ArrayArgNumFunc> {
  $avg: ArrayArgNumFunc;
  $count: ArrayArgNumFunc;
  $counta: ArrayArgNumFunc;
  $countAll: ArrayArgNumFunc;
  $max: ArrayArgNumFunc;
  $min: ArrayArgNumFunc;
  $sum: ArrayArgNumFunc;
}

export interface CeilFloorNumFunctions
  extends Record<string, CeilFloorNumFunc> {
  $ceil: CeilFloorNumFunc;
  $floor: CeilFloorNumFunc;
}

export interface LogNumFunction extends Record<string, LogNumFunc> {
  $log: LogNumFunc;
}

export interface ModNumFunction extends Record<string, ModNumFunc> {
  $mod: ModNumFunc;
}

export interface PowerNumFunction extends Record<string, PowerNumFunc> {
  $pow: PowerNumFunc;
}

export interface RoundNumFunctions extends Record<string, RoundNumFunc> {
  $round: RoundNumFunc;
  $roundDown: RoundNumFunc;
  $roundUp: RoundNumFunc;
}

export interface NumericOperators extends Record<string, NumericalOpFunction> {
  $add: NumericalOpFunction;
  $sub: NumericalOpFunction;
  $multi: NumericalOpFunction;
  $div: NumericalOpFunction;
}
