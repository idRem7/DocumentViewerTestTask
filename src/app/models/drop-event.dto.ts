import { AnnotationModel } from './annotation.model';

export type DropEventDto = Pick<AnnotationModel, 'pageNumber' | 'xPosition' | 'yPosition'>;
