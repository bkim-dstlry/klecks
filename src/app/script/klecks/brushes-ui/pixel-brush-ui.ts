import {BB} from '../../bb/bb';
import {brushes} from '../brushes/brushes';
import {eventResMs} from './brushes-consts';
import {klHistory} from '../history/kl-history';
import {Checkbox} from '../ui/base-components/checkbox';
import {KlSlider} from '../ui/base-components/kl-slider';
import {penPressureToggle} from '../ui/base-components/pen-pressure-toggle';
// @ts-ignore
import brushIconImg from 'url:~/src/app/img/ui/brush-pixel.svg';
import {IBrushUi} from '../kl.types';
import {LANG, languageStrings} from '../../language/language';

export const pixelBrushUi = (function () {
    let brushInterface: IBrushUi = {
        image: brushIconImg,
        tooltip: LANG('brush-pixel'),
        sizeSlider: {
            min: 0.5,
            max: 100,
            curve: BB.quadraticSplineInput(0.5, 100, 0.1)
        },
        opacitySlider: {
            min: 1 / 100,
            max: 1,
            curve: [[0, 1 / 100], [0.5, 0.3], [1, 1]]
        },
        Ui: null,
    };

    languageStrings.subscribe(() => {
        brushInterface.tooltip = LANG('brush-pixel');
    });

    brushInterface.Ui = function (p) {
        let div = document.createElement("div"); // the gui
        let brush = new brushes.PixelBrush();
        brush.setHistory(klHistory);
        p.onSizeChange(brush.getSize());
        let sizeSlider;
        let opacitySlider;

        let lockAlphaToggle = new Checkbox({
            init: brush.getLockAlpha(),
            label: LANG('lock-alpha'),
            callback: function (b) {
                brush.setLockAlpha(b);
            },
            doHighlight: true,
            title: LANG('lock-alpha-title'),
            css: {
                marginRight: '10px',
            }
        });

        let eraserToggle = new Checkbox({
            init: brush.getIsEraser(),
            label: LANG('eraser'),
            callback: function (b) {
                brush.setIsEraser(b);
            },
            css: {
                marginRight: '10px',
            }
        });

        let ditherToggle = new Checkbox({
            init: brush.getUseDither(),
            label: LANG('brush-pixel-dither'),
            callback: function (b) {
                brush.setUseDither(b);
            }
        });

        let spacingSpline = new BB.SplineInterpolator([[0.5, 0.45], [100, 4]]);

        function setSize(size) {
            brush.setSize(size);
            brush.setSpacing(spacingSpline.interpolate(size) / size);
        }

        function init() {
            sizeSlider = new KlSlider({
                label: LANG('brush-size'),
                width: 225,
                height: 30,
                min: brushInterface.sizeSlider.min,
                max: brushInterface.sizeSlider.max,
                value: brush.getSize(),
                curve: brushInterface.sizeSlider.curve,
                eventResMs: eventResMs,
                toDisplayValue: (val) => val * 2,
                toValue: (displayValue) => displayValue / 2,
                onChange: (val) => {
                    setSize(val);
                    p.onSizeChange(val);
                },
            });
            opacitySlider = new KlSlider({
                label: LANG('opacity'),
                width: 225,
                height: 30,
                min: brushInterface.opacitySlider.min,
                max: brushInterface.opacitySlider.max,
                value: brushInterface.opacitySlider.max,
                eventResMs: eventResMs,
                toDisplayValue: (val) => val * 100,
                toValue: (displayValue) => displayValue / 100,
                onChange: (val) => {
                    brush.setOpacity(val);
                    p.onOpacityChange(val);
                },
            });

            let pressureSizeToggle = penPressureToggle(true, function (b) {
                brush.sizePressure(b);
            });

            div.append(
                BB.el({
                    content: [
                        sizeSlider.getElement(),
                        pressureSizeToggle
                    ],
                    css: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px',
                    }
                }),
                opacitySlider.getElement()
            );

            let toggleRow = BB.el({
                parent: div,
                css: {
                    display: 'flex',
                    marginTop: '10px'
                }
            });

            toggleRow.appendChild(lockAlphaToggle.getElement());
            toggleRow.appendChild(eraserToggle.getElement());
            toggleRow.appendChild(ditherToggle.getElement());
        }

        init();

        this.increaseSize = function (f) {
            if (!brush.isDrawing()) {
                sizeSlider.changeSliderValue(f);
            }
        };
        this.decreaseSize = function (f) {
            if (!brush.isDrawing()) {
                sizeSlider.changeSliderValue(-f);
            }
        };

        this.getSize = function () {
            return brush.getSize();
        };
        this.setSize = function(size) {
            setSize(size);
            sizeSlider.setValue(size * 2);
        };
        this.getOpacity = function () {
            return brush.getOpacity();
        };
        this.setOpacity = function(opacity) {
            brush.setOpacity(opacity);
            opacitySlider.setValue(opacity * 100);
        };

        this.setColor = function (c) {
            brush.setColor(c);
        };
        this.setContext = function (c) {
            brush.setContext(c);
        };
        this.startLine = function (x, y, p) {
            brush.startLine(x, y, p);
        };
        this.goLine = function (x, y, p) {
            brush.goLine(x, y, p);
        };
        this.endLine = function (x, y) {
            brush.endLine(x, y);
        };
        this.getBrush = function () {
            return brush;
        };
        this.isDrawing = function () {
            return brush.isDrawing();
        };
        this.getElement = function () {
            return div;
        };
    };
    return brushInterface;
})();