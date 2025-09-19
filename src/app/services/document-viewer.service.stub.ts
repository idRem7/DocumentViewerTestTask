import { Injectable } from '@angular/core';
import { delay, first, map, Observable, of } from 'rxjs';
import { Document } from '../models/document.model';
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
};

@Injectable()
export class DocumentViewerServiceStub {
    public getDocument$(id: number): Observable<Document> {
        return of({
            data: { ...mockData, id },
            status: 200,
        }).pipe(
            delay(500), // Имитируем задержку от сервера
            first(),
            map((r: UniversalResponse) => {
                if (r.data) {
                    return new Document().fromJSON(r.data);
                }

                throw new Error('Get request without response data');
            }),
        );
    }
}
