import { BB } from '../bb/bb';
import uiSwapImg from '/src/app/img/ui/ui-swap-lr.svg';
import helpImg from '/src/app/img/ui/help.svg';
import { LANG } from '../language/language';
import { PointerListener } from '../bb/input/pointer-listener';

/**
 * Topmost row of buttons in toolspace. (embed)
 *
 * @param p
 * @constructor
 */
export class EmbedToolspaceTopRow {

    private readonly rootEl: HTMLElement;

    // ---- public ----

    constructor(p: { onSubmit?: () => void; onLeftRight?: () => void; onHelp?: () => void, onCloseApp?: () => void, onUpload?: () => void }) {
        this.rootEl = BB.el({
            className: 'kl-toolspace-row',
            css: {
                display: 'flex',
                padding: '0 16px',
                flexDirection: 'column',
            },
        });

        function createButton(p: {
            title: string;
            content?: HTMLElement;
            image?: string;
            onClick: () => void;
            extraPadding?: number;
            contain: boolean;
        }): {
            el: HTMLElement;
            pointerListener: PointerListener;
        } {
            const padding = 6 + (p.extraPadding ? p.extraPadding : 0);
            const el = BB.el({
                className: 'toolspace-row-button nohighlight',
                title: p.title,
                onClick: p.onClick,
                css: {
                    padding: p.content ? '' : (p.contain ? padding + 'px 0' : ''),
                },
            });
            if (p.content) {
                el.append(p.content);
            } else {
                const im = BB.el({
                    className: 'dark-invert',
                    css: {
                        backgroundImage: 'url(\'' + p.image + '\')',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundSize: p.contain ? 'contain' : '',
                        //filter: 'grayscale(1)',
                        height: '100%',
                    },
                });
                im.style.pointerEvents = 'none';
                el.append(im);
            }
            const pointerListener = new BB.PointerListener({ // because :hover causes problems w touch
                target: el,
                onEnterLeave: function (isOver): void {
                    el.classList.toggle('toolspace-row-button-hover', isOver);
                },
            });

            return {
                el,
                pointerListener,
            };
        }

        if (typeof p.onSubmit === 'function') {
            const submitButton = createButton({
                onClick: p.onSubmit,
                title: LANG('submit-title'),
                content: BB.el({
                    content: LANG('submit'),
                    className: 'toolspace-row-button__submit',
                    css: {
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '32px',
                    },
                }),
                contain: true,
            });

            this.rootEl.append(submitButton.el);
        }

        if (typeof p.onUpload === 'function') {
            const uploadButton = createButton({
                onClick: p.onUpload,
                title: LANG('upload-submit'),
                content: BB.el({
                    content: LANG('upload-submit'),
                    className: 'toolspace-row-button__submit mt-4',
                    css: {
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '32px',
                    },
                }),
                contain: true,
            });

            this.rootEl.append(uploadButton.el);
        }

        // const helpButton = createButton({
        //     onClick: p.onHelp,
        //     title: LANG('help'),
        //     image: helpImg,
        //     contain: true,
        // });

        // const leftRightButton = createButton({
        //     onClick: p.onLeftRight,
        //     title: LANG('switch-ui-left-right'),
        //     image: uiSwapImg,
        //     contain: true,
        // });

        if (typeof p.onCloseApp === 'function') {
            const closeButton = createButton({
                onClick: p.onCloseApp,
                title: LANG('exit-without-saving'),
                content: BB.el({
                    content: LANG('exit-without-saving'),
                    className: 'toolspace-row-button__submit',
                    css: {
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '32px',
                    },
                }),
                contain: true,
            });

            this.rootEl.append(closeButton.el);
        }
    }

    getElement(): HTMLElement {
        return this.rootEl;
    }
}
