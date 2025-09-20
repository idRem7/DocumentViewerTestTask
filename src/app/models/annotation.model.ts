import { jsonProperty, Serializable } from 'ts-serializable';

/**
 * Модель аннотации
 */
export class AnnotationModel extends Serializable {
    /**
     * ИД
     */
    @jsonProperty(Number)
    public id: number = 0;

    /**
     * Текст аннотации
     */
    @jsonProperty(String)
    public text: string = '';

    /**
     * Страница, на которой расположена аннотация
     */
    @jsonProperty(Number)
    public pageNumber: number = 0;

    /**
     * Расположение аннотации на странице по горизонтали
     */
    @jsonProperty(Number)
    public xPosition: number = 0;

    /**
     * Расположение аннотации на странице по вертикали
     */
    @jsonProperty(Number)
    public yPosition: number = 0;
}
