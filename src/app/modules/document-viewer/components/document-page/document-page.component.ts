import { ChangeDetectionStrategy, Component, computed, EventEmitter, Input, Output, Signal, signal, WritableSignal } from '@angular/core';
import { PageModel } from '../../../../models/page.model';
import { AnnotationModel } from '../../../../models/annotation.model';

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
    public pageSize$$: Signal<PageSize> = computed(() => ({
        width: (this.baseWidth * this.scale$$()) / 100,
        height: (this.baseHeight * this.scale$$()) / 100,
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
        this.createAnnotation.emit(
            new AnnotationModel().fromJSON({
                text: 'Аннотация',
                xPosition: ev.offsetX,
                yPosition: ev.offsetY,
                pageNumber: this.page$$().number,
            }),
        );
    }

    public onUpdateAnnotation(annotation: AnnotationModel) {
        this.updateAnnotation.emit(annotation);
    }

    public onRemoveAnnotation(id: number) {
        this.removeAnnotation.emit(id);
    }
}
