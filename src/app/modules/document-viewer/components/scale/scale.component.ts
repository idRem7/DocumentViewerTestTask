import { ChangeDetectionStrategy, Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';

/**
 * Данный компонент можно зашарить и вынести в ui-kit
 */
@Component({
    selector: 'scale',
    templateUrl: './scale.component.html',
    styleUrl: './scale.component.scss',
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScaleComponent {
    public readonly scale: InputSignal<number> = input<number>(100);
    public readonly scaleStep: InputSignal<number> = input<number>(5);
    public readonly maxScale: InputSignal<number> = input<number>(150);
    public readonly minScale: InputSignal<number> = input<number>(50);

    /**
     * Выбрасываем новый масштаб в процентах
     *
     * Неплохо было бы сделать выбос и в десятичном формате,
     * а то компоненту страницы приходится делать конвертацию
     * в десятичный и пересчитывать координаты
     */
    public readonly scaleChange: OutputEmitterRef<number> = output<number>();

    public increaseScale(): void {
        this.scaleChange.emit(Math.min(this.maxScale(), this.scale() + this.scaleStep()));
    }

    public decreaseScale(): void {
        this.scaleChange.emit(Math.max(this.minScale(), this.scale() - this.scaleStep()));
    }
}
