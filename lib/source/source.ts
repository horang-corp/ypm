export default abstract class Source {
	constructor() {
	}

	public abstract downloadPackage(packageName: string): Promise<void>;
}
