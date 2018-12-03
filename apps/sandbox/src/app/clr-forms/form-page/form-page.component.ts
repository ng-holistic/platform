import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ClrFormLayouts } from '@ng-holistic/clr-forms';

const group: ClrFormLayouts.ClrFormLayout = {
    kind: 'fields',
    fields: [
        {
            id: 'text',
            kind: 'TextField',
            label: 'Text',
            placeholder: 'Type something'
        },
        {
            id: 'textarea',
            kind: 'TextAreaField',
            label: 'Text Area',
            placeholder: 'Type something'
        },
        {
            id: 'date',
            kind: 'DateField',
            label: 'Date'
        },
        {
            id: 'select',
            kind: 'SelectField',
            label: 'Select',
            items: [{ key: 'one', label: 'one' }, { key: 'two', label: 'two' }]
        }
    ]
};

@Component({
    selector: 'hlc-form-page',
    templateUrl: './form-page.component.html',
    styleUrls: ['./form-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormPageComponent implements AfterViewInit {
    group = group;

    constructor(private readonly cdr: ChangeDetectorRef) {}

    ngAfterViewInit() {
        // in order to correctly display formGroup.value on init
        this.cdr.detectChanges();
    }

    onSave(val: any) {
        alert(JSON.stringify(val, null, 2));
    }
}
