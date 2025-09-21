import { DocumentViewerPageComponent } from './pages/document-viewer-page/document-viewer-page.component';
import { documentsResolver } from '../../resolvers/documents.resolver';
import { Routes } from '@angular/router';

export const documentViewerRouter: Routes = [
    {
        path: ':id',
        component: DocumentViewerPageComponent,
        resolve: {
            document: documentsResolver,
        },
    },
    {
        path: '',
        component: DocumentViewerPageComponent,
    },
    {
        path: '**',
        redirectTo: '',
    },
];
