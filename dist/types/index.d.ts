import { define, setGlobalOptions, destroyGlobalCache, getCacheForData, getOptions, FieryInstance, FierySources } from 'fiery-data';
export interface FieryVue {
    $fiery: FieryInstance;
    $fires: FierySources;
    [prop: string]: any;
    $delete: (object: any, key: string | number) => any;
    $set: (object: any, key: string | number, value?: any) => any;
}
export declare function init(this: FieryVue): void;
export declare function link(this: FieryVue): void;
export declare function destroy(this: FieryVue): void;
export declare const plugin: {
    mergeOptions: import("fiery-data/dist/types/types").FieryMergeStrategies;
    mergeStrategy: import("fiery-data/dist/types/types").FieryMergeStrategies;
    define: typeof define;
    setGlobalOptions: typeof setGlobalOptions;
    getOptions: typeof getOptions;
    stats: {
        queries: number;
        reads: number;
        deletes: number;
        updates: number;
        sets: number;
        writes: number;
    };
    callbacks: {
        onInvalidOperation(data: import("fiery-data/dist/types/types").FieryData, operation: string): void;
        onUpdate(data: import("fiery-data/dist/types/types").FieryData, values: import("fiery-data/dist/types/types").FieryData, cache: import("fiery-data/dist/types/types").FieryCacheEntry): void;
        onSet(data: import("fiery-data/dist/types/types").FieryData, values: import("fiery-data/dist/types/types").FieryData, cache: import("fiery-data/dist/types/types").FieryCacheEntry): void;
        onDelete(data: import("fiery-data/dist/types/types").FieryData, cache: import("fiery-data/dist/types/types").FieryCacheEntry): void;
        onClear(data: import("fiery-data/dist/types/types").FieryData, props: string[]): void;
        onGetChanges(data: import("fiery-data/dist/types/types").FieryData, cache: import("fiery-data/dist/types/types").FieryCacheEntry, fields?: string[] | undefined): void;
        onRefresh(data: import("fiery-data/dist/types/types").FieryData, cachedOnly?: boolean | undefined): void;
        onBuild(data: import("fiery-data/dist/types/types").FieryData, cache: import("fiery-data/dist/types/types").FieryCacheEntry): void;
        onCacheCreate(cache: import("fiery-data/dist/types/types").FieryCacheEntry): void;
        onCacheDestroy(cache: import("fiery-data/dist/types/types").FieryCacheEntry): void;
        onSubCreate(data: import("fiery-data/dist/types/types").FieryData, sub: string, cache: import("fiery-data/dist/types/types").FieryCacheEntry): void;
        onSubDestroy(data: import("fiery-data/dist/types/types").FieryData, sub: string, cache: import("fiery-data/dist/types/types").FieryCacheEntry): void;
        onCollectionAdd(data: import("fiery-data/dist/types/types").FieryData, target: import("fiery-data/dist/types/types").FieryTarget, entry: import("fiery-data/dist/types/types").FieryEntry): void;
        onCollectionRemove(data: import("fiery-data/dist/types/types").FieryData, target: import("fiery-data/dist/types/types").FieryTarget, entry: import("fiery-data/dist/types/types").FieryEntry): void;
        onCollectionModify(data: import("fiery-data/dist/types/types").FieryData, target: import("fiery-data/dist/types/types").FieryTarget, entry: import("fiery-data/dist/types/types").FieryEntry): void;
        onCollectionChanged(target: import("fiery-data/dist/types/types").FieryTarget, entry: import("fiery-data/dist/types/types").FieryEntry): void;
        onDocumentUpdate(data: import("fiery-data/dist/types/types").FieryData, entry: import("fiery-data/dist/types/types").FieryEntry): void;
        onDocumentMissing(data: import("fiery-data/dist/types/types").FieryData, entry: import("fiery-data/dist/types/types").FieryEntry): void;
        onInstanceCreate(instance: FieryInstance): void;
        onInstanceDestroy(instance: FieryInstance): void;
    };
    getCacheForData: typeof getCacheForData;
    destroyGlobalCache: typeof destroyGlobalCache;
    constants: {
        PROP_VALUE: string;
        PROP_UID: string;
        UID_SEPARATOR: string;
        ENTRY_SEPARATOR: string;
        PATH_SEPARATOR: string;
        RECORD_OPTIONS: {
            refresh: string;
            sync: string;
            update: string;
            save: string;
            remove: string;
            ref: string;
            clear: string;
            build: string;
            create: string;
            getChanges: string;
        };
        EVENTS_OPTIONS: {
            create: string;
            missing: string;
            update: string;
            remove: string;
            destroy: string;
        };
    };
    install(Vue: any): void;
};
export default plugin;
