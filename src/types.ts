export interface AnyObject {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface PackageAuthor {
    name: string;
    email?: string;
    website?: string;
}

export interface Package {
    name?: string;
    version?: string;
    description?: string;
    main?: string;
    scripts?: {
        [key: string]: string;
    };
    keywords?: string[];
    license?: string;
    types?: string;
    author?: string | PackageAuthor;
    repository?: {
        type: string;
        url: string;
    };
    bugs?: {
        url: string;
    };
    homepage?: string;
    dependencies?: {
        [key: string]: string;
    };
    devDependencies?: {
        [key: string]: string;
    };
    peerDependencies?: {
        [key: string]: string;
    };
    [key: string]: unknown;
}
