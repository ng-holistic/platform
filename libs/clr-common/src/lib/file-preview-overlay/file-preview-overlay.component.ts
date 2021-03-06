import { Component, Inject } from '@angular/core';
import { HlcFilePreviewOverlayRef } from './file-preview-overlay-ref';
import { HLC_FILE_PREVIEW_DIALOG_DATA } from './file-preview-overlay.tokens';

@Component({
    selector: 'hlc-file-preview-overlay',
    template: `
        <div class="overlay-content"><img [src]="image" /></div>
    `,
    styles: [
        `
            :host {
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            h1 {
                margin: 0;
                padding: 1em;
            }

            img {
                width: auto;
                height: 100%;

            }

            .overlay-content {
                // width: 100%;
                height: 100%;
            }
        `
    ]
})
export class HlcFilePreviewOverlayComponent {
    constructor(public dialogRef: HlcFilePreviewOverlayRef, @Inject(HLC_FILE_PREVIEW_DIALOG_DATA) public image: any) {}
}
