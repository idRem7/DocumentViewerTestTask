import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { catchError, EMPTY, Observable, of } from 'rxjs';
import { DocumentViewerService } from '../services/document-viewer.service';
import { inject } from '@angular/core';
import { DocumentModel } from '../models/document-viewer/document.model';

export const documentsResolver: ResolveFn<DocumentModel | null> = (
    routeSnapshot: ActivatedRouteSnapshot,
): Observable<DocumentModel | null> => {
    const documentViewerService: DocumentViewerService = inject(DocumentViewerService);
    const id = routeSnapshot.paramMap.get('id');

    if (id === null) {
        console.error('Document id is null');

        return of(null);
    }

    return documentViewerService.getDocument$(+id).pipe(
        catchError((err: Error) => {
            console.error('Loading data failed');
            console.error(err);

            /**
             * При ошибке кидаем пустоту, в странице уже есть обработка
             * Там же комментарий, почему так, как надо, как не надо
             */

            return EMPTY;
        }),
    );
};
