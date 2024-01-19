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

    static checkIfElementIsParentOf(element: Node, targetParent: Node, maxIterations: number = 50): boolean {
        let result: boolean = false;

        let curIteraction: number = 0;
        let curParent: Node = element.parentNode;
        while (curParent) {
            if (curParent === targetParent) {
                result = true;
                break;
            }

            curParent = curParent.parentElement;

            curIteraction++;
            if (curIteraction >= maxIterations) {
                break;
            }
        }

        return result;
    }

    static scaleElement(element: HTMLElement, scale: number, xShift: number = 0, yShift: number = 0): void {
        element.style["transform"] = `scale(${scale})`;
        element.style["transform-origin"] = `${xShift} ${yShift}`;
        element.style["-ms-zoom"] = scale;
        element.style["-moz-transform"] = `scale(${scale})`;
        element.style["-moz-transform-origin"] = `${xShift} ${yShift}`;
        element.style["-o-transform"] = `scale(${scale})`;
        element.style["-o-transform-origin"] = `${xShift} ${yShift}`;
        element.style["-webkit-transform"] = `scale(${scale})`;
        element.style["-webkit-transform-origin"] = `${xShift} ${yShift}`;
    }
}