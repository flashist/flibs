import { ObjectTools } from "@flashist/fcore";
import { TextStyle, Rectangle, Bounds, StrokeStyle, StrokeInput } from "pixi.js";

import {
    Text,
    BitmapText,
    IFLabelConfig,
    Graphics,
    Align,
    VAlign,
    FLabelEvent,
    AutosizeType,
    DisplayResizeTools,
    FLabelTools,
    HTMLText
} from "../../../../../index";

import { TextDropShadow } from "./TextDropShadow";

import { FLabelDefaultConfig } from "./FLabelDefaultConfig";

import { FContainer } from "../FContainer";
import { FLabelTextType } from "./FLabelTextType";

export class FLabel extends FContainer {

    public static DEFAULT_CONFIG: IFLabelConfig = new FLabelDefaultConfig();

    protected config: IFLabelConfig;

    protected fieldMask: Graphics;
    protected bg: Graphics;
    protected field: Text | BitmapText | HTMLText;

    protected _height: number;
    protected _width: number;

    protected fieldLocalBounds: Bounds;

    protected _text: string;

    constructor(config?: IFLabelConfig) {
        super(config);
    }

    protected construction(config?: IFLabelConfig): void {
        super.construction();

        this.fieldLocalBounds = new Bounds();

        this._text = "";

        // Properties overriding
        //
        // width
        Object.defineProperty(
            this,
            "width",
            {
                get() {
                    return this._width;
                },
                set(value: number) {
                    if (value === this._width) {
                        return;
                    }

                    this._width = value;

                    this.applyStyle();
                }
            }
        );

        // height
        Object.defineProperty(
            this,
            "height",
            {
                get() {
                    return this._height;
                },
                set(value: number) {
                    if (value === this._height) {
                        return;
                    }

                    this._height = value;

                    this.applyStyle();
                }
            }
        );

        if (!config) {
            config = {};
        }
        if (!config.nativeTextStyle) {
            config.nativeTextStyle = {}
        }

        this.config = config;
        ObjectTools.copyProps(
            this.config,
            FLabel.DEFAULT_CONFIG,
            {
                ignoreExistedProperties: true
            }
        );

        this.bg = new Graphics();
        this.addChild(this.bg);

        this.fieldMask = new Graphics();
        // this.addChild(this.fieldMask);
        //
        this.fieldMask.rect(0, 0, 10, 10);
        this.fieldMask.fill({ color: 0x00FF00, alpha: 1 });
        // this.fieldMask.endFill();
        //
        // TEMPORARY: in pixi v8 the mask logic stopped working =(
        this.fieldMask.alpha = 0;

        this.createField();
        // First size initialization
        this._width = this.field.width;
        this._height = this.field.height;

        this.updateBg();
    }

    public destruction(): void {
        super.destruction();

        if (this.field) {
            this.field.destroy();
        }
    }

    protected onAddedToStage(): void {
        super.onAddedToStage();

        this.applyText();
    }

    protected createField(): void {
        if (this.field) {
            this.field.parent.removeChild(this.field);
            this.field = null;
        }

        if (this.config.textType === FLabelTextType.BITMAP) {
            // let bitmapConfig: TextOptions = {
            //     style: {
            //         fontFamily: this.config.fontFamily
            //     }
            // };

            // if (this.config.size) {
            //     bitmapConfig.fontSize = this.config.size;
            // }
            // if (this.config.color || this.config.color === 0) {
            //     bitmapConfig.fill = this.config.color;
            // }

            this.field = new BitmapText();

        } else if (this.config.textType === FLabelTextType.HTML_TEXT) {
            this.field = new HTMLText();
        } else {
            this.field = new Text();
        }
        this.applyStyle();

        this.addChild(this.field);
        // TEMPORARY: in pixi v8 this stopped working =(
        // this.field.mask = this.fieldMask;
    }

    protected applyStyle(): void {

        if (this.config.nativeTextStyle) {
            this.field.style = this.config.nativeTextStyle;
        }

        this.arrange();
    }

