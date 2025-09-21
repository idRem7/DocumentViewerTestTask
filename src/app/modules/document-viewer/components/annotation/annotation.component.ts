import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AnnotationModel } from '../../../../models/annotation.model';

@Component({
    selector: 'annotation',
    templateUrl: './annotation.component.html',
    styleUrl: './annotation.component.scss',
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnotationComponent {
    @Input()
    public annotation: AnnotationModel = new AnnotationModel();

    @Output()
    public remove: EventEmitter<number> = new EventEmitter<number>();

    @Output()
    public update: EventEmitter<AnnotationModel> = new EventEmitter<AnnotationModel>();

    public onTextEdit(event: Event) {
        /**
         * Предотвращаем всплытие, так как на двойной клик
         * уже привязана операция создания аннотации
         */
        event.stopPropagation();

        /**
         * Двойной клик не работает так, как одинарный
         * поэтому фокусим вручную
         */
        const target = event.target as HTMLElement;
        target.focus();

        /**
         * При фокусе через двойной клик курсор становится вначале
         * это очень неудобно, отправляем его в конец
         */
        const range = document.createRange();
        range.selectNodeContents(target);
        range.collapse(false);

        const selection = window.getSelection();
        if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    public onTextChange(event: Event) {
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

        this.update.emit(
            new AnnotationModel().fromJSON({
                ...this.annotation,
                text,
            }),
        );
    }

    public delete() {
        this.remove.emit(this.annotation.id);
    }
}
