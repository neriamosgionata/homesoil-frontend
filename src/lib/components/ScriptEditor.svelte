<script lang="ts">
	import { onDestroy } from "svelte";
	import type { NumberOfArgs, TypeOfArgs, TypeOfSymbol } from "$lib/components/ScriptLanguage";

	import {
		FunctionSymbol,
		InstructionSymbol,
		InstructionBlockSymbol,
		MainInstructionBlockSymbol,
		StringArgType,
		NumberArgType,
		BooleanArgType,
		VariableArgType,
		AnyArgType
	} from "$lib/components/ScriptLanguage";
	import { writable } from "svelte/store";
	import type { Writable } from "svelte/store";

	interface Props {
		code?: string;
		editing?: (v: { isEditing: boolean }) => void;
		saving?: (v: { code: string }) => void;
	}

	let { code = "", editing, saving }: Props = $props();

	let isEditing = $state(false);
	let toBeSaved = $state(false);
	let textAreaRef: HTMLTextAreaElement | undefined = $state(undefined);

	const edit = () => {
		if (!code) {
			code = "RUN\nSTOP";
		}
		isEditing = true;
		toBeSaved = true;
		editing?.({ isEditing });
	};

	const save = () => {
		removePopupForAutocomplete();

		isEditing = false;

		if (Object.keys(errors).length > 0) {
			return;
		}

		toBeSaved = false;
		saving?.({ code });
		editing?.({ isEditing });
	};

	const cancel = () => {
		removePopupForAutocomplete();
		isEditing = false;
		editing?.({ isEditing });
	};

	// LANGUAGE ANALYSIS LOGIC

	const language: { [p: string]: [TypeOfSymbol, NumberOfArgs, (TypeOfArgs[] | TypeOfArgs)[]] } = {
		ACTIVATE: [FunctionSymbol, 1, [[NumberArgType, VariableArgType]]],
		DEACTIVATE: [FunctionSymbol, 1, [[NumberArgType, VariableArgType]]],
		PULSE: [FunctionSymbol, 1, [[NumberArgType, VariableArgType]]],
		READ: [FunctionSymbol, 1, [[NumberArgType, VariableArgType]]],

		SEND_TO_DASHBOARD: [FunctionSymbol, 1, [[NumberArgType, VariableArgType, StringArgType]]],

		SET: [FunctionSymbol, 2, [[StringArgType, NumberArgType], AnyArgType]],
		UNSET: [FunctionSymbol, 1, [[StringArgType, NumberArgType]]],

		ADD: [
			FunctionSymbol,
			2,
			[
				[NumberArgType, VariableArgType],
				[NumberArgType, VariableArgType]
			]
		],
		SUBTRACT: [
			FunctionSymbol,
			2,
			[
				[NumberArgType, VariableArgType],
				[NumberArgType, VariableArgType]
			]
		],
		MULTIPLY: [
			FunctionSymbol,
			2,
			[
				[NumberArgType, VariableArgType],
				[NumberArgType, VariableArgType]
			]
		],
		DIVIDE: [
			FunctionSymbol,
			2,
			[
				[NumberArgType, VariableArgType],
				[NumberArgType, VariableArgType]
			]
		],
		MODULO: [
			FunctionSymbol,
			2,
			[
				[NumberArgType, VariableArgType],
				[NumberArgType, VariableArgType]
			]
		],

		DELAY: [FunctionSymbol, 1, [NumberArgType]],

		IF: [InstructionSymbol, 1, [AnyArgType]],
		WHILE: [InstructionSymbol, 1, [AnyArgType]],
		LOOP: [InstructionSymbol, 0, []],
		BREAK: [InstructionSymbol, 0, []],
		CONTINUE: [InstructionSymbol, 0, []],

		THEN: [InstructionBlockSymbol, 0, []],
		END: [InstructionBlockSymbol, 0, []],

		RUN: [MainInstructionBlockSymbol, 0, []],
		STOP: [MainInstructionBlockSymbol, 0, []]
	};

	const parseArgumentType = (arg: string): TypeOfArgs => {
		if (arg === "true" || arg === "false") {
			return BooleanArgType;
		}

		if (arg.startsWith('"') || arg.endsWith('"')) {
			return StringArgType;
		}

		if (arg.includes("$")) {
			return VariableArgType;
		}

		if (arg.includes(".") || arg.match(/^[0-9]+$/)) {
			return NumberArgType;
		}

		return AnyArgType;
	};

	const checkArgumentsConformity = (
		command: string,
		args: string[],
		expectedArgs: (TypeOfArgs[] | TypeOfArgs)[]
	): { [p: number]: { arg: number; message: string } } => {
		let errors: { [p: number]: { arg: number; message: string } } = {};

		for (let i = 0; i < args.length; i++) {
			let arg = args[i];

			let expectedArg = expectedArgs[i];
			if (typeof expectedArg === StringArgType) {
				expectedArg = [expectedArg as TypeOfArgs];
			}

			if (expectedArg.includes(AnyArgType)) {
				continue;
			}

			let type = parseArgumentType(arg);
			if (type === AnyArgType) {
				errors[i] = {
					arg: i + 1,
					message: `Argument ${i + 1} of command ${command} is an unknown type (string, number, boolean, variable are supported)`
				};
				continue;
			}

			if (!arg.match(/^"(.)+"$/gi) && arg.includes('"') && expectedArg.includes(StringArgType)) {
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
				message: `Argument ${i + 1} of command ${command} expects ${(expectedArg as TypeOfArgs[]).join(" or ")}, ${type} given`
			};
		}

		return errors;
	};

	const checkCodeConformity = (
		code_string: string
	): {
		[p: number]: {
			line: number;
			message: string;
			sub_errors?: { [p: string]: { arg: number; message: string } };
		};
	} => {
		let lines = code_string.split("\n");
		let errors: {
			[p: number]: {
				line: number;
				message: string;
				sub_errors?: { [p: string]: { arg: number; message: string } };
			};
		} = {};

		let missingRun = true;
		let missingStop = true;

		let timesPreviousCommandsAreStillOpen = 0;
		let waitingForThen = false;

		for (let i = 0; i < lines.length; i++) {
			let line = lines[i];
			let lineComposition = line
				.replaceAll("\t", "")
				.split(" ")
				.filter((value) => value);
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

			let commandConfig = language[command] as
				| [TypeOfSymbol, NumberOfArgs, (TypeOfArgs[] | TypeOfArgs)[]]
				| undefined;
			if (!commandConfig) {
				errors[i] = {
					line: i + 1,
					message: `Unknown command ${command}`
				};
				continue;
			}

			let commandType = commandConfig[0];
			if (commandType === MainInstructionBlockSymbol) {
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

			if (commandType === InstructionSymbol) {
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

			if (commandType === FunctionSymbol) {
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
	};

	const timeout: Writable<NodeJS.Timeout | null> = writable(null);
	const debounce = (callback: Function, time: number = 350) => {
		$timeout && clearTimeout($timeout);
		timeout.set(
			setTimeout(() => {
				callback();
			}, time) as NodeJS.Timeout
		);
	};

	//AUTOCOMPLETE SUGGESTION LOGIC

	let divElement: HTMLDivElement | null = $state(null);
	let selectElement: HTMLSelectElement | null = $state(null);
	let optionSelected: TypeOfSymbol | null = $state(null);
	let selectionStart: number = $state(0);
	let selectionEnd: number = $state(0);

	const createPopupForAutocomplete = (position: { x: number; y: number }, options: TypeOfSymbol[]) => {
		if (options.length === 0) {
			if (divElement) {
				document.querySelector("main")?.removeChild(divElement);
				divElement = null;
			}
			return;
		}

		if (divElement) {
			document.querySelector("main")?.removeChild(divElement);
			divElement = null;
		}

		const div = document.createElement("div");
		div.classList.add("rounded-md", "fixed", "z-50", "px-2", "py-1");
		div.style.top = position.y - 5 + "px";
		div.style.left = position.x + 20 + "px";
		div.style.backgroundColor = "var(--bg-secondary)";
		div.style.border = "1px solid var(--border-subtle)";

		const span = document.createElement("span");
		span.classList.add("px-1", "text-sm");
		span.style.color = "var(--text-secondary)";
		span.textContent = "Suggested:";
		div.append(span);

		const sel = document.createElement("select");
		sel.style.backgroundColor = "var(--bg-primary)";
		sel.style.color = "var(--text-primary)";
		sel.style.borderRadius = "4px";
		sel.style.padding = "2px 4px";
		sel.style.fontSize = "0.875rem";

		for (const option of options) {
			const opt = document.createElement("option");
			opt.value = option;
			opt.text = option;
			sel.append(opt);
		}

		sel.onchange = (v: Event) => {
			optionSelected = sel.value as TypeOfSymbol;
		};

		selectElement = sel;

		div.append(sel);

		divElement = div;

		document.querySelector("main")?.append(divElement);
	};

	const removePopupForAutocomplete = (skipEventInit: boolean = false) => {
		if (divElement) {
			document.querySelector("main")?.removeChild(divElement as HTMLDivElement);
			divElement = null;
		}

		if (!skipEventInit) {
			textAreaRef && textAreaRef.focus();
		}

		optionSelected = null;
	};

	const callbackKeydown = (e: any) => {
		if (e.key == "Escape" && divElement) {
			removePopupForAutocomplete();
			return;
		}

		if (e.key == "Tab" && textAreaRef && divElement && optionSelected) {
			code = code.slice(0, selectionStart) + optionSelected + code.slice(selectionEnd, code.length);
			removePopupForAutocomplete();
			textAreaRef.selectionEnd = selectionStart;
			return;
		}

		debounce(() => {
			if (textAreaRef && textAreaRef.classList.contains("focused")) {
				removePopupForAutocomplete(true);

				let value = code;

				selectionEnd = textAreaRef.selectionEnd;
				selectionStart = selectionEnd;

				let i = selectionEnd > 0 ? selectionEnd - 1 : 0;

				while (value.charAt(i) !== " " && value.charAt(i) !== "\n" && i > 0) {
					i--;
				}

				selectionStart = i + 1;

				let toMatch = value.slice(selectionStart, selectionEnd) || "";

				let options: TypeOfSymbol[] = Object.entries(language)
					.filter((v) => [FunctionSymbol, InstructionSymbol].includes(v[1][0]))
					.map((v) => v[0] as TypeOfSymbol)
					.filter((v) => !toMatch || v.toLowerCase().trim().includes(toMatch.trim().toLowerCase()));

				let position = window.getSelection()?.getRangeAt(0).getBoundingClientRect() as { x: number; y: number };

				if (position?.x == 0 && position?.y == 0) {
					const input = document.activeElement as HTMLInputElement;

					const div = document.createElement("div");
					for (const style of input.computedStyleMap()) {
						div.style[style[0] as any] = style[1].toString();
					}

					div.textContent = input.value?.substring(0, input.selectionStart as any);

					const span = document.createElement("span");
					div.insertBefore(span, null);

					document.body.insertBefore(div, null);

					const [divPos, spanPos, inputPos] = [div, span, input].map((e) => e.getBoundingClientRect());
					position = {
						x: inputPos.x + (spanPos.x - divPos.x),
						y: inputPos.y + (spanPos.y - divPos.y)
					};
				}

				if (options.length) {
					optionSelected = options[0];
				}

				createPopupForAutocomplete(
					{
						x: position?.x as number,
						y: position?.y as number
					},
					options
				);
			}
		});
	};

	$effect(() => {
		if (textAreaRef) {
			textAreaRef.addEventListener("keydown", callbackKeydown);
		}
	});

	onDestroy(() => {
		if (textAreaRef) {
			textAreaRef.removeEventListener("keydown", callbackKeydown);
		}
	});

	let errors = $derived(checkCodeConformity(code));
</script>

<div>
	{#if toBeSaved}
		<div class="rounded-lg px-4 py-3 mb-3 border" style="background: rgba(76,175,80,0.1); border-color: var(--accent); color: var(--accent);">
			<strong class="font-bold">Unsaved code</strong>
			<span class="ml-1">You have unsaved code!</span>
		</div>
	{/if}

	<div class="grid grid-cols-5">
		<div class="flex justify-start col-span-4">
			<div class="w-10 min-h-[100px] p-4">
				{#each code.split("\n") as _, i}
					<div class="flex font-medium text-sm" style="color: {errors[i] ? 'var(--status-offline)' : 'var(--text-muted)'};">
						<span>{i + 1}</span>
						{#if errors[i]}
							&nbsp;
							<span>!</span>
						{/if}
					</div>
				{/each}
			</div>

			{#if isEditing}
				<textarea
					bind:value={code}
					class="ml-4 w-full p-4 rounded-xl min-h-[100px] font-mono text-sm border focus:outline-none focus:ring-2"
					style="background-color: var(--bg-primary); border-color: var(--border-subtle); color: var(--text-primary);"
					bind:this={textAreaRef}
					onfocus={() => textAreaRef?.classList.add("focused")}
				></textarea>
			{:else}
				<pre class="ml-4 whitespace-pre-wrap font-mono w-full p-4 rounded-xl text-sm" style="background-color: var(--bg-primary); color: var(--text-primary);">{code || "No code yet! Press edit"}</pre>
			{/if}
		</div>

		<div class="flex justify-end col-span-1 items-center gap-3">
			{#if isEditing}
				<button
					onclick={save}
					class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200"
					style="background-color: var(--accent); color: white;"
				>
					Save
				</button>
				<button
					onclick={cancel}
					class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200"
					style="background-color: var(--status-offline); color: white;"
				>
					Cancel
				</button>
			{:else}
				<button
					onclick={edit}
					class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:bg-white/10"
					style="color: var(--text-secondary); border: 1px solid var(--border-subtle);"
				>
					Edit
				</button>
			{/if}
		</div>
	</div>

	<div class="mt-4">
		{#each Object.values(errors) as error}
			<p class="text-sm" style="color: var(--status-offline);">
				<span class="font-bold">{`LINE ${error.line}: `}</span>
				&nbsp; {`${error.message}`}
			</p>

			{#if error.sub_errors}
				<ul class="list-disc ml-4">
					{#each Object.values(error.sub_errors) as sub_error}
						<li class="text-sm" style="color: var(--status-offline);">
							<span class="font-bold">{`ARGUMENT ${sub_error.arg}: `}</span>
							&nbsp; {`${sub_error.message}`}
						</li>
					{/each}
				</ul>
			{/if}
		{/each}
	</div>
</div>
