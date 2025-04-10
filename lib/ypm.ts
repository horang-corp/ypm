import GitSource from "./source/git";
import type Source from "./source/source";
type IFs = typeof import("fs");

export default class Ypm {
	private readonly fs: IFs;

	constructor({
		fs,
	}: {
		fs: IFs;
	}) {
		this.fs = fs;
	}

	public async add({
		git_url,
	}: {
		git_url: string | null;
	}) {
		let source: Source;

		if (git_url) {
			source = new GitSource(this.fs);
		} else {
			throw new Error("No source specified");
		}
		await source!.downloadPackage(git_url!);
	}

	public async remove({
		package_name,
	}: {
		package_name: string;
	}) {
		await this.fs.promises.rm(`./ys_modules/${package_name}`, {
			recursive: true,
			force: true,
		});
	}
}
