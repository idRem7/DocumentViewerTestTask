import { ChangeDetectionStrategy, Component, computed, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentModel } from '../../../../models/document.model';
import { PageModel } from '../../../../models/page.model';
import { AnnotationModel } from '../../../../models/annotation.model';
import { DocumentViewerService } from '../../../../services/document-viewer.service';

@Component({
    selector: 'app-document-viewer-page',
    templateUrl: './document-viewer-page.component.html',
    styleUrl: './document-viewer-page.component.scss',
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentViewerPageComponent implements OnInit {
    public document$$: WritableSignal<DocumentModel | null> = signal<DocumentModel | null>(null);
    public documentTitle$$: Signal<string> = computed(() => this.document$$()?.name ?? 'Документ не найден');
    public pages$$: Signal<PageModel[]> = computed(() => this.document$$()?.pages ?? []);

    public scale$$: WritableSignal<number> = signal<number>(100);

    constructor(
        private readonly documentViewerService: DocumentViewerService,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
    ) {}

    public ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id')) ?? null;
        this.document$$.set(this.route.snapshot.data['document']);

        /**
         * Если пришли по битой сслыке, то возвращаемся на главную.
         *
         * С точки зрения UX нужно показать юзеру ошибку, сказать о том,
         * что случилось, и предоставить возможность перейти на главную.
         *
         * Но я не стал делать, потому что это второстепенное
         * В продакшене конечно это критично
         */
        if (!id || this.document$$() === null) {
            this.router.navigate(['/']).then();
        }
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

        /**
         * Нужно присвоить ид новой аннотации,
         * по-хорошему это серверные дела, можно присвоить какой-то временный ид,
         * чтобы отображение и операции работали нормально, а при сохранении
         * уже снова получить аннотации с нормальными ключами
         */
        const existingIds: number[] = this.document$$()!.annotations.map((a: AnnotationModel) => a.id);
        annotation.id = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

        /**
         * Все махинации с документом (которые по сути можно назвать редьюсерами)
         * можно вынести в небольшой самописный стор и тут уже дергать ручки стора
         *
         * Тогда получится разделение обязанностей, стейтом уже будет управлять стор
         * К тому же отдельный стор будет проще тестировать, для компонента
         * нужно готовить провайдеры и TestBed
         */
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
