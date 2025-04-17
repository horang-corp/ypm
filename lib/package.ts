import { InvalidYsPackageError } from "./error";
import { Manifest } from "./manifest";
type IFs = typeof import("fs");

export class Package {
	public readonly dir: string;

	public readonly manifest: Manifest;

	public constructor({
		dir,
		manifest,
	}: {
		dir: string;
		manifest: Manifest;
	}) {
		this.dir = dir;
		this.manifest = manifest;
	}

	public static async load(
		{
			fs,
			dir,
		}: {
			fs: IFs;
			dir: string;
		},
	): Promise<Package> {
		try {
			const manifest = await Manifest.loadFromDirectory(fs, dir);
			return new Package({ dir, manifest });
		} catch (err) {
			if (err instanceof Error && "code" in err && err.code === "ENOENT") {
				throw new InvalidYsPackageError(
					`약속 프로젝트가 아닙니다. "${dir}"에 "약속프로젝트.yaml" 파일이 없습니다.
					조언 : "${dir}"에 "약속프로젝트.yaml" 파일을 추가해보세요.
					`,
				);
			}
			throw err;
		}
	}
}
