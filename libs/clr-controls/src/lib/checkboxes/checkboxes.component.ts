import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DictMapperService } from '../list-items.config';
import * as R from 'ramda';

export interface CheckboxesValues {
    items: any[];
    readonly?: boolean;
}

@Component({
    selector: 'hlc-clr-checkboxes',
    templateUrl: './checkboxes.component.html',
    styleUrls: ['./checkboxes.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => HlcClrCheckboxesComponent),
            multi: true
        }
    ]
})
export class HlcClrCheckboxesComponent implements OnInit, ControlValueAccessor, CheckboxesValues {
    @Input()
    items: any[];
    @Input()
    value: string[] | undefined;
    @Input()
    readonly: boolean;
    @Output()
    valueChange = new EventEmitter<string[] | undefined>();
    propagateChange = (_: any) => {};

    constructor(private readonly dictMapper: DictMapperService) {}

    ngOnInit() {}

    onChange(item: any) {
        const key = this.mapKey(item);
        const index = (this.value || []).indexOf(key);
        if (!this.value) {
            this.value = [];
        }
        if (index === -1) {
            this.value = R.insert(0, key, this.value);
        } else {
            this.value = R.remove(index, 1, this.value);
        }

        this.valueChange.emit(this.value);
        this.propagateChange(this.value);
    }

    isChecked(item: any) {
        const itemKey = this.mapKey(item);
        return this.value  && R.contains(itemKey, this.value);
    }

    mapKey(obj: any) {
        return this.dictMapper.getKey(obj);
    }

    mapLabel(obj: any) {
        return this.dictMapper.getLabel(obj);
    }

    trackBy = (_: number, obj: any) => {
        return this.mapKey(obj);
    };

    //

    writeValue(obj: any[]) {
        this.value = obj;
    }

    registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    registerOnTouched(_: any) {}
}
