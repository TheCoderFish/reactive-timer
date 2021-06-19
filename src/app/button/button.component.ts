import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

export enum Purpose {
  Start,
  Pause,
  Reset
}
@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {

  @Input() purpose: Purpose;
  Purpose = Purpose;

}
