import { ObjectTools } from "@flashist/fcore";

import {
    Text,
    BitmapText,
    IFLabelConfig,
    Graphics,
    FContainer,
    Align,
    VAlign,
    FLabelEvent,
    Point,
    AutosizeType,
    FLabelDefaultConfig,
    DisplayResizeTools
} from "../../../../../index";

export class FLabel extends FContainer {

    public static DEFAULT_CONFIG: IFLabelConfig = new FLabelDefaultConfig();

    protected config: IFLabelConfig;

    protected fieldMask: Graphics;
    protected bg: Graphics;
    protected field: Text | BitmapText;

    protected _height: number;
    protected _width: number;

    protected _fieldPadding: Point;

    constructor(config?: IFLabelConfig) {
        super(config);
    }

    protected construction(config?: IFLabelConfig): void {
        super.construction();

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

                    this.commitData();
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

                    this.commitData();
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

        this._fieldPadding = new Point();
        if (this.config.fieldPadding) {
            this._fieldPadding = this.config.fieldPadding;
        }

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

    protected createField(): void {
        if (this.field) {
            this.field.parent.removeChild(this.field);
            this.field = null;
        }

        if (this.config.isBitmap) {
            this.field = new BitmapText(
                "",
                {

                    fontName: this.config.fontFamily,
                    fontSize: this.config.size,
                    tint: this.config.color
                }
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

        } else {
            const textField: Text = (this.field as Text);
            if (this.config.fontFamily) {
                textField.style.fontFamily = this.config.fontFamily;
            }
            if (this.config.size) {
                textField.style.fontSize = this.config.size;
            }
            if (this.config.color) {
                textField.style.fill = this.config.color;
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

            if (this.config.stroke) {
                textField.style.stroke = this.config.stroke;
                textField.style.strokeThickness = !!this.config.strokeThickness;
            } else {
                textField.style.stroke = 0;
            }

            if (this.config.align) {
                textField.style.align = this.config.align;
            } else {
                textField.style.align = Align.LEFT;
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

        if (this.autosize) {
            if (!this.autosizeType || this.autosizeType === AutosizeType.BOTH || this.autosizeType === AutosizeType.WIDTH) {
                this._width = this.field.width + (this._fieldPadding.x * 2);
            }

            if (!this.autosizeType || this.autosizeType === AutosizeType.BOTH || this.autosizeType === AutosizeType.HEIGHT) {
                this._height = this.field.height + (this._fieldPadding.y * 2);
            }
        }

        let tempFieldScale: number = 1;
        if (this.fitToSize) {
            tempFieldScale = DisplayResizeTools.getScale(
                this.textWidth,
                this.textHeight,
                this.textAvailableWidth,
                this.textAvailableHeight
            );
        }

        this.field.scale.set(tempFieldScale);

        this.bg.width = this._width;
        this.bg.height = this._height;

        let newX: number = this._fieldPadding.x;
        switch (this.align) {
            case Align.CENTER:
                newX = Math.floor((this._width - (this.textWidth * this.field.scale.x)) * 0.5);
                break;
            case Align.RIGHT:
                newX = Math.floor(this._width - (this.textWidth * this.field.scale.x)) - this._fieldPadding.x;
                break;
        }
        this.field.x = newX;

        let newY: number = this._fieldPadding.y;
        switch (this.valign) {
            case VAlign.MIDDLE:
                newY = Math.floor((this._height - (this.textHeight * this.field.scale.y)) * 0.5);
                break;
            case VAlign.BOTTOM:
                newY = Math.floor(this._height - (this.textHeight * this.field.scale.y)) - this._fieldPadding.y;
                break;
        }
        this.field.y = newY;

        this.fieldMask.x = this._fieldPadding.x;
        this.fieldMask.y = this._fieldPadding.y;
        this.fieldMask.width = this._width - (this._fieldPadding.x * 2);
        this.fieldMask.height = this._height - (this._fieldPadding.y * 2);
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


    public get align(): string {
        return this.config.align;
    }

    public set align(value: string) {
        if (value === this.config.align) {
            return;
        }

        this.config.align = value;

        // this.arrange();
        this.applyStyle();
    }


    public get valign(): string {
        return this.config.valign;
    }

    public set valign(value: string) {
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
        this.bg.beginFill(bgColor, bgAlpha);
        this.bg.drawRect(0, 0, 10, 10);
        this.bg.endFill();

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
        this.emit(FLabelEvent.TEXT_CHANGE);

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

    get textWidth() {
        if (this.isBitmap) {
            return (this.field as BitmapText).textWidth;
        } else {
            return this.field.width / this.field.scale.x;
        }
    }

    get textHeight() {
        if (this.isBitmap) {
            return (this.field as BitmapText).textHeight;
        } else {
            return this.field.height / this.field.scale.y;
        }
    }

    get textAvailableWidth(): number {
        return this.width - (this.fieldPadding.x * 2);
    }
    get textAvailableHeight(): number {
        return this.height - (this.fieldPadding.y * 2);
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


    get fieldPadding(): Point {
        return this._fieldPadding;
    }

    set fieldPadding(value: Point) {
        if (this._fieldPadding.equals(value)) {
            return;
        }

        this._fieldPadding = value.clone();

        this.arrange();
    }
}