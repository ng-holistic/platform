import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'hlc-fake',
  templateUrl: './fake.component.html',
  styleUrls: ['./fake.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FakeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
