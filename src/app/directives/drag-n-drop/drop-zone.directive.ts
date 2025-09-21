import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
    selector: '[dropZone]',
    standalone: true,
})
export class DropZoneDirective {
    @Input() public dropZone: number = 0; // параметр директивы

    @HostBinding('attr.data-drag-container')
    public get dropZoneData() {
        return this.dropZone;
    }
}
