import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-mode-button',
  templateUrl: './mode-button.component.html',
  styleUrls: ['./mode-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModeButtonComponent { }
