export interface ILoadItemConfig {
    src: string;

    id: string;
    basePath?: string;
    fileType?: string;
    extensions?: string[];

    priority?: number;
    loader?: string;
    loadGroups?: string[];
    tags?: string[];

    uniqueId?: string;

    loadWeight?: number;

    dependencies?: ILoadItemConfig[];

}