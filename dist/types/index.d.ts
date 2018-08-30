import { define, setGlobalOptions, FieryInstance, FierySources } from 'fiery-data';
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
    stats: {
        queries: number;
        reads: number;
        deletes: number;
        updates: number;
        sets: number;
        writes: number;
    };
    install(Vue: any): void;
};
export default plugin;
