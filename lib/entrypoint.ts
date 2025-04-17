import path from "path";
import { Package } from "./package";
import type { PackageOrder, Source } from "./source";
import GitSource, { GitPackageOrder } from "./source/git";
import type { PackageRef } from "./package_ref";
type IFs = typeof import("fs");

export class Entrypoint {
	public readonly fs: IFs;
	public readonly workingDir: string;
	public readonly rootPackage: Package;
	public readonly sources: SourceRegistry;
	public readonly virtualEnv: VirtualEnvironment;

	private constructor(
		{ dir, fs, rootPackage }: {
			dir: string;
			fs: IFs;
			rootPackage: Package;
		},
	) {
		this.workingDir = dir;
		this.fs = fs;
		this.rootPackage = rootPackage;
		this.virtualEnv = new VirtualEnvironment({
			fs,
			workingDir: this.workingDir,
		});
		this.sources = new SourceRegistry({
			git: new GitSource(fs, this.virtualEnv),
		});
	}

	public static async load(
		{ dir, fs }: { dir: string; fs: IFs },
	): Promise<Entrypoint> {
		const rootPackage = await Package.load({ fs, dir });
		return new Entrypoint(
			{ dir, fs, rootPackage },
		);
	}

	private async getSourceFromPackageOrder(
		packageOrder: PackageOrder,
	): Promise<Source> {
		if (packageOrder instanceof GitPackageOrder) {
			return this.sources.git;
		}
		throw new Error(`지원하지 않는 소스입니다. ${packageOrder}`);
	}

	public async add({
		git_url,
	}: {
		git_url: string | null;
	}) {
		let packageRef: PackageRef;
		await this.virtualEnv.prepare();

		if (git_url) {
			const packageOrder = new GitPackageOrder(git_url);
			const source = await this.getSourceFromPackageOrder(packageOrder);
			packageRef = await source.downloadPackage(packageOrder);
		} else {
			throw new Error("No source specified");
		}
		const manifest = this.rootPackage.manifest;
		manifest.addDependency(packageRef);
		await manifest.save(this.fs, this.workingDir);
	}

	public async remove({
		package_name,
	}: {
		package_name: string;
	}) {
		await this.fs.promises.rm(path.join(this.virtualEnv.path, package_name), {
			recursive: true,
		});
		const manifest = this.rootPackage.manifest;
		manifest.removeDependency(package_name);
		await manifest.save(this.fs, this.workingDir);
	}

	public async sync() {
		for (const dependency of this.rootPackage.manifest.dependencies.values()) {
			if (await this.virtualEnv.isPackageExists(dependency.name)) {
				continue;
			}
			const source = await this.getSourceFromPackageOrder(
				dependency.packageOrder,
			);
			await source.downloadPackage(dependency.packageOrder);
		}
		await this.virtualEnv.prune(
			Array.from(this.rootPackage.manifest.dependencies.keys()),
		);
	}
}

export class SourceRegistry {
	public readonly git: GitSource;
	constructor({ git }: { git: GitSource }) {
		this.git = git;
	}

	public get(name: string | null): Source {
		switch (name) {
			case "git":
				return this.git;
			default:
				throw new Error(`Source not found: ${name}`);
		}
	}
}

export class VirtualEnvironment {
	public readonly fs: IFs;
	public readonly path: string;

	constructor({
		fs,
		workingDir,
		envName = "의존성",
	}: {
		fs: IFs;
		workingDir: string;
		envName?: string;
	}) {
		this.fs = fs;
		this.path = path.join(workingDir, envName);
	}

	public async prepare() {
		try {
			await this.fs.promises.mkdir(this.path);
			await this.fs.promises.writeFile(
				path.join(this.path, ".gitignore"),
				"*",
			);
		} catch (err) {
			return;
		}
	}

	public async isPackageExists(
		packageName: string,
	): Promise<boolean> {
		try {
			await this.fs.promises.stat(
				path.join(this.path, packageName),
			);
			return true;
		} catch (err) {
			if (err instanceof Error && "code" in err && err.code === "ENOENT") {
				return false;
			}
			throw err;
		}
	}

	public async listPackages(): Promise<string[]> {
		try {
			const directories = (await this.fs.promises.readdir(this.path)).filter((
				dir,
			) => dir !== ".gitignore");
			return directories;
		} catch (err) {
			if (err instanceof Error && "code" in err && err.code === "ENOENT") {
				return [];
			}
			throw err;
		}
	}

	public async prune(packageNames: string[]) {
		const packages = await this.listPackages();
		for (const packageName of packages) {
			if (!packageNames.includes(packageName)) {
				await this.fs.promises.rm(
					path.join(this.path, packageName),
					{ recursive: true },
				);
			}
		}
	}
}
