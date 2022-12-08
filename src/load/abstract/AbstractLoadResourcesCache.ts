export class LoadResourcesCache {
    private static _instance: LoadResourcesCache;

    private static cache: {[key: string]: any} = {};

    static add(id: string, data: any): void {
        LoadResourcesCache.cache[id] = data;
    }

    static get(id: string): any {
        return LoadResourcesCache.cache[id];
    }

    static remove(id: string): void {
        delete LoadResourcesCache.cache[id];
    }

    static reset(): void {
        // TODO: reset all cache information
        LoadResourcesCache.cache = {};
    }
}