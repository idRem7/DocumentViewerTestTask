import { jsonProperty, Serializable } from 'ts-serializable';
import { Page } from './page.model';
import { Annotation } from './annotation.model';

/**
 * Модель документа
 */
export class Document extends Serializable {
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
    @jsonProperty([Page])
    public pages: Page[] = [];

    /**
     * Аннотации
     */
    @jsonProperty([Annotation])
    public annotations: Annotation[] = [];
}