    protected commitData(): void {
        super.commitData();

        this.arrange();
    }

    protected arrange(): void {
        super.arrange();

        // Reset Field Scale
        this.field.scale.set(1);
        //
        this.fieldLocalBounds = this.field.getLocalBounds();

        if (this.autosize) {
            if (!this.autosizeType || this.autosizeType === AutosizeType.BOTH || this.autosizeType === AutosizeType.WIDTH) {
                // this._width = this.field.width + (this.fieldPaddingX * 2);
                this._width = this.textWidth + (this.fieldPaddingX * 2);
                if (this.maxAutosizeWidth) {
                    this._width = Math.min(this._width, this.maxAutosizeWidth);
                }
            }

            if (!this.autosizeType || this.autosizeType === AutosizeType.BOTH || this.autosizeType === AutosizeType.HEIGHT) {
                // this._height = this.field.height + (this.fieldPaddingY * 2);
                this._height = this.textHeight + (this.fieldPaddingY * 2);
                if (this.maxAutosizeHeight) {
                    this._height = Math.min(this._height, this.maxAutosizeHeight);
                }
            }
        }

        let tempFieldScale: number = 1;
        if (this.fitToSize) {
            // IMPORTANT: this is a performance-requiring task!
            if (this.changeFontSizeToFit) {
                // Temporarily disable the fit-to-size feature in order to set the base-size for the field,
                // this is needed because we need to change size of the font of the field
                // starting from the base-value (because otherwise the resize behaviour
                // will be done from the latest fit-to-size value, not from the base value)
                this.config.fitToSize = false;
                // this.config.size = this.config.changeFontSizeToFitStartSize;
                this.config.nativeTextStyle.fontSize = this.config.changeFontSizeToFitStartSize;
                //
                this.applyStyle();
                //
                FLabelTools.changeFontSizeToFit(this, { stepChange: this.config.changeFontSizeStepChange });

                // Turn the fit-to-size feature back, so in the future the fit-to-size behaviour will be working in a regular way
                this.config.fitToSize = true;

            } else {
                tempFieldScale = DisplayResizeTools.getScale(
                    this.textWidth,
                    this.textHeight,
                    this.textAvailableWidth,
                    this.textAvailableHeight
                );
            }
        }

        this.field.scale.set(tempFieldScale);
        //
        this.fieldLocalBounds = this.field.getLocalBounds();

        // this.bg.width = this._width;
        // this.bg.height = this._height;
        this.updateBg();

        let newX: number = this.fieldPaddingX;
        switch (this.config.nativeTextStyle.align) {
            case Align.CENTER:
                newX = Math.floor((this._width - (this.textWidth * this.field.scale.x)) * 0.5);
                break;
            case Align.RIGHT:
                newX = Math.floor(this._width - (this.textWidth * this.field.scale.x)) - this.fieldPaddingX;
                break;
        }
        this.field.x = newX;

        let newY: number = this.fieldPaddingY;
        switch (this.valign) {
            case VAlign.MIDDLE:
                newY = Math.floor((this._height - (this.textHeight * this.field.scale.y)) * 0.5);
                break;
            case VAlign.BOTTOM:
                newY = Math.floor(this._height - (this.textHeight * this.field.scale.y)) - this.fieldPaddingY;
                break;
        }
        this.field.y = newY;

        this.fieldMask.x = this.fieldPaddingX;
        this.fieldMask.y = this.fieldPaddingY;
        this.fieldMask.width = this.fieldMaskWidth;
        this.fieldMask.height = this.fieldMaskHeight;
    }

    public get fieldMaskWidth(): number {
        return this._width - (this.fieldPaddingX * 2) + this.maskToFieldShiftWidth;
    }

    public get fieldMaskHeight(): number {
        return this._height - (this.fieldPaddingY * 2) + this.maskToFieldShiftHeight;
    }

