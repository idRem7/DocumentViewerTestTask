import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { catchError, EMPTY, Observable } from 'rxjs';
import { Document } from '../models/document.model';
import { DocumentViewerService } from '../services/document-viewer.service';
import { inject } from '@angular/core';

export const documentsResolver: ResolveFn<Document> = (routeSnapshot: ActivatedRouteSnapshot): Observable<Document> => {
    const documentViewerService: DocumentViewerService = inject(DocumentViewerService);
    const id = routeSnapshot.paramMap.get('id');

    if (id === null) {
        throw new Error('Document id is null');
    }

    return documentViewerService.getDocument$(+id).pipe(
        catchError((err: Error) => {
            console.error('Loading data failed');
            console.error(err);

            return EMPTY;
        }),
    );
};
