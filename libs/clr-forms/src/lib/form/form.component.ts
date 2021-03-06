import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ContentChildren,
    ElementRef,
    EventEmitter,
    forwardRef,
    Inject,
    Input,
    OnDestroy,
    Optional,
    Output,
    QueryList,
    Renderer2,
    SkipSelf,
    ViewChild
} from '@angular/core';
import { HlcHotkeysContainerService, HLC_FORM_CONTROLLER } from '@ng-holistic/clr-common';
import {
    CustomFieldDirective,
    CustomFieldsProvider,
    FormLayoutConfig,
    getAllInputs,
    HlcFormComponent,
    HLC_FORM_CUSTOM_FIELDS_PROVIDER,
    HLC_FORM_EXTRACT_FIELDS
} from '@ng-holistic/forms';
import { takeUntil } from 'rxjs/operators';
import { HlcFormKeysManagerService } from './utils/form-keys-manager.service';
import { flatGroup } from './utils/form-utils';

@Component({
    selector: 'hlc-clr-form',
    templateUrl: './form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: HLC_FORM_EXTRACT_FIELDS,
            useValue: flatGroup
        },
        {
            provide: HLC_FORM_CUSTOM_FIELDS_PROVIDER,
            useExisting: forwardRef(() => HlcClrFormComponent)
        },
        {
            provide: HLC_FORM_CONTROLLER,
            useClass: HlcFormKeysManagerService
        },
        HlcFormKeysManagerService,
        HlcHotkeysContainerService
    ]
})
export class HlcClrFormComponent implements CustomFieldsProvider, AfterViewInit, OnDestroy {
    @Input() id: any | undefined;
    @Input() group: FormLayoutConfig | undefined;
    @Input() value: any | undefined;

    @Output() formValueChanged = new EventEmitter<any>();

    //@ts-ignore
    @ViewChild(HlcFormComponent, { static: false }) form: HlcFormComponent;

    @ContentChildren(CustomFieldDirective)
    contentCustomFields: QueryList<CustomFieldDirective>;

    constructor(
        private readonly elementRef: ElementRef,
        private readonly renderer: Renderer2,
        @Inject(HLC_FORM_CUSTOM_FIELDS_PROVIDER)
        @Optional()
        @SkipSelf()
        private readonly customFieldsProvider: CustomFieldsProvider | undefined,
        private readonly hotkeysContainer: HlcHotkeysContainerService
    ) {}

    get customFields() {
        return [
            ...this.contentCustomFields.toArray(),
            ...(this.customFieldsProvider ? this.customFieldsProvider.customFields || [] : [])
        ];
    }

    get formGroup() {
        return this.form && this.form.formGroup;
    }

    ngAfterViewInit() {
        this.hotkeysContainer.useKeys$.pipe(takeUntil(this.hotkeysContainer.destroy$)).subscribe(f => {
            if (f) {
                this.startListenKeys();
            } else {
                this.stopListenKeys();
            }
        });

        // when children component recieve focus container form component must be focused too
        const all = getAllInputs(this.elementRef);

        all.forEach((el: any) => {
            this.renderer.listen(el, 'focus', () => this.hotkeysContainer.focus$.next(true));
            this.renderer.listen(el, 'blur', () => this.hotkeysContainer.focus$.next(false));
        });

        const childHasFocus = this.nativeElement.querySelector('*:focus');
        if (childHasFocus) {
            this.hotkeysContainer.focus$.next(true);
        }
    }

    ngOnDestroy() {
        this.hotkeysContainer.destroy$.next();
    }

    private get nativeElement() {
        return this.elementRef.nativeElement as HTMLElement;
    }

    private startListenKeys() {
        const inputs = getAllInputs(this.elementRef);
        inputs.forEach(el => this.renderer.addClass(el, 'mousetrap'));
    }

    private stopListenKeys() {
        const inputs = getAllInputs(this.elementRef);
        inputs.forEach(el => this.renderer.removeClass(el, 'mousetrap'));
    }
}
