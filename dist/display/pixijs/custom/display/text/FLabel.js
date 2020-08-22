var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { ObjectTools } from "@flashist/fcore";
import { Text, BitmapText, Graphics, FContainer, Align, VAlign, FLabelEvent, Point, AutosizeType, FLabelDefaultConfig, DisplayResizeTools } from "../../../../../index";
var FLabel = /** @class */ (function (_super) {
    __extends(FLabel, _super);
    function FLabel() {
        return _super.call(this) || this;
    }
    FLabel.prototype.construction = function (config) {
        _super.prototype.construction.call(this);
        // Properties overriding
        //
        // width
        Object.defineProperty(this, "width", {
            get: function () {
                return this._width;
            },
            set: function (value) {
                if (value === this._width) {
                    return;
                }
                this._width = value;
                this.commitData();
            }
        });
        // height
        Object.defineProperty(this, "width", {
            get: function () {
                return this._height;
            },
            set: function (value) {
                if (value === this._height) {
                    return;
                }
                this._height = value;
                this.commitData();
            }
        });
        if (!config) {
            config = {};
        }
        this.config = config;
        ObjectTools.copyProps(this.config, FLabel.DEFAULT_CONFIG, {
            ignoreExistedProperties: true
        });
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
    };
    FLabel.prototype.createField = function () {
        if (this.field) {
            this.field.parent.removeChild(this.field);
            this.field = null;
        }
        if (this.config.isBitmap) {
            this.field = new BitmapText("", {
                fontName: this.config.fontFamily,
                fontSize: this.config.size,
                tint: this.config.color
            });
        }
        else {
            this.field = new Text("");
        }
        this.applyStyle();
        this.addChild(this.field);
        this.field.mask = this.fieldMask;
    };
    FLabel.prototype.applyStyle = function () {
        if (this.config.isBitmap) {
            // ToDo: implement configuring bitmap fields
        }
        else {
            var textField = this.field;
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
            }
            else {
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
            }
            else {
                textField.style.dropShadow = false;
            }
            if (this.config.stroke) {
                textField.style.stroke = this.config.stroke;
                textField.style.strokeThickness = !!this.config.strokeThickness;
            }
            else {
                textField.style.stroke = 0;
            }
            if (this.config.align) {
                textField.style.align = this.config.align;
            }
            else {
                textField.style.align = Align.LEFT;
            }
        }
        this.arrange();
    };
    FLabel.prototype.commitData = function () {
        _super.prototype.commitData.call(this);
        this.arrange();
    };
    FLabel.prototype.arrange = function () {
        _super.prototype.arrange.call(this);
        if (this.autosize) {
            if (!this.autosizeType || this.autosizeType === AutosizeType.BOTH || this.autosizeType === AutosizeType.WIDTH) {
                this._width = this.field.width + (this._fieldPadding.x * 2);
            }
            if (!this.autosizeType || this.autosizeType === AutosizeType.BOTH || this.autosizeType === AutosizeType.HEIGHT) {
                this._height = this.field.height + (this._fieldPadding.y * 2);
            }
        }
        var tempFieldScale = 1;
        if (this.fitToSize) {
            tempFieldScale = DisplayResizeTools.getScale(this.textWidth, this.textHeight, this.textAvailableWidth, this.textAvailableHeight);
        }
        this.field.scale.set(tempFieldScale);
        this.bg.width = this._width;
        this.bg.height = this._height;
        var newX = this._fieldPadding.x;
        switch (this.align) {
            case Align.CENTER:
                newX = Math.floor((this._width - (this.textWidth * this.field.scale.x)) * 0.5);
                break;
            case Align.RIGHT:
                newX = Math.floor(this._width - (this.textWidth * this.field.scale.x)) - this._fieldPadding.x;
                break;
        }
        this.field.x = newX;
        var newY = this._fieldPadding.y;
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
    };
    Object.defineProperty(FLabel.prototype, "isBitmap", {
        get: function () {
            return this.config.isBitmap;
        },
        set: function (value) {
            if (value === this.config.isBitmap) {
                return;
            }
            this.config.isBitmap = value;
            this.createField();
            this.updateBg();
            this.commitData();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FLabel.prototype, "fontFamily", {
        get: function () {
            return this.config.fontFamily;
        },
        set: function (value) {
            if (value === this.config.fontFamily) {
                return;
            }
            this.config.fontFamily = value;
            this.applyStyle();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FLabel.prototype, "color", {
        get: function () {
            return this.config.color;
        },
        set: function (value) {
            if (value === this.config.color) {
                return;
            }
            this.config.color = value;
            this.applyStyle();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FLabel.prototype, "size", {
        get: function () {
            return this.config.size;
        },
        set: function (value) {
            if (value === this.config.size) {
                return;
            }
            this.config.size = value;
            this.applyStyle();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FLabel.prototype, "align", {
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
        get: function () {
            return this.config.align;
        },
        set: function (value) {
            if (value === this.config.align) {
                return;
            }
            this.config.align = value;
            // this.arrange();
            this.applyStyle();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FLabel.prototype, "valign", {
        get: function () {
            return this.config.valign;
        },
        set: function (value) {
            if (value === this.config.valign) {
                return;
            }
            this.config.valign = value;
            this.arrange();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FLabel.prototype, "bgAlpha", {
        get: function () {
            return this.config.bgAlpha;
        },
        set: function (value) {
            if (value === this.config.bgAlpha) {
                return;
            }
            this.config.bgAlpha = value;
            this.updateBg();
            this.arrange();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FLabel.prototype, "bgColor", {
        get: function () {
            return this.config.bgColor;
        },
        set: function (value) {
            if (value === this.config.bgColor) {
                return;
            }
            this.config.bgColor = value;
            this.updateBg();
            this.arrange();
        },
        enumerable: false,
        configurable: true
    });
    FLabel.prototype.updateBg = function () {
        var bgColor = this.config.bgColor ? this.config.bgColor : 0;
        var bgAlpha = this.config.bgAlpha ? this.config.bgAlpha : 0;
        this.bg.clear();
        this.bg.beginFill(bgColor, bgAlpha);
        this.bg.drawRect(0, 0, 10, 10);
        this.bg.endFill();
        this.fieldMask.clear();
        this.fieldMask.beginFill(0x00FF00, 1);
        this.fieldMask.drawRect(0, 0, 10, 10);
        this.fieldMask.endFill();
    };
    Object.defineProperty(FLabel.prototype, "text", {
        get: function () {
            return this.field.text;
        },
        set: function (value) {
            if (value === this.field.text) {
                return;
            }
            this.field.text = value;
            this.emit(FLabelEvent.TEXT_CHANGE);
            this.commitData();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FLabel.prototype, "autosize", {
        get: function () {
            return this.config.autosize;
        },
        set: function (value) {
            if (value === this.config.autosize) {
                return;
            }
            this.config.autosize = value;
            this.arrange();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FLabel.prototype, "autosizeType", {
        get: function () {
            return this.config.autosizeType;
        },
        set: function (value) {
            if (value === this.config.autosizeType) {
                return;
            }
            this.config.autosizeType = value;
            this.arrange();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FLabel.prototype, "fitToSize", {
        get: function () {
            return this.config.fitToSize;
        },
        set: function (value) {
            if (value === this.config.fitToSize) {
                return;
            }
            this.config.fitToSize = value;
            this.arrange();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FLabel.prototype, "textWidth", {
        get: function () {
            if (this.isBitmap) {
                return this.field.textWidth;
            }
            else {
                return this.field.width / this.field.scale.x;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FLabel.prototype, "textHeight", {
        get: function () {
            if (this.isBitmap) {
                return this.field.textHeight;
            }
            else {
                return this.field.height / this.field.scale.y;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FLabel.prototype, "textAvailableWidth", {
        get: function () {
            return this.width - (this.fieldPadding.x * 2);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FLabel.prototype, "textAvailableHeight", {
        get: function () {
            return this.height - (this.fieldPadding.y * 2);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FLabel.prototype, "bold", {
        get: function () {
            return this.config.bold;
        },
        set: function (value) {
            if (this.config.bold === value) {
                return;
            }
            this.config.bold = value;
            this.applyStyle();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FLabel.prototype, "dropShadow", {
        get: function () {
            return this.config.dropShadow;
        },
        set: function (value) {
            if (this.config.dropShadow === value) {
                return;
            }
            this.config.dropShadow = value;
            this.applyStyle();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FLabel.prototype, "stroke", {
        get: function () {
            return this.config.stroke;
        },
        set: function (value) {
            if (this.config.stroke === value) {
                return;
            }
            this.config.stroke = value;
            this.applyStyle();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FLabel.prototype, "strokeThickness", {
        get: function () {
            return this.config.strokeThickness;
        },
        set: function (value) {
            if (this.config.strokeThickness === value) {
                return;
            }
            this.config.strokeThickness = value;
            this.applyStyle();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FLabel.prototype, "fieldPadding", {
        get: function () {
            return this._fieldPadding;
        },
        set: function (value) {
            if (this._fieldPadding.equals(value)) {
                return;
            }
            this._fieldPadding = value.clone();
            this.arrange();
        },
        enumerable: false,
        configurable: true
    });
    FLabel.DEFAULT_CONFIG = new FLabelDefaultConfig();
    return FLabel;
}(FContainer));
export { FLabel };
//# sourceMappingURL=FLabel.js.map