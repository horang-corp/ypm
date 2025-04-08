import GitSource from "./source/git";
import type Source from "./source/source";
import type { FsClient } from "./fs";

// This is Package Manager for YS
export default class Ypm {
	private readonly fs: FsClient;

	constructor({
		fs,
	}: {
		fs: FsClient;
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
}
