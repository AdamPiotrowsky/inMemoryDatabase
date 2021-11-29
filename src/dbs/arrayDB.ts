import { MapMinimalRecord } from "src/types";
import { BaseDB } from "./BaseDB";

export class ArrayDB<
  DataType extends MapMinimalRecord
> extends BaseDB<DataType> {
  protected db: DataType[];
  public constructor() {
    super();
    this.db = [];
  }
  get(id: keyof any): DataType | undefined {
    if (id) {
      for (const item of this.db) {
        if (item.id === id) return item;
      }
    }
    return undefined;
  }
  push(item: DataType): void {
    this.pubSub.beforeAddToDbListeners.publish({
      newValue: item,
    });
    try {
      this.db.push(item);
    } catch (error) {
      throw new Error("push error");
    }
    this.pubSub.afterAddToDbListeners.publish({ newValue: item });
  }
  visit(cb: (item: DataType) => void): void {
    this.db.forEach((el) => cb(el));
  }
  clear() {
    this.db = [];
  }
}
