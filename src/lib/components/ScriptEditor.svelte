<script lang="ts">
    import {createEventDispatcher, onDestroy, onMount} from "svelte";

    let dispatcher = createEventDispatcher<{
        save: { code: string },
        editing: { isEditing: boolean }
    }>();

    export let code: string;

    let isEditing = false;
    let toBeSaved = false;
    let textAreaRef: HTMLTextAreaElement;

    const edit = () => {
        isEditing = true;
        toBeSaved = true;
        dispatcher('editing', {isEditing});
    };

    const save = () => {
        isEditing = false;

        if (Object.keys(errors).length > 0) {
            return;
        }

        toBeSaved = false;
        dispatcher('save', {code});
        dispatcher('editing', {isEditing});
    };

    const cancel = () => {
        isEditing = false;
        dispatcher('editing', {isEditing});
    };

    type TypeOfSymbol = "function" | "instruction" | "instruction_block" | "keyword" | "main_instruction";
    type NumberOfArgs = number;
    type TypeOfArgs = "string" | "number" | "boolean" | "variable" | "any";

    const language: { [p: string]: [TypeOfSymbol, NumberOfArgs, (TypeOfArgs[] | TypeOfArgs)[]] } = {
        "ACTIVATE": ["function", 1, [["number", "variable"]]],
        "DEACTIVATE": ["function", 1, [["number", "variable"]]],
        "PULSE": ["function", 1, [["number", "variable"]]],
        "READ": ["function", 1, [["number", "variable"]]],

        "SEND_TO_DASHBOARD": ["function", 1, [["number", "variable", "string"]]],

        "SET": ["function", 2, [["string", "number"], "any"]],
        "UNSET": ["function", 1, [["string", "number"]]],

        "ADD": ["function", 2, [["number", "variable"], ["number", "variable"]]],
        "SUBTRACT": ["function", 2, [["number", "variable"], ["number", "variable"]]],
        "MULTIPLY": ["function", 2, [["number", "variable"], ["number", "variable"]]],
        "DIVIDE": ["function", 2, [["number", "variable"], ["number", "variable"]]],
        "MODULO": ["function", 2, [["number", "variable"], ["number", "variable"]]],

        "DELAY": ["function", 1, ["number"]],

        "IF": ["instruction", 1, ["any"]],
        "WHILE": ["instruction", 1, ["any"]],
        "LOOP": ["instruction", 0, []],
        "BREAK": ["instruction", 0, []],
        "CONTINUE": ["instruction", 0, []],

        "THEN": ["instruction_block", 0, []],
        "END": ["instruction_block", 0, []],

        "RUN": ["main_instruction", 0, []],
        "STOP": ["main_instruction", 0, []],
    };

    const parseArgumentType = (arg: string): TypeOfArgs => {
        if (arg === "true" || arg === "false") {
            return "boolean";
        }

        if (arg.startsWith('"') || arg.endsWith('"')) {
            return "string";
        }

        if (arg.includes("$")) {
            return "variable";
        }

        if (arg.includes(".") || arg.match(/^[0-9]+$/)) {
            return "number";
        }

        return "any";
    };

    const checkArgumentsConformity = (command: string, args: string[], expectedArgs: (TypeOfArgs[] | TypeOfArgs)[]): {
        [p: number]: { arg: number, message: string }
    } => {
        let errors: { [p: number]: { arg: number, message: string } } = {};

        for (let i = 0; i < args.length; i++) {
            let arg = args[i];

            let expectedArg = expectedArgs[i];
            if (typeof expectedArg === "string") {
                expectedArg = [expectedArg];
            }

            if (expectedArg.includes("any")) {
                continue;
            }

            let type = parseArgumentType(arg);
            if (type === "any") {
                errors[i] = {
                    arg: i + 1,
                    message: `Argument ${i + 1} of command ${command} is an unknown type (string, number, boolean, variable are supported)`
                };
                continue;
            }

            if (!arg.match(/^"(.)+"$/ig) && arg.includes("\"") && expectedArg.includes("string")) {
                errors[i] = {
                    arg: i + 1,
                    message: `Argument ${i + 1} of command ${command} is an invalid string`
                };
                continue;
            }

            if (expectedArg.includes(type)) {
                continue;
            }

            errors[i] = {
                arg: i + 1,
                message: `Argument ${i + 1} of command ${command} expects ${expectedArg.join(" or ")}, ${type} given`
            };
        }

        return errors;
    };

    const checkCodeConformity = (code_string: string): {
            [p: number]: {
                line: number, message: string, sub_errors?: { [p: string]: { arg: number, message: string } }
            }
        } => {
            let lines = code_string.split('\n');
            let errors: {
                [p: number]: {
                    line: number,
                    message: string,
                    sub_errors?: { [p: string]: { arg: number, message: string } }
                }
            } = {};

            let missingRun = true;
            let missingStop = true;

            let timesPreviousCommandsAreStillOpen = 0;
            let waitingForThen = false;

            for (let i = 0; i < lines.length; i++) {

                let line = lines[i];
                let lineComposition = line.replaceAll('\t', '').split(' ').filter((value) => value);
                if (lineComposition.length === 0) {
                    continue;
                }

                let command = lineComposition[0];
                if (command === "RUN" && i === 0) {
                    missingRun = false;
                    continue;
                }

                if (command === "STOP" && i === lines.length - 1 && i !== 0) {
                    missingStop = false;
                    continue;
                }

                let commandConfig = language[command] as [TypeOfSymbol, NumberOfArgs, (TypeOfArgs[] | TypeOfArgs)[]] | undefined;
                if (!commandConfig) {
                    errors[i] = {
                        line: i + 1,
                        message: `Unknown command ${command}`
                    }
                    continue;
                }

                let commandType = commandConfig[0];
                if (commandType === "main_instruction") {
                    continue;
                }

                if (commandType === "keyword") {
                    if (command === "THEN") {
                        if (!waitingForThen) {
                            errors[i] = {
                                line: i + 1,
                                message: `Keyword THEN not expected here`
                            };
                            continue;
                        }
                        waitingForThen = false;
                        timesPreviousCommandsAreStillOpen++;
                        continue;
                    }

                    if (command === "END") {
                        if (waitingForThen || timesPreviousCommandsAreStillOpen <= 0) {
                            errors[i] = {
                                line: i + 1,
                                message: `Keyword END not expected here`
                            };
                            continue;
                        }

                        timesPreviousCommandsAreStillOpen--;
                        continue;
                    }
                }

                let currentArgs = lineComposition.slice(1);
                let expectedNumberOfArgs = commandConfig[1];

                if (commandType === "instruction") {

                    if (currentArgs.includes("THEN")) {
                        currentArgs.slice(currentArgs.indexOf("THEN"), 1);
                        timesPreviousCommandsAreStillOpen++;
                    } else {
                        waitingForThen = true;
                    }

                    if (currentArgs.length < expectedNumberOfArgs) {
                        errors[i] = {
                            line: i + 1,
                            message: `Instruction ${command} expects ${expectedNumberOfArgs} arguments, ${currentArgs.length - 1} given`
                        };
                    } else {
                        let args_errors = checkArgumentsConformity(command, currentArgs, commandConfig[2]);

                        if (Object.keys(args_errors).length > 0) {
                            errors[i] = {
                                line: i + 1,
                                message: `Instruction ${command} has invalid arguments`,
                                sub_errors: args_errors
                            };
                        }
                    }

                    continue;
                }

                if (commandType === "function") {

                    if (currentArgs.length < expectedNumberOfArgs) {
                        errors[i] = {
                            line: i + 1,
                            message: `Function ${command} expects ${expectedNumberOfArgs} arguments, ${lineComposition.length - 1} given`
                        };
                    } else {
                        let args_errors = checkArgumentsConformity(command, currentArgs, commandConfig[2]);

                        if (Object.keys(args_errors).length > 0) {
                            errors[i] = {
                                line: i + 1,
                                message: `Function ${command} has invalid arguments`,
                                sub_errors: args_errors
                            };
                        }
                    }

                    continue;
                }

                errors[i] = {
                    line: i + 1,
                    message: `Unknown keyword type ${commandType}`
                };
            }

            if (missingRun) {
                errors[0] = {
                    line: 1,
                    message: `Missing RUN instruction at the beginning of the script`
                };
            }

            if (missingStop) {
                errors[lines.length - 1] = {
                    line: lines.length,
                    message: `Missing STOP instruction at the end of the script`
                };
            }

            return errors;
        }
    ;

    const callbackKeydown = (e: any) => {
        if (e.key == 'Tab') {
            e.preventDefault();
            let start = textAreaRef.selectionStart;
            let end = textAreaRef.selectionEnd;
            textAreaRef.value = textAreaRef.value.substring(0, start) +
                "\t" + textAreaRef.value.substring(end);
            textAreaRef.selectionStart =
                textAreaRef.selectionEnd = start + 1;
        }
    };

    $:if (textAreaRef) {
        textAreaRef.removeEventListener('keydown', callbackKeydown);
        textAreaRef.addEventListener('keydown', callbackKeydown);
    }

    onMount(() => {
        if (textAreaRef) {
            textAreaRef.addEventListener('keydown', callbackKeydown);
        }

        code = code || "RUN\nSTOP";
    });

    onDestroy(() => {
        if (textAreaRef) {
            textAreaRef.removeEventListener('keydown', callbackKeydown);
        }
    });

    $:  errors = checkCodeConformity(code);
