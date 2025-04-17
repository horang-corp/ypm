import type { PackageRef } from "./package_ref";

export abstract class Source {
	public abstract downloadPackage(
		packageOrder: PackageOrder,
	): Promise<PackageRef>;
}

export abstract class PackageOrder {
	public abstract serializeForManifest(): unknown;
	public static deserializeFromManifest(
		data: unknown,
	): PackageOrder {
		throw new Error("Not implemented");
	}
}
