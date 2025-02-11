export const FunctionSymbol = "function";
export const InstructionSymbol = "instruction";
export const InstructionBlockSymbol = "instruction_block";
export const KeywordSymbol = "keyword";
export const MainInstructionBlockSymbol = "main_instruction";

export type TypeOfSymbol =
    typeof FunctionSymbol
    | typeof InstructionSymbol
    | typeof InstructionBlockSymbol
    | typeof KeywordSymbol
    | typeof MainInstructionBlockSymbol;


export const StringArgType = "string";
export const NumberArgType = "number";
export const BooleanArgType = "boolean";
export const VariableArgType = "variable";
export const AnyArgType = "any";

export type TypeOfArgs = typeof StringArgType |
    typeof NumberArgType |
    typeof BooleanArgType |
    typeof VariableArgType |
    typeof AnyArgType;

export type NumberOfArgs = number;
