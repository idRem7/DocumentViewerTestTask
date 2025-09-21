import { Injectable } from '@angular/core';
import { delay, first, map, Observable, of } from 'rxjs';
import { DocumentModel } from '../models/document.model';
import { UniversalResponse } from './document-viewer.service';

const mockData = {
    name: 'test doc',
    pages: [
        {
            number: 1,
            imageUrl: 'pages/1.png',
        },
        {
            number: 2,
            imageUrl: 'pages/2.png',
        },
        {
            number: 3,
            imageUrl: 'pages/3.png',
        },
        {
            number: 4,
            imageUrl: 'pages/4.png',
        },
        {
            number: 5,
            imageUrl: 'pages/5.png',
        },
    ],
    // annotations: [
    //     {
    //         id: 1,
    //         text: 'Test annotation',
    //         pageNumber: 1,
    //         xPosition: 50,
    //         yPosition: 50,
    //     },
    // ],
};

@Injectable()
export class DocumentViewerServiceStub {
    public getDocument$(id: number): Observable<DocumentModel> {
        return of({
            data: { ...mockData, id },
            status: 200,
        }).pipe(
            delay(500), // Имитируем задержку от сервера
            first(),
            map((r: UniversalResponse) => {
                if (r.data) {
                    return new DocumentModel().fromJSON(r.data);
                }

                throw new Error('Get request without response data');
            }),
        );
    }

    public saveDocument(document: DocumentModel): Observable<null> {
        console.log(document);

        return of(null).pipe(first());
    }
}
