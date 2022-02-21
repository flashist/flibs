import {DisplayObjectContainer, DisplayObject} from "../../../../index";

export class DisplayTools {
    public static removeAllChildren(container: DisplayObjectContainer): void {
        while (container.children.length > 0) {
            container.removeChildAt(0);
        }
    }

    public static childRemoveItselfFromParent(child: DisplayObject): void {
        if (!child || !child.parent) {
            return;
        }

        child.parent.removeChild(child);
    }

    public static moveObjectToTopLayer(object: DisplayObject): void {
        if (!object || !object.parent) {
            return;
        }

        object.parent.setChildIndex(object, object.parent.children.length - 1);
    }

    public static safeAddChildAt(container: DisplayObjectContainer,
                                 child: DisplayObject,
                                 index: number): void {
        if (index < 0) {
            index = 0;
        } else if (index > container.children.length) {
            index = container.children.length;
        }

        container.addChildAt(child, index);
    }


    static findParentInDisplayList(
        object: DisplayObject,
        condition: (object: DisplayObjectContainer) => boolean,
        filter: (object: DisplayObject) => boolean = null): DisplayObjectContainer {

        let result: DisplayObjectContainer;

        let tempParent: DisplayObjectContainer = object.parent;
        while (tempParent) {
            if (!filter || filter(tempParent)) {
                if (condition(tempParent)) {
                    result = tempParent;
                    break;

                } else {
                    tempParent = tempParent.parent;
                }

            } else {
                // Stop looking for a class, because one of the parent classes doesn't pass the filter func
                break;
            }
        }

        return result;

    }

    /*public static findChildByName<ChildType extends IDisplayObjectWrapper>(container:IDisplayObjectContainerWrapper,
     childName:string,
     isRecursive:boolean):ChildType {
     var result:ChildType = EngineAdapter.instance.findChildByName<ChildType>(container.object, childName, isRecursive);
     return result;
     }*/

    /*public static findChildrenByNamePart<ChildType extends IDisplayObjectWrapper>(container:IDisplayObjectContainerWrapper,
     namePart:string,
     isRecursive:boolean):DisplayObjectWithNameVO<ChildType>[] {

     var result:DisplayObjectWithNameVO<ChildType>[] = EngineAdapter.instance.findChildrenByNamePart<ChildType>(
     container.object,
     namePart,
     isRecursive
     );

     return result;
     }


     /!*public static scaleObject(object:IDisplayObjectContainerWrapper,
     width:number,
     height:number,
     isNeedIncreaseSize:boolean = false,
     scaleByMinSide:boolean = true):void {

     if (object.width <= 0 || object.height <= 0) {
     return;
     }

     if (!isNeedIncreaseSize && object.width <= width && object.height <= height) {
     return;
     }

     var maxDelta:number = width / height;
     var objDelta:number = object.width / object.height;

     if ((objDelta > maxDelta && scaleByMinSide) || (objDelta <= maxDelta && !scaleByMinSide)) {
     object.width = width;
     object.scaleY = object.scaleX;

     } else {
     object.height = height;
     object.scaleX = object.scaleY;
     }
     }*!/*/
}