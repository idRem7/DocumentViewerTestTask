import { jsonProperty, Serializable } from 'ts-serializable';
import { PageModel } from './page.model';
import { AnnotationModel } from './annotation.model';

/**
 * Модель документа
 */
export class DocumentModel extends Serializable {
    /**
     * ИД документа
     *
     * В изначальных данных его не было, но по-хорошему
     * у любой сущности, которая приходит с сервера
     * должен быть ИД
     */
    @jsonProperty(Number)
    public id: number = 0;
    /**
     * Имя документа
     */
    @jsonProperty(String)
    public name: string = '';

    /**
     * Страницы
     */
    @jsonProperty([PageModel])
    public pages: PageModel[] = [];

    /**
     * Аннотации
     */
    @jsonProperty([AnnotationModel])
    public annotations: AnnotationModel[] = [];
}
