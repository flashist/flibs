import { ObjectTools } from "@flashist/fcore";
import { IBitmapTextStyle, Rectangle } from "pixi.js";

import {
    Text,
    BitmapText,
    IFLabelConfig,
    Graphics,
    Align,
    VAlign,
    FLabelEvent,
    AutosizeType,
    DisplayResizeTools, FLabelTools
} from "../../../../../index";

import { FLabelDefaultConfig } from "./FLabelDefaultConfig";

import { FContainer } from "../FContainer";

export class FLabel extends FContainer {

    public static DEFAULT_CONFIG: IFLabelConfig = new FLabelDefaultConfig();

    protected config: IFLabelConfig;

    protected fieldMask: Graphics;
    protected bg: Graphics;
    protected field: Text | BitmapText;

    protected _height: number;
    protected _width: number;

    protected fieldLocalBounds: Rectangle;

    constructor(config?: IFLabelConfig) {
        super(config);
    }

    protected construction(config?: IFLabelConfig): void {
        super.construction();

        this.fieldLocalBounds = new Rectangle();

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
        this.addChild(this.fieldMask);

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

    protected createField(): void {
        if (this.field) {
            this.field.parent.removeChild(this.field);
            this.field = null;
        }

        if (this.config.isBitmap) {
            let bitmapConfig = {
                fontName: this.config.fontFamily
            } as Partial<IBitmapTextStyle>;
            if (this.config.size) {
                bitmapConfig.fontSize = this.config.size;
            }
            if (this.config.color || this.config.color === 0) {
                bitmapConfig.tint = this.config.color;
            }

            this.field = new BitmapText(
                "",
                bitmapConfig
            );
        } else {
            this.field = new Text("");
        }
        this.applyStyle();

        this.addChild(this.field);
        this.field.mask = this.fieldMask;
    }

    protected applyStyle(): void {
        if (this.config.isBitmap) {
            // ToDo: implement configuring bitmap fields
            const bitmapField: BitmapText = (this.field as BitmapText);
            if (this.config.fontFamily) {
                bitmapField.fontName = this.config.fontFamily;
            }
            if (this.config.size) {
                bitmapField.fontSize = this.config.size;
            }
            if (this.config.color || this.config.color === 0) {
                bitmapField.tint = this.config.color;
            }
            if (this.config.wordWrapWidth) {
                bitmapField.maxWidth = this.config.wordWrapWidth;
            }

        } else {
            const textField: Text = (this.field as Text);
            if (this.config.fontFamily) {
                textField.style.fontFamily = this.config.fontFamily;
            }
            if (this.config.size) {
                textField.style.fontSize = this.config.size;
            }
            if (this.config.lineHeight) {
                textField.style.lineHeight = this.config.lineHeight;
            }
            if (this.config.lineJoin) {
                textField.style.lineJoin = this.config.lineJoin as any;
            }
            if (this.config.miterLimit || this.config.miterLimit === 0) {
                textField.style.miterLimit = this.config.miterLimit;
            }
            if (this.config.wordWrap || this.wordWrap === false) {
                textField.style.wordWrap = this.config.wordWrap;
            }
            if (this.config.wordWrapWidth) {
                textField.style.wordWrapWidth = this.config.wordWrapWidth;
            }

            if (this.config.color || this.config.color === 0) {
                textField.style.fill = this.config.color;
            }

            if (this.config.gradientColor) {
                textField.style.fill = this.config.gradientColor.colors;
                textField.style.fillGradientStops = this.config.gradientColor.stops;
                textField.style.fillGradientType = this.config.gradientColor.type as any;
            }

            if (this.config.bold) {
                textField.style.fontWeight = "bold";
            } else {
                textField.style.fontWeight = "normal";
            }

            if (this.config.dropShadow) {
                textField.style.dropShadow = true;

                if (this.config.dropShadowColor !== undefined) {
                    textField.style.dropShadowColor = this.config.dropShadowColor;
                }

                if (this.config.dropShadowAlpha !== undefined) {
                    textField.style.dropShadowAlpha = this.config.dropShadowAlpha;
                }

                if (this.config.dropShadowDistance !== undefined) {
                    textField.style.dropShadowDistance = this.config.dropShadowDistance;
                }

                if (this.config.dropShadowAngle !== undefined) {
                    textField.style.dropShadowAngle = this.config.dropShadowAngle;
                }

                if (this.config.dropShadowBlur !== undefined) {
                    textField.style.dropShadowBlur = this.config.dropShadowBlur;
                }

            } else {
                textField.style.dropShadow = false;
            }

            if (this.config.stroke || this.config.stroke === 0) {
                textField.style.stroke = this.config.stroke;
                if (this.config.strokeThickness) {
                    textField.style.strokeThickness = this.config.strokeThickness;
                } else {
                    this.config.strokeThickness = 0;
                }
            } else {
                textField.style.stroke = 0;
            }

            if (this.config.align) {
                textField.style.align = this.config.align as any;
            } else {
                textField.style.align = Align.LEFT as any;
            }
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
                FLabelTools.changeFontSizeToFit(this, { stepChange: this.config.changeFontSizeStepChange });

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

        this.bg.width = this._width;
        this.bg.height = this._height;

        let newX: number = this.fieldPaddingX;
        switch (this.align) {
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
        this.fieldMask.width = this._width - (this.fieldPaddingX * 2);
        this.fieldMask.height = this._height - (this.fieldPaddingY * 2);
    }


    public get isBitmap(): boolean {
        return this.config.isBitmap;
    }

    public set isBitmap(value: boolean) {
        if (value === this.config.isBitmap) {
            return;
        }

        this.config.isBitmap = value;

        this.createField();
        this.updateBg();
        this.commitData();
    }

    public get fontFamily(): string {
        return this.config.fontFamily;
    }

    public set fontFamily(value: string) {
        if (value === this.config.fontFamily) {
            return;
        }

        this.config.fontFamily = value;

        this.applyStyle();
    }

    public get color(): number {
        return this.config.color;
    }

    public set color(value: number) {
        if (value === this.config.color) {
            return;
        }

        this.config.color = value;

        this.applyStyle();
    }

    public get gradientColor(): typeof this.config.gradientColor {
        return this.config.gradientColor;
    }

    public set gradientColor(value: typeof this.config.gradientColor) {
        this.config.gradientColor = value;

        this.applyStyle();
    }

    public get size(): number {
        return this.config.size;
    }

    public set size(value: number) {
        if (value === this.config.size) {
            return;
        }

        this.config.size = value;

        this.applyStyle();
    }

    /*public get width(): number {
        return this._width;
    }

    public set width(value: number) {
        if (value === this._width) {
            return;
        }

        this._width = value;

        this.commitData();
    }*/

    /*public get height(): number {
        return this._height;
    }

    public set height(value: number) {
        if (value === this._height) {
            return;
        }

        this._height = value;

        this.commitData();
    }*/


    public get align(): Align {
        return this.config.align;
    }

    public set align(value: Align) {
        if (value === this.config.align) {
            return;
        }

        this.config.align = value;

        // this.arrange();
        this.applyStyle();
    }


    public get valign(): VAlign {
        return this.config.valign;
    }

    public set valign(value: VAlign) {
        if (value === this.config.valign) {
            return;
        }

        this.config.valign = value;

        this.arrange();
    }


    public get bgAlpha(): number {
        return this.config.bgAlpha;
    }

    public set bgAlpha(value: number) {
        if (value === this.config.bgAlpha) {
            return;
        }

        this.config.bgAlpha = value;

        this.updateBg();
        this.arrange();
    }

    public get bgColor(): number {
        return this.config.bgColor;
    }

    public set bgColor(value: number) {
        if (value === this.config.bgColor) {
            return;
        }

        this.config.bgColor = value;

        this.updateBg();
        this.arrange();
    }

    private updateBg(): void {

        const bgColor = this.config.bgColor ? this.config.bgColor : 0;
        const bgAlpha = this.config.bgAlpha ? this.config.bgAlpha : 0;

        this.bg.clear();
        this.bg.beginFill(bgColor, 1);
        this.bg.drawRect(0, 0, 10, 10);
        this.bg.endFill();
        this.bg.alpha = bgAlpha;

        this.fieldMask.clear();
        this.fieldMask.beginFill(0x00FF00, 1);
        this.fieldMask.drawRect(0, 0, 10, 10);
        this.fieldMask.endFill();
    }

    public get text(): string {
        return this.field.text;
    }

    public set text(value: string) {
        if (value === this.field.text) {
            return;
        }

        this.field.text = value;
        this.emit(FLabelEvent.TEXT_CHANGE as any);

        this.commitData();
    }

    public get autosize(): boolean {
        return this.config.autosize;
    }
    public set autosize(value: boolean) {
        if (value === this.config.autosize) {
            return;
        }

        this.config.autosize = value;

        this.arrange();
    }

    public get autosizeType(): AutosizeType {
        return this.config.autosizeType;
    }
    public set autosizeType(value: AutosizeType) {
        if (value === this.config.autosizeType) {
            return;
        }

        this.config.autosizeType = value;

        this.arrange();
    }

    public get maxAutosizeWidth(): number {
        return this.config.maxAutosizeWidth || 0;
    }
    public set maxAutosizeWidth(value: number) {
        if (value === this.config.maxAutosizeWidth) {
            return;
        }

        this.config.maxAutosizeWidth = value;

        this.arrange();
    }

    public get maxAutosizeHeight(): number {
        return this.config.maxAutosizeHeight || 0;
    }
    public set maxAutosizeHeight(value: number) {
        if (value === this.config.maxAutosizeHeight) {
            return;
        }

        this.config.maxAutosizeHeight = value;

        this.arrange();
    }


    public get fitToSize(): boolean {
        return this.config.fitToSize;
    }
    public set fitToSize(value: boolean) {
        if (value === this.config.fitToSize) {
            return;
        }

        this.config.fitToSize = value;

        this.arrange();
    }

    public get changeFontSizeToFit(): boolean {
        return this.config.changeFontSizeToFit;
    }
    public set changeFontSizeToFit(value: boolean) {
        if (value === this.config.changeFontSizeToFit) {
            return;
        }

        this.config.changeFontSizeToFit = value;

        this.arrange();
    }

    get textWidth() {
        if (this.isBitmap) {
            // return (this.field as BitmapText).textWidth;
            return this.fieldLocalBounds.x + this.fieldLocalBounds.width;
        } else {
            return this.field.width / this.field.scale.x;
        }
    }

    get textHeight() {
        if (this.isBitmap) {
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

    get bold(): boolean {
        return this.config.bold;
    }

    set bold(value: boolean) {
        if (this.config.bold === value) {
            return;
        }

        this.config.bold = value;

        this.applyStyle();
    }

    get dropShadow(): boolean {
        return this.config.dropShadow;
    }

    set dropShadow(value: boolean) {
        if (this.config.dropShadow === value) {
            return;
        }

        this.config.dropShadow = value;

        this.applyStyle();
    }

    get stroke(): number {
        return this.config.stroke;
    }

    set stroke(value: number) {
        if (this.config.stroke === value) {
            return;
        }

        this.config.stroke = value;

        this.applyStyle();
    }

    get strokeThickness(): number {
        return this.config.strokeThickness;
    }

    set strokeThickness(value: number) {
        if (this.config.strokeThickness === value) {
            return;
        }

        this.config.strokeThickness = value;

        this.applyStyle();
    }


    get fieldPaddingX(): number {
        return this.config.fieldPaddingX || 0;
    }
    set fieldPaddingX(value: number) {
        if (this.config.fieldPaddingX === value) {
            return;
        }

        this.config.fieldPaddingX = value;

        this.arrange();
    }

    get fieldPaddingY(): number {
        return this.config.fieldPaddingY || 0;
    }
    set fieldPaddingY(value: number) {
        if (this.config.fieldPaddingY === value) {
            return;
        }

        this.config.fieldPaddingY = value;

        this.arrange();
    }

    get wordWrap(): boolean {
        return this.config.wordWrap;
    }
    set wordWrap(value: boolean) {
        if (this.config.wordWrap === value) {
            return;
        }

        this.config.wordWrap = value;

        this.applyStyle();
    }

    get wordWrapWidth(): number {
        return this.config.wordWrapWidth;
    }
    set wordWrapWidth(value: number) {
        if (this.config.wordWrapWidth === value) {
            return;
        }

        this.config.wordWrapWidth = value;

        this.applyStyle();
    }

    public get engineField(): any {
        return this.field;
    }
}