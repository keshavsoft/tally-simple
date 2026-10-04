export interface TallyClientOptions {
    url?: string;
    method?: string;
    headers?: Record<string, string>;
    timeout?: number;
    fetch?: (url: string, options: {
        method: string;
        headers: Record<string, string>;
        body: string;
        signal?: unknown;
    }) => Promise<{
        ok: boolean;
        status: number;
        text: () => Promise<string>;
    }>;
}

export type TallyApi = {
    masters: {
        units: {
            fetch: (company: string) => Promise<string>;
        };
        stockItems: {
            withBatches: (company: string) => Promise<string>;
        };
        ledgers: {
            withGstDetails: (company: string) => Promise<string>;
        };
    };
};

declare const tally: TallyApi;

export declare const createTallyClient: (options?: TallyClientOptions) => TallyApi;
export declare const tally: TallyApi;
export default tally;
