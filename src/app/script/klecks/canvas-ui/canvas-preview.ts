import {BB} from '../../bb/bb';

/**
 * preview of image with layers. can do mix modes and opacity.
 * creates a canvas.
 *
 * p = {
 *     width: 123,
 *     height: 123,
 *     layerArr: [// can be changed after the fact
 *         {
 *             canvas: Canvas,
 *             opacity: 1,
 *             mixModeStr: 'source-over'
 *         }
 *     ]
 * }
 *
 * @param p
 * @constructor
 */
export function KlCanvasPreview(p) {
    const scale = p.width / p.layerArr[0].canvas.width;
    const width = scale > 1 ? p.layerArr[0].canvas.width : p.width;
    const height = scale > 1 ? p.layerArr[0].canvas.height : p.height;

    let canvas = BB.canvas(width, height);
    canvas.style.backgroundImage = 'url(' + BB.createCheckerDataUrl(8) + ')';
    let ctx = canvas.getContext('2d');

    BB.css(canvas, {
        width: '100%',
        height: '100%',
        imageRendering: scale > 1 ? 'pixelated' : null,
    });

    function render() {
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < p.layerArr.length; i++) {
            ctx.globalAlpha = parseFloat(p.layerArr[i].opacity);
            ctx.globalCompositeOperation = p.layerArr[i].mixModeStr;
            if (canvas.width > p.layerArr[i].canvas.width) {
                ctx.imageSmoothingEnabled = false;
            }
            ctx.drawImage(p.layerArr[i].canvas, 0, 0, canvas.width, canvas.height);
        }
        ctx.restore();
    }

    setTimeout(render, 0);

    // --- interface ---
    this.getElement = function() {
        return canvas;
    };

    this.render = function() {
        render();
    };
}