</script>

<div class="w-100 h-100 container">

    {#if toBeSaved}
        <div class="bg-green-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
            <strong class="font-bold">Unsaved code</strong>
            <span class="block sm:inline">You have unsaved code, please save it before leaving this page.</span>
        </div>
    {/if}


    <div class="grid grid-cols-5">

        <div class="flex justify-start col-span-4">
            <div class="w-10 min-h-[100px] p-4">
                {#each code.split('\n') as _, i}
                    <div class={"flex font-medium " + (errors[i] ? " text-red-400" : "" )}>
                        <span>{i + 1}</span>
                        {#if errors[i]}
                            &nbsp;
                            <span>Error</span>
                        {/if}
                    </div>
                {/each}
            </div>

            {#if isEditing}

                <textarea
                        bind:value={code}
                        class="ml-10 w-full bg-white p-4 rounded-xl min-h-[100px] font-mono"
                        bind:this={textAreaRef}
                />

            {:else}

                <pre class="ml-10 whitespace-pre-wrap font-mono w-full bg-white p-4 rounded-xl">{code || "No code yet! Press edit"}</pre>

            {/if}
        </div>

        <div class="flex justify-end col-span-1 items-center gap-4">
            {#if isEditing}

                <button on:click={save}
                        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded h-[40px]">
                    Save
                </button>
                <button on:click={cancel}
                        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded h-[40px]">
                    Cancel
                </button>

            {:else}

                <button on:click={edit}
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-[40px]">
                    Edit
                </button>

            {/if}
        </div>

    </div>

    <div class="mt-4">
        {#each Object.values(errors) as error}

            <p class="text-red-500">
                <span class="font-bold">{`LINE ${error.line}: `}</span>
                &nbsp; {`${error.message}`}

                {#if error.sub_errors}
                    <ul class="list-disc ml-4">
                        {#each Object.values(error.sub_errors) as sub_error}
                            <li>
                                <span class="font-bold">{`ARGUMENT ${sub_error.arg}: `}</span>
                                &nbsp; {`${sub_error.message}`}
                            </li>
                        {/each}
                    </ul>
                {/if}
            </p>

        {/each}
    </div>

</div>