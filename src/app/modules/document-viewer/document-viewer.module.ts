import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnotationComponent } from './components/annotation/annotation.component';
import { DocumentPageComponent } from './components/document-page/document-page.component';
import { ScaleComponent } from './components/scale/scale.component';
import { DocumentViewerPageComponent } from './pages/document-viewer-page/document-viewer-page.component';
import { DocumentViewerService } from '../../services/document-viewer.service';
import { DocumentViewerServiceStub } from '../../services/document-viewer.service.stub';
import { RouterModule } from '@angular/router';
import { documentViewerRouter } from './document-viewer.router';

@NgModule({
    declarations: [AnnotationComponent, DocumentPageComponent, ScaleComponent, DocumentViewerPageComponent],
    imports: [CommonModule, RouterModule.forChild(documentViewerRouter), hh],
    providers: [
        {
            provide: DocumentViewerService,
            useClass: DocumentViewerServiceStub,
        },
    ],
})
export class DocumentViewerModule {}
