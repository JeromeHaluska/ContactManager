import { Component } from '@angular/core';

@Component({
  selector: 'app-reset-dialog',
  templateUrl: './reset-dialog.component.html',
  styleUrls: ['./reset-dialog.component.css']
})
export class ResetDialogComponent {
  recordSize: number = 10;

  constructor() {}
}
