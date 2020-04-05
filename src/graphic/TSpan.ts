import Displayable, { DisplayableProps, DisplayableStatePropNames } from './Displayable';
import { getBoundingRect, DEFAULT_FONT } from '../contain/text';
import BoundingRect from '../core/BoundingRect';
import { PathStyleProps, DEFAULT_PATH_STYLE } from './Path';
import { extend, createObject } from '../core/util';

export interface TSpanStyleProps extends PathStyleProps {

    x?: number
    y?: number

    // TODO Text is assigned inside zrender
    text?: string

    font?: string

    textAlign?: CanvasTextAlign

    textBaseline?: CanvasTextBaseline
}

export const DEFAULT_TSPAN_STYLE: TSpanStyleProps = extend({
    strokeFirst: true,
    font: DEFAULT_FONT,
    x: 0,
    y: 0,
    textAlign: 'left',
    textBaseline: 'top'
}, DEFAULT_PATH_STYLE);

interface TSpanProps extends DisplayableProps {
    style?: TSpanStyleProps
}

export type TSpanState = Pick<TSpanProps, DisplayableStatePropNames>

class TSpan extends Displayable<TSpanProps> {

    style: TSpanStyleProps

    hasStroke() {
        const style = this.style;
        const stroke = style.stroke;
        return stroke != null && stroke !== 'none' && style.lineWidth > 0;
    }

    hasFill() {
        const style = this.style;
        const fill = style.fill;
        return fill != null && fill !== 'none';
    }

    /**
     * Create an image style object with default values in it's prototype.
     * @override
     */
    createStyle(obj?: TSpanStyleProps) {
        return createObject(DEFAULT_TSPAN_STYLE, obj);
    }
    getBoundingRect(): BoundingRect {
        const style = this.style;

        if (!this._rect) {
            let text = style.text;
            text != null ? (text += '') : (text = '');

            const rect = getBoundingRect(
                text,
                style.font,
                style.textAlign,
                style.textBaseline
            );

            rect.x += style.x || 0;
            rect.y += style.y || 0;

            if (this.hasStroke()) {
                const w = style.lineWidth;
                rect.x -= w / 2;
                rect.y -= w / 2;
                rect.width += w;
                rect.height += w;
            }

            this._rect = rect;
        }

        return this._rect;
    }

}

TSpan.prototype.type = 'tspan';
export default TSpan;