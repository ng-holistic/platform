import { CommonModule } from '@angular/common';
import { Component, DebugElement, EventEmitter, forwardRef, Input, NgModule, OnInit, Output } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { FieldsLayoutComponent } from '../fields-layout.component';
import { FieldsLayoutModule } from '../fields-layout.module';

@Component({
    selector: 'hlc-field-wrapper',
    // tslint:disable-next-line:max-line-length
    template: `<div><button (click)="onClick()">click</button><label>{{label}}</label><ng-content></ng-content></div>`
})
export class FieldWrapperComponent implements OnInit {
    cnt = 0;
    @Input() label: string;
    @Output() buttonClick = new EventEmitter<number>();
    //

    constructor() {}

    ngOnInit() {}

    onClick() {
        this.buttonClick.emit(this.cnt++);
    }
}

@Component({
    selector: 'hlc-text-field',
    // tslint:disable-next-line:max-line-length
    template: `<input type="text" [disabled]="readonly === true ? true : undefined" [value]="value || ''" (change)="onChange($event.target.value)" >`,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextFieldComponent),
            multi: true
        }
    ]
})
export class TextFieldComponent implements OnInit, ControlValueAccessor {
    // TextFieldComponent
    @Input() readonly: boolean;
    //
    @Input() value: string | undefined;
    @Output() valueChange = new EventEmitter<string>();

    constructor() {}

    propagateChange = (_: any) => {};

    ngOnInit() {}

    onChange(val: string) {
        this.value = val;
        this.valueChange.emit(val);
        this.propagateChange(val);
    }

    //
    writeValue(obj: any) {
        this.value = obj;
    }

    registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    registerOnTouched(_: any) {}
}

//

@NgModule({
    declarations: [TextFieldComponent, FieldWrapperComponent],
    exports: [TextFieldComponent],
    imports: [CommonModule, ReactiveFormsModule],
    providers: [],
    entryComponents: [TextFieldComponent, FieldWrapperComponent]
})
export class TextFieldModule {}

///

