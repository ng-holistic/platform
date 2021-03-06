import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'hlc-clr-img-overlay',
    templateUrl: './img-overlay.component.html',
    styleUrls: ['./img-overlay.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HlcClrImgOverlayComponent {

    @Input() src: string;
    @Input() width: string;
    @Input() height: string;
    @Input() overlayOpacity = 1;
    @Input() overlayVisible = false;
}
