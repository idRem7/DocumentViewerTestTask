import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AnnotationModel } from '../../../../models/annotation.model';

@Component({
    selector: 'annotation',
    templateUrl: './annotation.component.html',
    styleUrl: './annotation.component.scss',
    standalone: false,
})
export class AnnotationComponent {
    @Input()
    public annotation: AnnotationModel = new AnnotationModel();

    @Output()
    public remove: EventEmitter<number> = new EventEmitter<number>();

    @Output()
    public update: EventEmitter<AnnotationModel> = new EventEmitter<AnnotationModel>();

    onTextChange(event: Event) {
        const text = (event.target as HTMLElement).innerText;

        /**
         * Если пользователь сохраняет пустую аннотацию
         * значит она не нужна и нужно ее удалить
         * так будет более правильно с точки зрения UX
         */
        if (!text) {
            this.delete();

            return;
        }

        this.update.emit(new AnnotationModel().fromJSON({
            ...this.annotation,
            text,
        }));
    }

    public delete() {
        this.remove.emit(this.annotation.id);
    }
}
