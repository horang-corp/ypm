import git from "isomorphic-git";
import http from "isomorphic-git/http/web";
type IFs = typeof import("fs");

export default class GitSource {
	constructor(private readonly fs: IFs) {
	}

	private getRemoteRepoName(url: string): string {
		if (url.endsWith("/")) {
			url = url.slice(0, -1);
		}

		const parts = url.split("/");
		const repoName = parts[parts.length - 1];
		const index = repoName.indexOf(".git");
		if (index !== -1) {
			return repoName.slice(0, index);
		}
		return repoName;
	}

	private getDestinationPath(url: string): string {
		const repoName = this.getRemoteRepoName(url);
		return `./ys_modules/${repoName}`;
	}

	public async downloadPackage(url: string): Promise<void> {
		const destinationPath = this.getDestinationPath(url);
		await git.clone({
			fs: this.fs,
			corsProxy: "https://cors.isomorphic-git.org",
			http,
			dir: destinationPath,
			url: url,
			singleBranch: true,
			depth: 1,
		});
	}
}
