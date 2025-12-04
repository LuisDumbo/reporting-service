export abstract class BaseModel<T> {
    protected items: T[] = [];

    findAll(): T[] {
        return this.items;
    }

    create(item: T): T {
        this.items.push(item);
        return item;
    }
}
