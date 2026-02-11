declare module 'translate-google-api' {
    interface TranslateOptions {
        tld?: string;
        to?: string;
        from?: string;
    }

    function translate(
        text: string | string[],
        options?: TranslateOptions
    ): Promise<string[]>;

    export default translate;
}
