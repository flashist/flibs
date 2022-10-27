import {
    Point
} from "../../index";

export class HtmlTools {
    static getDocumentSize(): Point {
        return new Point(
            Math.max(document.documentElement.clientWidth, window.innerWidth),
            Math.max(document.documentElement.clientHeight, window.innerHeight)
        )
    }

    static createElementFromHTMLString(htmlString: string): ChildNode {
        var div: HTMLElement = document.createElement('div');
        div.innerHTML = htmlString.trim();

        // Change this to div.childNodes to support multiple top-level nodes.
        return div.firstChild;
    }
}