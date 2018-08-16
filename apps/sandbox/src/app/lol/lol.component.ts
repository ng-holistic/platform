import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import * as R from 'ramda';

@Component({
    selector: 'hc-lol',
    templateUrl: './lol.component.html',
    styleUrls: ['./lol.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LolComponent implements OnInit {
    constructor() {}

    ngOnInit() {
        console.log('+++', R.prop('a', { a: 1 }));
    }
}
