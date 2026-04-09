export type JwtPayload = {
	userId: number;
};

export type GoogleUser = {
	id: string;
	name: string;
	email: string;
	picture: string;
};

export type Variables = {
	user: JwtPayload;
	'user-google': GoogleUser;
};
