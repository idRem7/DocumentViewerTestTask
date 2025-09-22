import { Directive, HostBinding, Input } from '@angular/core';

/**
 * Директива для ДнД,
 * вешаем на элемент, внутри компонента с DragItem, по которому
 * хотим определять драг
 */
@Directive({
    selector: '[dragItemContent]',
    standalone: true,
})
export class DragItemContentDirective {
    @Input()
    public dragItemContent: string = '';

    @HostBinding('attr.data-drag-item-content')
    public get dragItemContentData(): string {
        return this.dragItemContent;
    }
}
