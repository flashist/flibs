import {
    DisplayObject,
    DisplayObjectContainer,
    FStage,
    IFDisplayObjectUnderPointVO,
    Rectangle
} from "../../../../../index";
import {Point} from "../../../../../geom/pixijs/Point";

export class FDisplayTools {

    private static cachedPoint: Point = new Point();

    static findStageInDisplayList(object: DisplayObject): FStage {
        let result: FStage;

        let tempParent: DisplayObjectContainer = object.parent;
        while (tempParent) {
            if (FStage.isFStage(tempParent)) {
                result = (tempParent as FStage);
                break;
            } else {
                tempParent = tempParent.parent;
            }
        }

        return result;
    }

    public static getObjectsUnderPoint(
        root: DisplayObject,
        x: number,
        y: number,
        filter: (object: DisplayObject) => boolean = null): IFDisplayObjectUnderPointVO {

        let result: IFDisplayObjectUnderPointVO;

        if (root.visible && root.renderable) {
            let rootContainer: DisplayObjectContainer = root as DisplayObjectContainer;
            // If the object is a container
            if (rootContainer.children && rootContainer.children.length > 0) {
                let tempChildren: IFDisplayObjectUnderPointVO[] = [];
                let tempChild: any;
                let tempChildResult: any;
                let childrenCount: number = rootContainer.children.length;
                for (let childIndex: number = 0; childIndex < childrenCount; childIndex++) {
                    tempChild = rootContainer.children[childIndex];
                    if (!filter || filter(tempChild)) {
                        tempChildResult = this.getObjectsUnderPoint(tempChild, x, y);
                        if (tempChildResult) {
                            tempChildren.push(tempChildResult);
                        }
                    }
                }

                // The container might be added only if at least one of its children is under cursor
                if (tempChildren.length > 0) {
                    result = {object: root, children: tempChildren};
                }

                // If the object isn't a container
            } else {

                let isUnderPoint: boolean = false;
                if ((root as any).containsPoint) {
                    this.cachedPoint.x = x;
                    this.cachedPoint.y = y;
                    if ((root as any).containsPoint(this.cachedPoint)) {
                        isUnderPoint = true;
                    }

                } else {
                    let tempBounds: Rectangle = root.getBounds();
                    if (tempBounds.contains(x, y)) {
                        isUnderPoint = true;
                    }
                }

                if (isUnderPoint) {
                    result = {object: root};
                }
            }
        }

        return result;
    }
}