    public get valign(): VAlign {
        return this.config.valign;
    }

    public get size(): number {
        return this.config.nativeTextStyle.fontSize;
    }

    // public set valign(value: VAlign) {
    //     if (value === this.config.valign) {
    //         return;
    //     }

    //     this.config.valign = value;

    //     this.arrange();
    // }


    public get bgAlpha(): number {
        return this.config.bgAlpha;
    }

    // public set bgAlpha(value: number) {
    //     if (value === this.config.bgAlpha) {
    //         return;
    //     }

    //     this.config.bgAlpha = value;

    //     // this.updateBg();
    //     this.arrange();
    // }

    public get bgColor(): number {
        return this.config.bgColor;
    }

    // public set bgColor(value: number) {
    //     if (value === this.config.bgColor) {
    //         return;
    //     }

    //     this.config.bgColor = value;

    //     // this.updateBg();
    //     this.arrange();
    // }

    public get bgStrokeStyle(): StrokeInput {
        return this.config.bgStrokeStyle;
    }

    // public set bgStrokeStyle(value: StrokeInput) {
    //     if (ObjectTools.checkIfEqual(value, this.config.bgStrokeStyle)) {
    //         return;
    //     }

    //     this.config.bgStrokeStyle = value;

    //     // this.updateBg();
    //     this.arrange();
    // }

    private updateBg(): void {

        const bgColor = this.config.bgColor || 0;
        const bgAlpha = this.config.bgAlpha || 0;
        const bgCornerRadius = this.config.bgCornerRadius || 0;

        this.bg.clear();

        this.bg.roundRect(0, 0, this._width, this._height, bgCornerRadius);
        this.bg.fill({ color: bgColor, alpha: 1 });
        // this.bg.endFill();

        if (this.bgStrokeStyle) {
            this.bg.stroke(this.bgStrokeStyle);
        }

        this.bg.alpha = bgAlpha;
    }

    public get text(): string {
        return this._text;
    }

    public set text(value: string) {
        if (value === undefined) {
            value = "";
        }

        if (value === this.field.text) {
            return;
        }

        this._text = value;
        this.emit(FLabelEvent.TEXT_CHANGE);

        this.applyText();
    }

    protected applyText(): void {
        this.field.text = this._text;
        this.commitData();
    }

    public get autosize(): boolean {
        return this.config.autosize;
    }
    // public set autosize(value: boolean) {
    //     if (value === this.config.autosize) {
    //         return;
    //     }

    //     this.config.autosize = value;

    //     this.arrange();
    // }

    public get autosizeType(): AutosizeType {
        return this.config.autosizeType;
    }
    // public set autosizeType(value: AutosizeType) {
    //     if (value === this.config.autosizeType) {
    //         return;
    //     }

    //     this.config.autosizeType = value;

    //     this.arrange();
    // }

    public get maxAutosizeWidth(): number {
        return this.config.maxAutosizeWidth || 0;
    }
    // public set maxAutosizeWidth(value: number) {
    //     if (value === this.config.maxAutosizeWidth) {
    //         return;
    //     }

    //     this.config.maxAutosizeWidth = value;

    //     this.arrange();
    // }

    public get maxAutosizeHeight(): number {
        return this.config.maxAutosizeHeight || 0;
    }
    // public set maxAutosizeHeight(value: number) {
    //     if (value === this.config.maxAutosizeHeight) {
    //         return;
    //     }

    //     this.config.maxAutosizeHeight = value;

    //     this.arrange();
    // }


    public get fitToSize(): boolean {
        return this.config.fitToSize;
    }
    // public set fitToSize(value: boolean) {
    //     if (value === this.config.fitToSize) {
    //         return;
    //     }

    //     this.config.fitToSize = value;

    //     this.arrange();
    // }

    public get changeFontSizeToFit(): boolean {
        return this.config.changeFontSizeToFit;
    }
    // public set changeFontSizeToFit(value: boolean) {
    //     if (value === this.config.changeFontSizeToFit) {
    //         return;
    //     }

