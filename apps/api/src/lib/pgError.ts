/** biome-ignore-all lint/suspicious/noExplicitAny: <reason> */
const isPgError = {
	code(error: any, code: string) {
		const e_code = error.cause?.code;
		return e_code === code;
	},
	uniqueField(error: any, field: string) {
		const err = error.cause?.constraint.includes(`${field}_unique`);
		return err;
	},
};

export default isPgError;
