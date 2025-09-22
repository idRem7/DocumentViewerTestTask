import { Directive, HostBinding, Input } from '@angular/core';

/**
 * Днд-директива для контейнеров, в которые можем переместить
 */
@Directive({
    selector: '[dropZone]',
    standalone: true,
})
export class DropZoneDirective {
    @Input()
    public dropZone: number = 0;

    @HostBinding('attr.data-drag-container')
    public get dropZoneData(): number {
        return this.dropZone;
    }
}
