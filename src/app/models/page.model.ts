import { jsonName, jsonProperty, Serializable } from 'ts-serializable';


/**
 * Модель страницы
 */
export class Page extends Serializable{
    /**
     * Номер страницы
     */
    @jsonProperty(Number)
    public number: number = 0;

    /**
     * Ссылка на страницу (изображение PNG)
     */
    @jsonName('imageUrl')
    @jsonProperty(String)
    public url: string = '';
}
