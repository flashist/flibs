export class URLTools {
    // static getDocumentSize(): Point {
    //     return new Point(
    //         Math.max(document.documentElement.clientWidth, window.innerWidth),
    //         Math.max(document.documentElement.clientHeight, window.innerHeight)
    //     )
    // }
    private static retrieveAllGetParams(): URLSearchParams {
        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        return urlParams;
    }

    static retrieveSingleGetParam(name: string): any {
        const urlParams = URLTools.retrieveAllGetParams();
        return urlParams.get(name);
    }
}