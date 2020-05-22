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
    mergeOptions: import("fiery-data").FieryMergeStrategies;
    mergeStrategy: import("fiery-data").FieryMergeStrategies;
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
        onInvalidOperation(_data: import("fiery-data").FieryData, _operation: string): void;
        onUpdate(_data: import("fiery-data").FieryData, _values: import("fiery-data").FieryData, _cache: import("fiery-data").FieryCacheEntry): void;
        onSet(_data: import("fiery-data").FieryData, _values: import("fiery-data").FieryData, _cache: import("fiery-data").FieryCacheEntry): void;
        onDelete(_data: import("fiery-data").FieryData, _cache: import("fiery-data").FieryCacheEntry): void;
        onClear(_data: import("fiery-data").FieryData, _props: string[]): void;
        onGetChanges(_data: import("fiery-data").FieryData, _cache: import("fiery-data").FieryCacheEntry, _fields?: string[] | undefined): void;
        onRefresh(_data: import("fiery-data").FieryData, _cachedOnly?: boolean | undefined): void;
        onBuild(_data: import("fiery-data").FieryData, _cache: import("fiery-data").FieryCacheEntry): void;
        onCacheCreate(_cache: import("fiery-data").FieryCacheEntry): void;
        onCacheDestroy(_cache: import("fiery-data").FieryCacheEntry): void;
        onSubCreate(_data: import("fiery-data").FieryData, _sub: string, _cache: import("fiery-data").FieryCacheEntry): void;
        onSubDestroy(_data: import("fiery-data").FieryData, _sub: string, _cache: import("fiery-data").FieryCacheEntry): void;
        onCollectionAdd(_data: import("fiery-data").FieryData, _target: import("fiery-data").FieryTarget, _entry: import("fiery-data").FieryEntry): void;
        onCollectionRemove(_data: import("fiery-data").FieryData, _target: import("fiery-data").FieryTarget, _entry: import("fiery-data").FieryEntry): void;
        onCollectionModify(_data: import("fiery-data").FieryData, _target: import("fiery-data").FieryTarget, _entry: import("fiery-data").FieryEntry): void;
        onCollectionChanged(_target: import("fiery-data").FieryTarget, _entry: import("fiery-data").FieryEntry): void;
        onDocumentUpdate(_data: import("fiery-data").FieryData, _entry: import("fiery-data").FieryEntry): void;
        onDocumentMissing(_data: import("fiery-data").FieryData, _entry: import("fiery-data").FieryEntry): void;
        onInstanceCreate(_instance: FieryInstance): void;
        onInstanceDestroy(_instance: FieryInstance): void;
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
