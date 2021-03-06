import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Optional,
    Output,
    SkipSelf
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { equals } from 'ramda';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
    CustomFieldsProvider,
    focusFirstInput,
    HLC_FORM_CUSTOM_FIELDS_PROVIDER
} from '../fields-layout/fields-layout.component';
import { ExtractFieldsFun, HLC_FORM_EXTRACT_FIELDS } from '../form-extract-fields';
import { FormLayoutConfig, FormRebuidProvider, HLC_FORM_REBUILD_PROVIDER } from '../form-rebuild';
import { IFormGroup } from '../models/form-layouts.types';
import { initFormGroup } from './form-builder';

@Component({
    selector: 'hlc-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: HLC_FORM_CUSTOM_FIELDS_PROVIDER,
            useExisting: forwardRef(() => HlcFormComponent)
        }
    ]
})
export class HlcFormComponent implements OnInit, OnDestroy, AfterViewInit, CustomFieldsProvider {
    private destroy$ = new Subject();
    private _tempVal: any;
    /**
     * Initial value - value on form, right after form initialization
     * TODO : Sync with Footer originalValue
     */
    initialValue: any;
    group: IFormGroup<any> | undefined;
    @Input('group')
    set setGroup(val: FormLayoutConfig | undefined) {
        this.initForm(val);
    }
    @Input()
    set value(val: any) {
        if (this.formGroup) {
            if (!val || equals(this.formGroup.value, val)) {
                return;
            }
            this.formGroup.patchValue(val);
            this.formGroup.updateValueAndValidity({ onlySelf: false, emitEvent: true });
            this.cdr.detectChanges();
        } else {
            this._tempVal = val;
        }
    }

    get customFields() {
        return this.customFieldsProvider && this.customFieldsProvider.customFields;
    }

    @Output() formValueChanged = new EventEmitter<any>();

    // This must be cold in order, event subscrier scubscribes after component created it sill get emitted event
    formCreated = new BehaviorSubject<FormGroup | null>(null);

    formGroup: FormGroup;

    constructor(
        private readonly fb: FormBuilder,
        private readonly cdr: ChangeDetectorRef,
        private readonly elementRef: ElementRef,
        @Inject(HLC_FORM_EXTRACT_FIELDS) private readonly extractFieldsFun: ExtractFieldsFun,
        @Optional()
        @Inject(HLC_FORM_REBUILD_PROVIDER)
        private readonly formRebuildProvider: FormRebuidProvider | undefined,
        @Inject(HLC_FORM_CUSTOM_FIELDS_PROVIDER)
        @Optional()
        @SkipSelf()
        private readonly customFieldsProvider: CustomFieldsProvider | undefined
    ) {}

    ngOnInit() {}

    private initForm(form: FormLayoutConfig | undefined) {
        if (!form) {
            this.group = undefined;
            this.destroy$.next();
            return;
        }

        // Reuse old form when rebuild
        const newFormGroup = this.formGroup || this.fb.group({});

        const newForm = typeof form === 'function' ? form(newFormGroup) : form;

        if (this.group === newForm) {
            // Same form as before
            return;
        }

        this.destroy$.next();

        this.formGroup = newFormGroup;
        this.group = newForm;

        const fields = this.extractFieldsFun(this.group);

        const sniffer$ = initFormGroup(this.formGroup, this.fb, fields);

        if (this._tempVal) {
            this.formGroup.patchValue(this._tempVal);
            this._tempVal = undefined;
        }

        if (sniffer$) {
            sniffer$.pipe(takeUntil(this.destroy$)).subscribe(() => {});
        }

        // watch rebuildForm event
        if (this.formRebuildProvider) {
            this.formRebuildProvider.rebuildForm$.pipe(takeUntil(this.destroy$)).subscribe(data => {
                this.rebuildForm(data);
            });
        }

        this.initialValue = this.formGroup.value;
        this.formCreated.next(this.formGroup);
        this.formGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(val => this.formValueChanged.emit(val));
    }

    private rebuildForm(data: any) {
        if (this.formRebuildProvider) {
            const rebuiltConfig = this.formRebuildProvider.rebuildFormLayoutConfig(data, this.formGroup.value);
            this.initForm(rebuiltConfig);
            this.cdr.markForCheck();
        }
    }

    ngAfterViewInit() {
        if (this.formGroup) {
            // Allow value subscribers of a form to take initial actions
            this.formGroup.updateValueAndValidity({ onlySelf: false, emitEvent: true });
            this.cdr.detectChanges();
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
    }

    get hasChanges() {
        return this.formGroup && !equals(this.formGroup.value, this.initialValue);
    }

    resetValue() {
        this.formGroup.patchValue(this.initialValue);
        this.formGroup.updateValueAndValidity();
    }

    focusFirstInput() {
        focusFirstInput(this.elementRef);
    }

    get hasFocusedElement() {
        return !!this.nativeElement.querySelector('*:focus');
    }

    private get nativeElement() {
        return this.elementRef.nativeElement as HTMLElement;
    }
}
