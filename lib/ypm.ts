import { Entrypoint } from "./entrypoint";
import path from "path";
type IFs = typeof import("fs");

export default class Ypm {
	public readonly fs: IFs;
	public readonly workingDir: string;
	private _entrypoint: Entrypoint | null = null;

	private async getEntrypoint(): Promise<Entrypoint> {
		if (!this._entrypoint) {
			this._entrypoint = await Entrypoint.load({
				dir: this.workingDir,
				fs: this.fs,
			});
		}
		return this._entrypoint;
	}

	constructor({
		workingDir,
		fs,
	}: {
		workingDir: string;
		fs: IFs;
	}) {
		this.fs = fs;
		this.workingDir = workingDir;
	}

	private async initWorkingDir(package_name: string) {
		const ysproject_yaml_path = path.join(this.workingDir, "ysproject.yaml");
		try {
			await this.fs.promises.stat(ysproject_yaml_path);
			return;
		} catch (_) {
		}

		await this.fs.promises.writeFile(
			path.join(this.workingDir, ".gitignore"),
			"의존성",
		);
		await this.fs.promises.writeFile(
			path.join(this.workingDir, "readme.md"),
			`# ${package_name}
새로운 약속 프로젝트.

## 시작하기

약속 프로젝트 개발을 할 때 도움을 받을 수 있는 곳이에요.

- [약속 문법책](https://codebook.horang.it/)
- [달빛약속 공식 문서 - 시작하기](https://dalbit-yaksok.postica.app/language/1.%20%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0.html)
- [한글 프로그래밍 교육 플랫폼 호랑](https://app.horang.it)
`,
		);
		await this.fs.promises.writeFile(
			path.join(this.workingDir, "약속프로젝트.yaml"),
			`이름: ${package_name} # 이 패키지의 이름은 무엇인가요?
# 설명: 두 개의 숫자를 더하는 계산기입니다. # 이 패키지는 어떤 패키지인가요?
# 만든이: 홍길동 # 이 패키지를 만든 사람은 누구인가요?


의존성:
    # 패키지 이름: git 주소
`,
		);
		await this.fs.promises.mkdir(path.join(this.workingDir, "소스"));
		await this.fs.promises.writeFile(
			path.join(this.workingDir, "소스", "시작.ys"),
			`약속, (숫자1) 더하기 (숫자2)
				숫자1 + 숫자2 반환하기
		
		`,
		);
	}

	public async init({
		package_name,
	}: {
		package_name: string;
	}) {
		await this.initWorkingDir(package_name);
	}

	public async add({
		git_url,
	}: {
		git_url: string | null;
	}) {
		const entrypoint = await this.getEntrypoint();
		await entrypoint.add({ git_url });
	}

	public async remove({
		package_name,
	}: {
		package_name: string;
	}) {
		const entrypoint = await this.getEntrypoint();
		await entrypoint.remove({ package_name });
	}

	public async sync() {
		const entrypoint = await this.getEntrypoint();
		await entrypoint.sync();
	}
}
