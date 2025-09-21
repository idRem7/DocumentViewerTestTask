import { Component, computed, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentModel } from '../../../../models/document.model';
import { PageModel } from '../../../../models/page.model';
import { AnnotationModel } from '../../../../models/annotation.model';
import { DocumentViewerService } from '../../../../services/document-viewer.service';

@Component({
    selector: 'app-document-viewer-page',
    templateUrl: './document-viewer-page.component.html',
    styleUrl: './document-viewer-page.component.scss',
    standalone: false,
})
export class DocumentViewerPageComponent implements OnInit {
    public document$$: WritableSignal<DocumentModel | null> = signal<DocumentModel | null>(null);
    public documentTitle$$: Signal<string> = computed(() => this.document$$()?.name ?? 'Документ не найден');
    public pages$$: Signal<PageModel[]> = computed(() => this.document$$()?.pages ?? []);

    public scale$$: WritableSignal<number> = signal<number>(100);

    constructor(
        private readonly documentViewerService: DocumentViewerService,
        private readonly route: ActivatedRoute,
    ) {}

    public ngOnInit(): void {
        this.document$$.set(this.route.snapshot.data['document']);
    }

    public onScaleChange(value: number): void {
        this.scale$$.set(value);
    }

    public getAnnotationsForPage(pageNumber: number): AnnotationModel[] {
        if (!this.document$$()) {
            return [];
        }
        return this.document$$()!.annotations.filter((a: AnnotationModel) => a.pageNumber === pageNumber);
    }

    public onCreateAnnotation(annotation: AnnotationModel): void {
        if (!this.document$$()) {
            return;
        }

        const existingIds = this.document$$()!.annotations.map((a) => a.id);
        annotation.id = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

        this.document$$.update((doc) => {
            return new DocumentModel().fromJSON({
                ...doc,
                annotations: [...doc!.annotations, annotation],
            });
        });
    }

    public onUpdateAnnotation(annotation: AnnotationModel): void {
        if (!this.document$$()) {
            return;
        }

        this.document$$.update((doc) => {
            if (!doc) {
                return null;
            }

            return new DocumentModel().fromJSON({
                ...doc,
                annotations: doc.annotations.map((a) => (a.id === annotation.id ? annotation : a)),
            });
        });
    }

    public onRemoveAnnotation(id: number): void {
        if (!this.document$$()) {
            return;
        }

        this.document$$.update((doc) => {
            return new DocumentModel().fromJSON({
                ...doc,
                annotations: doc!.annotations.filter((a) => a.id !== id),
            });
        });
    }

    public saveDocument(): void {
        if (!this.document$$()) {
            return;
        }

        this.documentViewerService.saveDocument(this.document$$()!);
    }
}
