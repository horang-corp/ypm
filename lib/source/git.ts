import git from "isomorphic-git";
import http from "isomorphic-git/http/web";
type IFs = typeof import("fs");
import path from "path";
import { PackageOrder, Source } from "../source";
import { PackageRef } from "../package_ref";
import { Manifest } from "../manifest";
import { InvalidYsPackageError } from "../error";
import { YAMLMap } from "yaml";
import type { VirtualEnvironment } from "../entrypoint";

export default class GitSource extends Source {
	readonly isBrowser = typeof window !== "undefined" &&
		typeof window.document !== "undefined";

	get useCorsProxy(): boolean {
		return this.isBrowser;
	}

	constructor(
		private readonly fs: IFs,
		private readonly virtualEnv: VirtualEnvironment,
	) {
		super();
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
		const tmpDirName = "tmp_" + repoName;
		return path.join(this.virtualEnv.path, tmpDirName);
	}

	public async downloadPackage(
		packageOrder: GitPackageOrder,
	): Promise<PackageRef> {
		const destinationPath = this.getDestinationPath(packageOrder.url);
		await git.clone({
			fs: this.fs,
			corsProxy: this.useCorsProxy
				? "https://cors.isomorphic-git.org"
				: undefined,
			http,
			dir: destinationPath,
			url: packageOrder.url,
			singleBranch: true,
			depth: 1,
		});
		try {
			const manifest = await Manifest.loadFromDirectory(
				this.fs,
				destinationPath,
			);
			if (await this.virtualEnv.isPackageExists(manifest.name)) {
				await this.fs.promises.rm(
					path.join(this.virtualEnv.path, manifest.name),
					{ recursive: true },
				);
			}
			await this.fs.promises.rename(
				destinationPath,
				path.join(this.virtualEnv.path, manifest.name),
			);
			return new PackageRef(manifest.name, packageOrder);
		} catch (err) {
			if (err instanceof Error && "code" in err && err.code === "ENOENT") {
				throw new InvalidYsPackageError(
					`"${packageOrder.url}"은 약속 프로젝트가 아닙니다. "약속프로젝트.yaml" 파일이 없습니다.`,
				);
			}
			throw err;
		}
	}
}

export class GitPackageOrder extends PackageOrder {
	public serializeForManifest(): unknown {
		return { git: this.url };
	}
	constructor(
		public readonly url: string,
	) {
		super();
	}

	public static deserializeFromManifest(
		data: unknown,
	): PackageOrder {
		if (!(data instanceof YAMLMap)) {
			throw new Error("Invalid data format");
		}

		const url = data.get("git");
		if (typeof url !== "string") {
			throw new Error("Invalid git URL");
		}
		return new GitPackageOrder(url);
	}
}
