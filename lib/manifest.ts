type IFs = typeof import("fs");
import path from "path";
import { PackageRef } from "./package_ref";
import { Document, parseDocument, type Scalar, YAMLMap } from "yaml";
import type { PackageOrder } from "./source";
import { GitPackageOrder } from "./source/git";

export class Manifest {
	get name(): string {
		return this.yamlDoc.get("이름") as string;
	}
	get description(): string | null {
		return this.yamlDoc.get("설명") as string | null;
	}
	get author(): string | null {
		return this.yamlDoc.get("만든이") as string | null;
	}
	readonly yamlDoc: Document;
	get dependencies(): Map<string, PackageRef> {
		this._dependencies ??= this.parseDependencies();
		return this._dependencies;
	}
	private _dependencies: Map<string, PackageRef> | null = null;
	private constructor({
		yamlDoc,
	}: {
		yamlDoc: Document;
	}) {
		this.yamlDoc = yamlDoc;
	}

	public static async loadFromDirectory(
		fs: IFs,
		dir: string,
	): Promise<Manifest> {
		const manifestPath = path.join(dir, "약속프로젝트.yaml");
		const content = await fs.promises.readFile(manifestPath);
		return Manifest.parse(content.toString());
	}

	public static parse(content: string): Manifest {
		const parsedYamlDocument = parseDocument(content);
		return new Manifest({
			yamlDoc: parsedYamlDocument,
		});
	}

	private parseDependencies(): Map<string, PackageRef> {
		const dependenciesNode = this.yamlDoc.get("의존성") as
			| YAMLMap<Scalar<string>, unknown>
			| undefined;
		if (!dependenciesNode || dependenciesNode?.items === undefined) {
			return new Map();
		}

		const dependencies = new Map<string, PackageRef>();
		for (
			const { key: name, value: packageOrderNode } of dependenciesNode.items
		) {
			let packageOrder: PackageOrder | null = null;
			if (packageOrderNode instanceof YAMLMap) {
				if (packageOrderNode.has("git")) {
					packageOrder = GitPackageOrder.deserializeFromManifest(
						packageOrderNode,
					);
				}
			}

			const ref = new PackageRef(
				name.value,
				packageOrder!,
			);
			dependencies.set(name.value, ref);
		}
		return dependencies;
	}

	public save(fs: IFs, dir: string): Promise<void> {
		const newYaml = this.yamlDoc.toString();
		return fs.promises.writeFile(
			path.join(dir, "약속프로젝트.yaml"),
			newYaml,
		);
	}

	public addDependency(
		dependency: PackageRef,
	): void {
		let dependencyNode = this.yamlDoc.get("의존성") as YAMLMap | undefined;
		if (!dependencyNode) {
			dependencyNode = new YAMLMap();
			this.yamlDoc.set("의존성", dependencyNode);
		}

		dependencyNode.set(
			dependency.name,
			dependency.packageOrder.serializeForManifest(),
		);
		this.dependencies.set(dependency.name, dependency);
	}

	public removeDependency(
		name: string,
	): void {
		const dependenciesNode = this.yamlDoc.get("의존성") as YAMLMap | undefined;
		if (!dependenciesNode) {
			return;
		}

		dependenciesNode.delete(name);
		if (dependenciesNode.items.length === 0) {
			this.yamlDoc.set("의존성", {});
		}
		this.dependencies.delete(name);
	}
}
