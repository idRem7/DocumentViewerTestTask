import { ChangeDetectionStrategy, Component, computed, input, InputSignal, output, OutputEmitterRef, Signal } from '@angular/core';
import { PageModel } from '../../../../models/document-viewer/page.model';
import { AnnotationModel } from '../../../../models/document-viewer/annotation.model';
import { DropEventDto } from '../../../../models/document-viewer/drop-event.dto';

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

    public readonly page: InputSignal<PageModel> = input.required<PageModel>();
    public readonly annotations: InputSignal<AnnotationModel[]> = input.required<AnnotationModel[]>();
    public readonly scale: InputSignal<number> = input<number>(100);

    public readonly createAnnotation: OutputEmitterRef<AnnotationModel> = output<AnnotationModel>();
    public readonly updateAnnotation: OutputEmitterRef<AnnotationModel> = output<AnnotationModel>();
    public readonly removeAnnotation: OutputEmitterRef<number> = output<number>();

    public link$$: Signal<string> = computed(() => `assets/images/${this.page().url}`);
    public scaleDecimal$$: Signal<number> = computed(() => this.scale() / 100);
    public pageSize$$: Signal<PageSize> = computed(() => ({
        width: this.baseWidth * this.scaleDecimal$$(),
        height: this.baseHeight * this.scaleDecimal$$(),
    }));

    public onCreateAnnotation(ev: MouseEvent) {
        const rect = (ev.target as HTMLElement).getBoundingClientRect();

        this.createAnnotation.emit(
            new AnnotationModel().fromJSON({
                text: 'Аннотация',
                xPosition: this.convertCoordToNaturalScale(ev.clientX - rect.x),
                yPosition: this.convertCoordToNaturalScale(ev.clientY - rect.y),
                pageNumber: this.page().number,
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
