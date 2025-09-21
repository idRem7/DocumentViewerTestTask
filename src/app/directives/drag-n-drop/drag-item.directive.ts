import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { DropEventDto } from '../../models/drop-event.dto';

@Directive({
    selector: '[dragItem]',
    standalone: true,
})
export class DragItemDirective {
    private isDragging = false;

    /**
     * Запоминаем смещение курсора относительно
     * элемента, который хотим перетащить, чтобы
     * тащить его за то место, за которое схватили
     * @private
     */
    private shiftX = 0;
    private shiftY = 0;

    /**
     * Запоминаем стартовые координаты, для того чтобы
     * вернуть элемент на исходную позицию, если дропнули
     * мимо контейнера
     *
     * Координаты абсолютные в документе
     * @private
     */
    private startX: number = 0;
    private startY: number = 0;

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

        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
    }

    public onMouseMove = (event: MouseEvent): void => {
        if (!this.isDragging) {
            return;
        }

        /**
         * Добываем основной элемент аннотации, так родительский хост имеет размер 0 на 0
         * По идее так не должно быть, директива не должна знать об элементе, который ей
         * нужно будет переместить. Из-за данного метода директива работает только с аннотациями
         * или с похожими по структуре компонентами.
         *
         * Решение: разобраться с хостом компонента аннотации, чтобы он имел реальный размер
         * или накинуть аттрибут комонента на div, как будто это директива
         */
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

        /**
         * Новые координаты относительно родительноского контейнера,
         * поэтому вычитаем родительские координаты из абсолютных,
         * ну и конечно же смещение (см в описании к св-ву)
         */
        let newPositionX = event.clientX - this.shiftX - parentRect.left;
        let newPositionY = event.clientY - this.shiftY - parentRect.top;

        /**
         * Не даем драгать на шапку, жестко ограничиваем
         * 120 - высота шапки 100 + 20px на кнопку удаления
         *
         * По идее это тоже привязка к конкретностям страницы.
         *
         * Решение: сделать "запретные" зоны для драга с помощью директивы,
         * но тут бы еще добавилось много математики, для вычисления пересечений
         * с запретными зонами и логика создания "невидимых стен" для драга
         */
        if (event.clientY - this.shiftY <= 120) {
            newPositionY = 120 - parentRect.top;
        }

        this.el.nativeElement.style.left = `${newPositionX}px`;
        this.el.nativeElement.style.top = `${newPositionY}px`;
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
                /**
                 * Такого скорее всего не будет, но кто знает
                 */
                throw new Error('Drop container without data!!!');
            }

            /**
             * Выбрасываем новые координаты относительно контейнера,
             * даже если перенесли в другой контейнер, выбрасываем
             * относительно нового контейнера
             */
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

    /**
     * Плавно возвращаем элемент на исходную позицию
     * Используем магию анимации
     */
    public returnToStartPosition(): void {
        const parentRect = this.el.nativeElement.parentElement?.getBoundingClientRect();

        const content = this.el.nativeElement.querySelector('.annotation') as HTMLElement;
        content.classList.remove('pulse-red');

        this.el.nativeElement.style.transition = 'left 0.3s ease, top 0.3s ease';

        /**
         * Конвертация абсотютных координат в относительные от родителя
         */
        this.el.nativeElement.style.left = this.startX - parentRect!.x + 'px';
        this.el.nativeElement.style.top = this.startY - parentRect!.y + 'px';

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
