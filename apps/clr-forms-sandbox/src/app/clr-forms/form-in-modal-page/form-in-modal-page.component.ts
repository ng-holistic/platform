import { ChangeDetectionStrategy, Component, ViewChild, Inject } from '@angular/core';
import { HlcClrModalService, HLC_CONTAINER_DATA } from '@ng-holistic/clr-common';
import { HlcClrFormComponent, InputErrorDisplayStartegy } from '@ng-holistic/clr-forms';
import { HLC_FIELDS_LAYOUT_CONFIG } from '@ng-holistic/forms';
import { timer } from 'rxjs';
import { recalcFormGroup } from '../form-recalc-page/form-recalc-page.component';

@Component({
    selector: 'hlc-form-in-modal',
    template: `
        <h5>{{data.hint}}</h5>
        <hlc-clr-form [group]="group"></hlc-clr-form>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        InputErrorDisplayStartegy,
        { provide: HLC_FIELDS_LAYOUT_CONFIG, useValue: { formClass: 'clr-form clr-form-compact' } }
    ]
})
export class FormInModalComponent {

    constructor(@Inject(HLC_CONTAINER_DATA) public data: any) {

    }

    group = recalcFormGroup;

    @ViewChild(HlcClrFormComponent, { static: false }) clrForm: HlcClrFormComponent;

    get form$() {
        return this.clrForm.form.formCreated;
    }
}

const definition = `
export const group = (form: FormGroup): ClrFormLayouts.ClrFormLayout => ({
    kind: 'fields',
    fields: [
        {
            id: 'select',
            kind: 'SelectField',
            props: {
                label: 'Select',
                items: [
                    { key: '0', label: 'disable text' },
                    { key: '1', label: 'set date control value to current date' },
                    { key: '2', label: 'make textarea required' },
                    { key: '3', label: 'hide text' }
                ]
            }
        },
        {
            id: 'text',
            kind: 'TextField',
            props: {
                label: 'Text',
                placeholder: 'Type something',
                readonly: form.valueChanges.pipe(map(({ select }) => select === '0'))
            },
            // it makes sence to remove validators for readOnly state
            validators: form.valueChanges.pipe(map(({ select }) => (select !== '0' ? [Validators.required] : []))),
            validatorsErrorsMap: { required: 'This field is required ' },
            hidden: form.valueChanges.pipe(map(({ select }) => select === '3'))
        },
        {
            id: 'date',
            kind: 'DateField',
            props: {
                label: 'Date'
            },
            value: form.valueChanges.pipe(
                distinctPropChanged('select'),
                map(({ select, date }) => {
                    // tslint:disable-next-line:quotemark
                    return select === '1' ? format("yyyy-MM-dd'T'HH:mm:ss", new Date()) : date;
                })
            )
        },
        {
            id: 'textarea',
            kind: 'TextAreaField',
            props: {
                label: 'Text Area',
                placeholder: 'Type something'
            },
            validators: form.valueChanges.pipe(map(({ select }) => (select === '2' ? [Validators.required] : [])))
        }
    ]
});
`;

const code = `
import { CommonModule } from '@angular/common';
import { HlcClrModalModule, HlcClrModalService } from '@ng-holistic/clr-common';
import { HlcClrFormModule, HlcClrFormComponent } from '@ng-holistic/clr-forms';
import { NgModule, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';

@Component({
    selector: 'hlc-form-in-modal',
    template: '<hlc-clr-form [group]="group"></hlc-clr-form>',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormInModalComponent {
    group = group;

    @ViewChild(HlcClrFormComponent) clrForm: HlcClrFormComponent;

    get form$() {
        return this.clrForm.form.formCreated;
    }
}

@Component({
    selector: 'hlc-form-in-modal-page',
    template: '<button autofocus class="btn" (click)="onShowModal()">Show Modal</button>',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormInModalPageComponent {
    constructor(private readonly modalService: HlcClrModalService) {}

    onShowModal() {
        this.modalService.showForm({
            title: 'Form in modal',
            componentFormField: 'form$',
            contentComponentType: FormInModalComponent,
            allowOkWhenFormPristine: false,
            dataAccess: {
                update(_) {
                    return timer(1000);
                }
            }
        });
    }
}


///
@NgModule({
    declarations: [FormInModalPageComponent, FormInModalComponent],
    imports: [CommonModule, HlcClrModalModule, HlcClrFormModule],
    exports: [FormInModalPageComponent],
    entryComponents: [FormInModalComponent]
})
export class FormInModalPageModule {}

`;

@Component({
    selector: 'hlc-form-in-modal-page',
    templateUrl: './form-in-modal-page.component.html',
    styleUrls: ['./form-in-modal-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [InputErrorDisplayStartegy]
})
export class FormInModalPageComponent {
    definition = definition;
    code = code;

    constructor(private readonly modalService: HlcClrModalService) {}

    onShowModal() {
        this.modalService.showForm({
            title: 'Form in modal',
            data: { hint: 'You can pass some data' },
            componentFormField: 'form$',
            contentComponentType: FormInModalComponent,
            allowOkWhenFormPristine: false,
            dataAccess: {
                update(_) {
                    return timer(1000);
                }
            }
        });
    }
}
