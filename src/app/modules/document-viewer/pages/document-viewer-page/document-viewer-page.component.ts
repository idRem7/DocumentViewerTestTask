import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-document-viewer-page',
    templateUrl: './document-viewer-page.component.html',
    styleUrl: './document-viewer-page.component.scss',
    standalone: false
})
export class DocumentViewerPageComponent implements OnInit {
    public id: number | null = null;
    public document: Document | null = null;

    constructor(private route: ActivatedRoute) {}

    public ngOnInit() {
        this.id = Number(this.route.snapshot.paramMap.get('id')) ?? null;

        this.document = this.route.snapshot.data['document'];

        console.log(this.document);
        console.log(this.id);
    }
}