describe('fields-layout with wrapper with 2 fields', () => {
    let fixture: ComponentFixture<FieldsLayoutComponent>;
    let comp: FieldsLayoutComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            providers: [],
            imports: [
                FieldsLayoutModule.forRoot({ TextField: TextFieldComponent }, FieldWrapperComponent),
                ReactiveFormsModule,
                TextFieldModule
            ]
        });

        fixture = TestBed.createComponent(FieldsLayoutComponent);
        comp = fixture.componentInstance;
    });

    it('should create', () => {
        expect(comp).toBeDefined();
    });

    describe('generate layout ', () => {
        describe('with 2 text input', () => {
            let inputs: HTMLInputElement[];

            beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
                comp.formGroup = fb.group({ text1: [''], text2: [''] });
                comp.fields = [{ id: 'text1', kind: 'TextField' }, { id: 'text2', kind: 'TextField' }];
                fixture.detectChanges();
                inputs = fixture.nativeElement.querySelectorAll('input');
            }));

            it('must render layout with 2 text inputs', () => {
                // div / form / hlc-field-wrapper

                expect(fixture.nativeElement instanceof HTMLDivElement).toEqual(true);
                expect(fixture.nativeElement['children']['length']).toEqual(1);
                expect(fixture.nativeElement['firstChild'] instanceof HTMLFormElement).toEqual(true);
                expect(fixture.nativeElement['firstChild']['children']['length']).toEqual(2);
                expect(
                    fixture.debugElement.children[0].children[0].componentInstance instanceof FieldWrapperComponent
                ).toEqual(true);
                expect(
                    fixture.debugElement.children[0].children[0].children[0].children[2].componentInstance instanceof
                        TextFieldComponent
                ).toEqual(true);
                expect(
                    fixture.debugElement.children[0].children[1].componentInstance instanceof FieldWrapperComponent
                ).toEqual(true);
                expect(
                    fixture.debugElement.children[0].children[1].children[0].children[2].componentInstance instanceof
                        TextFieldComponent
                ).toEqual(true);
            });

            it('text input value must be empty string', () => {
                expect(inputs[0].value).toEqual('');
                expect(inputs[1].value).toEqual('');
            });

            it('when user type text form value must be changed', () => {
                sendKeys(inputs[1], '123');
                expect(inputs[0].value).toEqual('');
                expect(inputs[1].value).toEqual('123');
                expect(comp.formGroup.value).toEqual({ text2: '123', text1: '' });
            });

            it('when form value patched it must update input value', () => {
                comp.formGroup.patchValue({ text1: '567' });
                fixture.detectChanges();
                expect(inputs[0].value).toEqual('567');
                expect(inputs[1].value).toEqual('');
            });
        });

        describe('when field has some property value set', () => {
            let wrapperElems: DebugElement[];
            beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
                comp.formGroup = fb.group({ text1: [''], text2: [] });
                comp.fields = [
                    { id: 'text1', kind: 'TextField', label: 'xxx' },
                    { id: 'text2', kind: 'TextField', label: 'yyy' }
                ];
                fixture.detectChanges();
                wrapperElems = fixture.debugElement.queryAll(By.directive(FieldWrapperComponent));
            }));

            it('must set property with same name on wrapper', () => {
                const label1 = wrapperElems[0].query(By.css('label'));
                expect(label1.nativeElement.innerHTML).toEqual('xxx');
                const label2 = wrapperElems[1].query(By.css('label'));
                expect(label2.nativeElement.innerHTML).toEqual('yyy');
            });
        });

        // TODO

        /*
        describe('when field has some property value set to observable', () => {
            let wrapperElem: DebugElement;
            const subj = new BehaviorSubject('111');
            beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
                comp.formGroup = fb.group({ text: [''] });
                comp.fields = [{ id: 'text', kind: 'TextField', label: subj }];
                fixture.detectChanges();
                wrapperElem = fixture.debugElement.query(By.directive(FieldWrapperComponent));
            }));

            it('must set property to scalar value with same name on wrapper', () => {
                const label = wrapperElem.query(By.css('label'));
                expect(label.nativeElement.innerHTML).toEqual('111');
            });

            it('must update property value on wrapper  when new observable event emited', () => {
                subj.next('222');
                fixture.detectChanges();
                const label = wrapperElem.query(By.css('label'));
                expect(label.nativeElement.innerHTML).toEqual('222');
            });
        });

        describe('when field has some Subject property and wrapper has EventEmitter for the same name field', () => {
            const subj = new Subject();
            let button: HTMLInputElement;
            beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
                comp.formGroup = fb.group({ text: [''] });
                comp.fields = [{ id: 'text', kind: 'TextField', buttonClick: subj }];
                fixture.detectChanges();
                button = fixture.nativeElement.querySelector('button');
            }));

            it('it must emit events to subject when outpust event emited on property', async () => {
                const p = subj
                    .pipe(
                        map((val, i) => {
                            expect(val).toEqual(i);
                        }),
                        take(3)
                    )
                    .toPromise();
                button.click();
                button.click();
                button.click();
                return p;
            });
        });

        //

        describe('when field has some property value set', () => {
            beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
                comp.formGroup = fb.group({ text: [''] });
                comp.fields = [{ id: 'text', kind: 'TextField', readonly: true }];
                fixture.detectChanges();
            }));

            it('must set property with same name on component', () => {
                const input = fixture.nativeElement.querySelector('input[disabled]');
                expect(input).not.toBeNull();
            });
        });

        describe('when field has some property value set to observable', () => {
            const subj = new BehaviorSubject(true);
            beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
                comp.formGroup = fb.group({ text: [''] });
                comp.fields = [{ id: 'text', kind: 'TextField', readonly: subj }];
                fixture.detectChanges();
            }));

            it('must set property to scalar value with same name on component', () => {
                const input = fixture.nativeElement.querySelector('input[disabled]');
                expect(input).not.toBeNull();
            });

            it('must update property value when new observable event emited', () => {
                subj.next(false);
                fixture.detectChanges();
                const input = fixture.nativeElement.querySelector('input[disabled]');
                expect(input).toBeNull();
            });
        });

        describe('when field has some Subject property and coponent has EventEmitter for the same name field', () => {
            const subj = new Subject();
            let input: HTMLInputElement;
            beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
                comp.formGroup = fb.group({ text: [''] });
                comp.fields = [{ id: 'text', kind: 'TextField', valueChange: subj }];
                fixture.detectChanges();
                input = fixture.nativeElement.querySelector('input');
            }));

            it('it must emit events to subject when outpust event emited on property', async () => {
                const p = subj
                    .pipe(
                        map((val, i) => {
                            if (i === 0) {
                                expect(val).toEqual('1');
                            }
                            if (i === 1) {
                                expect(val).toEqual('12');
                            }
                            if (i === 2) {
                                expect(val).toEqual('123');
                            }
                            return true;
                        }),
                        take(3)
                    )
                    .toPromise();
                sendKeys(input, '123');
                return p;
            });
        });
        */
    });
});

function sendKeys(element: Element, keys: string) {
    const e = element as HTMLInputElement;
    for (const key of keys) {
        const eventParams = { key, char: key, keyCode: key.charCodeAt(0) };
        e.dispatchEvent(new KeyboardEvent('keydown', eventParams));
        e.dispatchEvent(new KeyboardEvent('keypress', eventParams));
        e.value += key;
        e.dispatchEvent(new KeyboardEvent('keyup', eventParams));
        e.dispatchEvent(new KeyboardEvent('change', eventParams));
        e.dispatchEvent(new Event('input'));
    }
}
