import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormFooterDataAccess } from '@ng-holistic/clr-common';
import { TextMask } from '@ng-holistic/clr-controls';
import { HlcFormComponent } from '@ng-holistic/forms';
import { throwError, timer } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { FormLayouts } from '../../shared';

const group: FormLayouts.FormLayout = {
    kind: 'fields',
    fields: [
        {
            id: 'text',
            kind: 'TextField',
            props: {
                label: 'Text',
                placeholder: 'Type something'
            }
        },
        {
            id: 'num',
            kind: 'MaskField',
            props: {
                label: 'Number',
                placeholder: '0000000',
                mask: TextMask.int(7),
                unmask: TextMask.unmaskNumber
            }
        },
        {
            id: 'decNum',
            kind: 'MaskField',
            props: {
                label: 'Decimal number',
                placeholder: '0000000.00',
                mask: TextMask.float(7, 2),
                unmask: TextMask.unmaskNumber
            }
        },
        {
            id: 'phone',
            kind: 'PhoneField',
            label: 'Phone'
        },
        {
            id: 'password',
            kind: 'PasswordField',
            label: 'Password'
        },
        {
            id: 'textarea',
            kind: 'TextAreaField',
            props: {
                label: 'Text Area',
                placeholder: 'Type something'
            }
        },
        {
            id: 'date',
            kind: 'DateField',
            label: 'Date'
        },
        {
            id: 'date-time',
            kind: 'DateTimeField',
            label: 'Date Time'
        },
        {
            id: 'date-range',
            kind: 'DateRangeField',
            label: 'Date Range'
        },
        {
            id: 'moth-year',
            kind: 'MonthYearSelectField',
            label: 'Moth Year'
        },
        {
            id: 'select',
            kind: 'SelectField',
            props: {
                label: 'Select',
                items: [{ key: 'one', label: 'one' }, { key: 'two', label: 'two' }, { key: 'three', label: 'three' }]
            }
        },
        {
            id: 'multiSelect',
            kind: 'MultiSelectField',
            props: {
                label: 'Multi select',
                items: [{ key: 'one', label: 'one' }, { key: 'two', label: 'two' }, { key: 'three', label: 'three' }]
            }
        },
        {
            id: 'typeahead',
            kind: 'TypeaheadField',
            props: {
                label: 'Typeahead',
                config: {
                    search: text$ =>
                        text$.pipe(
                            map(args =>
                                [
                                    { key: 'one', label: 'one' },
                                    { key: 'two', label: 'two' },
                                    { key: 'three', label: 'three' }
                                ].filter(f =>
                                    args.kind === 'SearchArgTyping' ? !args.term || f.label.startsWith(args.term) : true
                                )
                            )
                        )
                }
            }
        },
        {
            id: 'tags',
            kind: 'TagsField',
            props: {
                label: 'Tags',
                config: {
                    search: text$ =>
                        text$.pipe(
                            map(args =>
                                [
                                    { key: 'one', label: 'one' },
                                    { key: 'two', label: 'two' },
                                    { key: 'three', label: 'three' }
                                ].filter(f =>
                                    args.kind === 'SearchArgTyping' ? !args.term || f.label.startsWith(args.term) : true
                                )
                            )
                        )
                }
            }
        },
        {
            id: 'toggle',
            kind: 'ToggleField',
            props: {
                label: 'Toggle',
                text: 'Use feature'
            }
        },
        {
            id: 'options',
            kind: 'OptionsField',
            props: {
                label: 'Options',
                items: [{ key: 'opt1', label: 'opt1' }, { key: 'opt2', label: 'opt2' }]
            }
        },
        {
            id: 'checkboxes',
            kind: 'CheckboxesField',
            props: {
                label: 'Checkboxes',
                items: [{ key: 'chk1', label: 'chk1' }, { key: 'chk2', label: 'chk2' }]
            }
        }
    ]
};

