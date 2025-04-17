export class InvalidYsPackageError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "InvalidYsPackage";
	}
}
