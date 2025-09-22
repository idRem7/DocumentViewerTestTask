import { ChangeDetectionStrategy, Component, computed, EventEmitter, Input, Output, Signal, signal, WritableSignal } from '@angular/core';
import { PageModel } from '../../../../models/page.model';
import { AnnotationModel } from '../../../../models/annotation.model';
import { DropEventDto } from '../../../../models/drop-event.dto';

interface PageSize {
    width: number;
    height: number;
}

@Component({
    selector: 'document-page',
    templateUrl: './document-page.component.html',
    styleUrl: './document-page.component.scss',
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentPageComponent {
    /**
     * Пусть все страницы в оригинале будут одного размера
     */
    public readonly baseWidth = 794;
    public readonly baseHeight = 1123;

    public page$$: WritableSignal<PageModel> = signal<PageModel>(new PageModel());

    public link$$: Signal<string> = computed(() => `assets/images/${this.page$$().url}`);
    public scaleDecimal$$: Signal<number> = computed(() => this.scale$$() / 100);
    public pageSize$$: Signal<PageSize> = computed(() => ({
        width: this.baseWidth * this.scaleDecimal$$(),
        height: this.baseHeight * this.scaleDecimal$$(),
    }));

    @Input()
    public set page(value: PageModel) {
        this.page$$.set(value);
    }

    @Input()
    public annotations: AnnotationModel[] = [];

    @Input()
    public scale$$: Signal<number> = signal<number>(100);

    @Output()
    public removeAnnotation: EventEmitter<number> = new EventEmitter<number>();

    @Output()
    public updateAnnotation: EventEmitter<AnnotationModel> = new EventEmitter<AnnotationModel>();

    @Output()
    public createAnnotation: EventEmitter<AnnotationModel> = new EventEmitter<AnnotationModel>();

    public onCreateAnnotation(ev: MouseEvent) {
        const rect = (ev.target as HTMLElement).getBoundingClientRect();

        this.createAnnotation.emit(
            new AnnotationModel().fromJSON({
                text: 'Аннотация',
                xPosition: this.convertCoordToNaturalScale(ev.clientX - rect.x),
                yPosition: this.convertCoordToNaturalScale(ev.clientY - rect.y),
                pageNumber: this.page$$().number,
            }),
        );
    }

    public onUpdateAnnotation(annotation: AnnotationModel) {
        this.updateAnnotation.emit(annotation);
    }

    public onMoveAnnotation(move: DropEventDto, annotation: AnnotationModel) {
        this.updateAnnotation.emit(
            new AnnotationModel().fromJSON({
                ...annotation,
                pageNumber: move.pageNumber,
                xPosition: this.convertCoordToNaturalScale(move.xPosition),
                yPosition: this.convertCoordToNaturalScale(move.yPosition),
            }),
        );
    }

    public onRemoveAnnotation(id: number) {
        this.removeAnnotation.emit(id);
    }

    public getAnnotationPosition(annotation: AnnotationModel) {
        return {
            x: `${this.convertCoordToScale(annotation.xPosition)}px`,
            y: `${this.convertCoordToScale(annotation.yPosition)}px`,
        };
    }

    public convertCoordToNaturalScale(coord: number) {
        return coord / this.scaleDecimal$$();
    }

    public convertCoordToScale(coord: number) {
        return coord * this.scaleDecimal$$();
    }
}