const definition = `
const group: ClrFormLayouts.ClrFormLayout = {
    kind: 'fields',
    fields: [
        {
            id: 'text',
            kind: 'TextField',
            props: {
                label: 'Text',
                placeholder: 'Type something'
            }
        },
        {
            id: 'num',
            kind: 'MaskField',
            props: {
                label: 'Number',
                placeholder: '0000000',
                mask: TextMask.int(7),
                unmask: TextMask.unmaskNumber
            }
        },
        {
            id: 'decNum',
            kind: 'MaskField',
            props: {
                label: 'Decimal number',
                placeholder: '0000000.00',
                mask: TextMask.float(7, 2),
                unmask: TextMask.unmaskNumber
            }
        },
        {
            id: 'phone',
            kind: 'PhoneField',
            label: 'Phone'
        },
        {
            id: 'password',
            kind: 'PasswordField',
            label: 'Password'
        },
        {
            id: 'textarea',
            kind: 'TextAreaField',
            props: {
                label: 'Text Area',
                placeholder: 'Type something'
            }
        },
        {
            id: 'date',
            kind: 'DateField',
            label: 'Date'
        },
        {
            id: 'date-time',
            kind: 'DateTimeField',
            label: 'Date Time'
        },
        {
            id: 'date-range',
            kind: 'DateRangeField',
            label: 'Date Range'
        },
        {
            id: 'select',
            kind: 'SelectField',
            props: {
                label: 'Select',
                items: [{ key: 'one', label: 'one' }, { key: 'two', label: 'two' }, { key: 'three', label: 'three' }]
            }
        },
        {
            id: 'multiSelect',
            kind: 'MultiSelectField',
            props: {
                label: 'Multi select',
                items: [{ key: 'one', label: 'one' }, { key: 'two', label: 'two' }, { key: 'three', label: 'three' }]
            }
        },
        {
            id: 'typeahead',
            kind: 'TypeaheadField',
            props: {
                label: 'Typeahead',
                config: {
                    search: text$ =>
                        text$.pipe(
                            map(args =>
                                [
                                    { key: 'one', label: 'one' },
                                    { key: 'two', label: 'two' },
                                    { key: 'three', label: 'three' }
                                ].filter(f =>
                                    args.kind === 'SearchArgTyping' ? !args.term || f.label.startsWith(args.term) : true
                                )
                            )
                        )
                }
            }
        },
        {
            id: 'tags',
            kind: 'TagsField',
            props: {
                label: 'Tags',
                config: {
                    search: text$ =>
                        text$.pipe(
                            map(args =>
                                [
                                    { key: 'one', label: 'one' },
                                    { key: 'two', label: 'two' },
                                    { key: 'three', label: 'three' }
                                ].filter(f =>
                                    args.kind === 'SearchArgTyping' ? !args.term || f.label.startsWith(args.term) : true
                                )
                            )
                        )
                }
            }
        },
        {
            id: 'toggle',
            kind: 'ToggleField',
            props: {
                label: 'Toggle',
                text: 'Use feature'
            }
        },
        {
            id: 'options',
            kind: 'OptionsField',
            props: {
                label: 'Options',
                items: [{ key: 'opt1', label: 'opt1' }, { key: 'opt2', label: 'opt2' }]
            }
        },
        {
            id: 'checkboxes',
            kind: 'CheckboxesField',
            props: {
                label: 'Checkboxes',
                items: [{ key: 'chk1', label: 'chk1' }, { key: 'chk2', label: 'chk2' }]
            }
        }
    ]
};
`;

@Component({
    selector: 'hlc-form-page',
    templateUrl: './form-page.component.html',
    styleUrls: ['./form-page.component.scss']
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormPageComponent implements AfterViewInit {
    group = group;
    definition = definition;

    @ViewChild(HlcFormComponent, { static: false }) form: HlcFormComponent;

    readonly dataAccess: FormFooterDataAccess = {
        update(_: any) {
            return timer(1000).pipe(flatMap(() => throwError('This is error')));
        }
    };

    constructor(readonly cdr: ChangeDetectorRef) {}

    ngAfterViewInit() {
        // in order to correctly display formGroup.value on init
        this.cdr.detectChanges();
    }

    onSave(val: any) {
        // alert(JSON.stringify(val, null, 2));
        console.log(val);
    }
}