    //     this.config.changeFontSizeToFit = value;

    //     this.arrange();
    // }

    get textWidth() {
        if (this.config.textType === FLabelTextType.BITMAP) {
            // return (this.field as BitmapText).textWidth;
            return this.fieldLocalBounds.x + this.fieldLocalBounds.width;
        } else {
            return this.field.width / this.field.scale.x;
        }
    }

    get textHeight() {
        if (this.config.textType === FLabelTextType.BITMAP) {
            // return (this.field as BitmapText).textHeight;
            return this.fieldLocalBounds.y + this.fieldLocalBounds.height;
        } else {
            return this.field.height / this.field.scale.y;
        }
    }

    get textAvailableWidth(): number {
        return this.width - (this.fieldPaddingX * 2);
    }
    get textAvailableHeight(): number {
        return this.height - (this.fieldPaddingY * 2);
    }

    get fieldPaddingX(): number {
        return this.config.fieldPaddingX || 0;
    }
    // set fieldPaddingX(value: number) {
    //     if (this.config.fieldPaddingX === value) {
    //         return;
    //     }

    //     this.config.fieldPaddingX = value;

    //     this.arrange();
    // }

    get fieldPaddingY(): number {
        return this.config.fieldPaddingY || 0;
    }
    // set fieldPaddingY(value: number) {
    //     if (this.config.fieldPaddingY === value) {
    //         return;
    //     }

    //     this.config.fieldPaddingY = value;

    //     this.arrange();
    // }

    get maskToFieldShiftWidth(): number {
        return this.config.maskToFieldShiftWidth || 0;
    }
    // set maskToFieldShiftWidth(value: number) {
    //     if (this.config.maskToFieldShiftWidth === value) {
    //         return;
    //     }

    //     this.config.maskToFieldShiftWidth = value;

    //     this.arrange();
    // }

    get maskToFieldShiftHeight(): number {
        return this.config.maskToFieldShiftHeight || 0;
    }
    // set maskToFieldShiftHeight(value: number) {
    //     if (this.config.maskToFieldShiftHeight === value) {
    //         return;
    //     }

    //     this.config.maskToFieldShiftHeight = value;

    //     this.arrange();
    // }

    // get wordWrap(): boolean {
    //     return this.config.wordWrap;
    // }
    // set wordWrap(value: boolean) {
    //     if (this.config.wordWrap === value) {
    //         return;
    //     }

    //     this.config.wordWrap = value;

    //     this.applyStyle();
    // }

    // get wordWrapWidth(): number {
    //     return this.config.wordWrapWidth;
    // }
    // set wordWrapWidth(value: number) {
    //     if (this.config.wordWrapWidth === value) {
    //         return;
    //     }

    //     this.config.wordWrapWidth = value;

    //     this.applyStyle();
    // }

    public get nativeField(): any {
        return this.field;
    }

    public changeConfig(value: Partial<IFLabelConfig>): void {


        // First of all make a deep copy of the external config
        // to make sure we're not changing it afterwards (and only change the deep-copy version)
        value = ObjectTools.clone(value);
        // Remove the native style from the main changing value,
        // to make sure the native style config is not substituting the existing config,
        // but is overriding existing properties if they exist
        // (and leaves the properties that are not overridden without changes)
        let nativeStyleTempCopy = value.nativeTextStyle;
        delete value.nativeTextStyle;
        // Here we copy all changes without the native style config
        ObjectTools.copyProps(this.config, value);

        // Here we apply the native style config only
        if (nativeStyleTempCopy) {
            ObjectTools.copyProps(this.config.nativeTextStyle, nativeStyleTempCopy);
        }

        // this.updateBg();
        this.applyStyle();
    }

    // public changeNativeStyle(value: Partial<TextStyle>): void {
    //     ObjectTools.copyProps(this.config.nativeTextStyle, value);

    //     this.applyStyle();
    // }
}