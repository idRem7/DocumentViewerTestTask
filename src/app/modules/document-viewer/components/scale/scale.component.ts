import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, Signal, signal } from '@angular/core';

@Component({
    selector: 'scale',
    templateUrl: './scale.component.html',
    styleUrl: './scale.component.scss',
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScaleComponent {
    @Input()
    public scale$$: Signal<number> = signal<number>(100);

    @Input()
    public scaleStep: number = 5;

    @Input()
    public maxScale: number = 150;

    @Input()
    public minScale: number = 50;

    /**
     * Выбрасываем новый масштаб в процентах
     *
     * Неплохо было бы сделать выбос и в десятичном формате,
     * а то компоненту страницы приходится делать конвертацию
     * в десятичный и пересчитывать координаты
     */
    @Output()
    public scaleChange: EventEmitter<number> = new EventEmitter<number>();

    public increaseScale(): void {
        this.scaleChange.emit(Math.min(this.maxScale, this.scale$$() + this.scaleStep));
    }

    public decreaseScale(): void {
        this.scaleChange.emit(Math.max(this.minScale, this.scale$$() - this.scaleStep));
    }
}
