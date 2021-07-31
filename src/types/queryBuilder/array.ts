/** @ignore */
type ArrayFunction = (arg: string, separator?: string) => string;

/** @ignore */
export interface ArrayFunctions extends Record<string, ArrayFunction> {
  $arrayCompact: ArrayFunction;
  $arrayFlatten: ArrayFunction;
  $arrayUnique: ArrayFunction;
  $arrayJoin: ArrayFunction;
}
