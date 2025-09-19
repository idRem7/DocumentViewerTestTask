import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'documents',
        loadChildren: () => import('./modules/document-viewer/document-viewer.module').then((m) => m.DocumentViewerModule),
    },
];
