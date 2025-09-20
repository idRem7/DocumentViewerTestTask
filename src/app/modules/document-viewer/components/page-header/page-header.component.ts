import { ChangeDetectionStrategy, Component, Input, Signal, signal} from '@angular/core';

@Component({
    selector: 'page-header',
    templateUrl: './page-header.component.html',
    styleUrl: './page-header.component.scss',
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class PageHeaderComponent {
    @Input() title: Signal<string> = signal('');
}
