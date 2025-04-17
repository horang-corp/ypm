import type { PackageOrder } from "./source";

export class PackageRef {
	constructor(
		public readonly name: string,
		public readonly packageOrder: PackageOrder,
	) {}
}
