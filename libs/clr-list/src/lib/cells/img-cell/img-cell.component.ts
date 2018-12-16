import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'hlc-img-cell',
    templateUrl: './img-cell.component.html',
    styleUrls: ['./img-cell.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImgCellComponent implements OnInit {
    @Input() src: string;
    @Input() width: number;
    @Input() height: number;

    constructor() {}

    ngOnInit() {}
}
