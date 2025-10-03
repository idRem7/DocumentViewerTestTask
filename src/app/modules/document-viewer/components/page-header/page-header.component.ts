import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';

@Component({
    selector: 'page-header',
    templateUrl: './page-header.component.html',
    styleUrl: './page-header.component.scss',
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderComponent {
    public readonly title: InputSignal<string> = input.required<string>();
}
