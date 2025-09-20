import { Injectable } from '@angular/core';
import { first, map, Observable } from 'rxjs';
import { DocumentModel } from '../models/document.model';
import { HttpClient, HttpParams } from '@angular/common/http';

/**
 * Пример урла
 */
const url = 'http://localhost:7777/api/document';

export interface UniversalResponse {
    data: object | object[];
    status: number;
}

/**
 * Пример реализации сервиса для загрузки документа
 * использовать его мы конечно же не будем
 * Поэтому сделаем стаб и подменим
 */
@Injectable()
export class DocumentViewerService {
    constructor(private httpClient: HttpClient) {}

    public getDocument$(id: number): Observable<DocumentModel> {
        const queryParams = new HttpParams().set('id', id.toString());

        return this.httpClient.get<UniversalResponse>(url, { params: queryParams }).pipe(
            first(),
            map((r: UniversalResponse) => {
                if (r.data) {
                    return new DocumentModel().fromJSON(r.data);
                }

                throw new Error('Get request without response data');
            }),
        );
    }
}
