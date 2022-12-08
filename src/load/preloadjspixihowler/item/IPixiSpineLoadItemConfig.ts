export interface IPixiSpineLoadItemConfig {
    src: string;

    id: string;
    basePath?: string;
    fileType?: string;
    extensions?: string[];

    priority?: number;
    loader?: string;
    loadGroups?: string[];

    uniqueId?: string;

    loadWeight?: number;

}