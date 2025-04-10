import GitSource from "./source/git";
import type Source from "./source/source";
import path from "path";
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

	private async preparePackageDir() {
		const packageDir = "./ys_modules";
		try {
			await this.fs.promises.mkdir(packageDir);
			await this.fs.promises.writeFile(
				path.join(packageDir, ".gitignore"),
				"*",
			);
		} catch (err) {
			return;
		}
	}

	public async add({
		git_url,
	}: {
		git_url: string | null;
	}) {
		await this.preparePackageDir();

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
		const packageDir = "./ys_modules";
		await this.fs.promises.rm(path.join(packageDir, package_name), {
			recursive: true,
			force: true,
		});
	}
}
