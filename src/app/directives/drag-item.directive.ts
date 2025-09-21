import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { DropEventDto } from '../models/drop-event.dto';

@Directive({
    selector: '[dragItem]',
    standalone: true,
})
export class DragItemDirective {
    private isDragging = false;

    private shiftX = 0;
    private shiftY = 0;

    private startX: number = 0;
    private startY: number = 0;

    private restrictedZones: HTMLElement[] = [];

    @Output()
    public dragItemEnd: EventEmitter<DropEventDto> = new EventEmitter();

    constructor(private el: ElementRef<HTMLElement>) {}

    @HostListener('mousedown', ['$event'])
    public onMouseDown(event: MouseEvent): void {
        event.preventDefault();

        this.isDragging = true;

        const rect = this.el.nativeElement.getBoundingClientRect();

        this.startX = rect.left;
        this.startY = rect.top;

        this.shiftX = event.clientX - rect.left;
        this.shiftY = event.clientY - rect.top;

        this.restrictedZones = Array.from(document.querySelectorAll('[data-drag-restricted]')) as HTMLElement[];

        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
    }

    public onMouseMove = (event: MouseEvent): void => {
        if (!this.isDragging) {
            return;
        }

        const content = this.el.nativeElement.querySelector('.annotation') as HTMLElement;

        if (this.checkFullyInside(event)) {
            content.classList.remove('pulse-red');
        } else {
            content.classList.add('pulse-red');
        }

        const parentRect = this.el.nativeElement.parentElement?.getBoundingClientRect();

        if (!parentRect) {
            return;
        }

        let x = event.clientX - this.shiftX - parentRect.left;
        let y = event.clientY - this.shiftY - parentRect.top;

        /**
         * Не даем драгать на шапку, жестко ограничиваем
         * 120 - высота шапки 100 + 20px на кнопку удаления
         */
        if (event.clientY - this.shiftY <= 120) {
            y = 120 - parentRect.top;
        }


        for (const zone of this.restrictedZones) {
            this.checkRestrictedCollision(event, zone);
        }

        this.el.nativeElement.style.left = `${x}px`;
        this.el.nativeElement.style.top = `${y}px`;
    };

    public onMouseUp = (event: MouseEvent): void => {
        if (!this.isDragging) {
            return;
        }

        this.isDragging = false;

        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);

        const rect = this.el.nativeElement.getBoundingClientRect();

        if (this.checkFullyInside(event)) {
            const dropZone = this.getDropZone(event);
            const pageNumber = dropZone!.getAttribute('data-drag-container');
            const dropZoneRect = dropZone?.getBoundingClientRect();

            if (!pageNumber) {
                throw new Error('Drop container without data!!!');
            }

            this.dragItemEnd.emit({
                pageNumber: +pageNumber,
                xPosition: rect.x - dropZoneRect!.x,
                yPosition: rect.y - dropZoneRect!.y,
            });
        } else {
            this.returnToStartPosition();
        }
    };

    /**
     * Проверяет, полностью ли dragItem-элемент находится
     * в пределах контейнера DropZone.
     * Вернет false, если какая-то часть вышла за границы
     *
     * @param event
     */
    public checkFullyInside(event: MouseEvent): boolean {
        const content = this.el.nativeElement.querySelector('.annotation') as HTMLElement;
        const dropZone = this.getDropZone(event);

        if (!dropZone) {
            return false;
        }

        const dropZoneRect = dropZone?.getBoundingClientRect();
        const elRect = content.getBoundingClientRect();

        return (
            elRect.top >= dropZoneRect!.top &&
            elRect.left >= dropZoneRect!.left &&
            elRect.bottom <= dropZoneRect!.bottom &&
            elRect.right <= dropZoneRect!.right
        );
    }

    public checkRestrictedCollision(_event: MouseEvent, restrictedArea: HTMLElement) {
        const content = this.el.nativeElement.querySelector('.annotation') as HTMLElement;
        const elRect = content.getBoundingClientRect();

        const restrictedRect = restrictedArea.getBoundingClientRect();

        console.log('Restricted');
        console.log(elRect);
        console.log(restrictedRect);
    }

    public returnToStartPosition(): void {
        const parentRect = this.el.nativeElement.parentElement?.getBoundingClientRect();

        const content = this.el.nativeElement.querySelector('.annotation') as HTMLElement;
        content.classList.remove('pulse-red');

        this.el.nativeElement.style.transition = 'left 0.3s ease, top 0.3s ease';
        this.el.nativeElement.style.left = this.startX - parentRect!.x + 'px';
        this.el.nativeElement.style.top = this.startY - parentRect!.y + 'px';

        // после завершения анимации убираем transition
        const cleanup = () => {
            this.el.nativeElement.style.transition = '';
            this.el.nativeElement.removeEventListener('transitionend', cleanup);
        };

        this.el.nativeElement.addEventListener('transitionend', cleanup);
    }

    /**
     * Возвращает элемент, который в данный момент находится под курсором
     * ищем элемент, на котором висит директива DropZone
     * @param event
     */
    public getDropZone(event: MouseEvent): HTMLElement | null {
        this.el.nativeElement.style.display = 'none';
        const elemBelow = document.elementFromPoint(event.clientX, event.clientY);
        this.el.nativeElement.style.display = '';

        return elemBelow?.closest('[data-drag-container]') as HTMLElement | null;
    }
}
