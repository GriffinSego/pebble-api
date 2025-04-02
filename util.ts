import type { SanitizedInput } from "./types"
export function sanitize(input: string): SanitizedInput {
	return {
		input: input,
		value: input
			.replaceAll(`"`, ``)
			.replaceAll(`\\`, ``)
			.replaceAll(`{`, ``)
			.replaceAll(`}`, ``)
			.replaceAll(`:`, ``)
			.replaceAll(`.`, ``)
			.replaceAll(`?`, ``)
			.replaceAll(`,`, ``)
	}
}
