import {Component, ViewChild} from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('showHideMenu', [
      state('show', style({
      left: '0'
      })),
      state('hide', style({
        left: '-230px'
      })),
      transition('show => hide', [
        animate('0.4s')
      ]),
      transition('hide => show', [
        animate('0.4s')
      ]),
    ]),
    trigger('showHideContent', [
      state('show', style({
        marginLeft: '230px',
      })),
      state('hide', style({
        marginLeft: 'unset',
      })),
      transition('show => hide', [
        animate('0.4s')
      ]),
      transition('hide => show', [
        animate('0.4s')
      ]),
    ]),
    trigger('showHideButton', [
      state('show', style({
        width: 0,
        height: 0,
        borderRight: '40px solid rgba(6, 6, 6, 0.7)',
      })),
      state('hide', style({
        width: 0,
        height: 0,
        borderLeft: '40px solid rgba(6, 6, 6, 0.7)',
        borderRight: 'none'
      })),
      transition('show => hide', [
        animate('0.4s')
      ]),
      transition('hide => show', [
        animate('0.4s')
      ]),
    ])
  ]
})
export class AppComponent {
  public loading: boolean = false;
  public menuHidden: boolean = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }
  show() {
    this.menuHidden = !this.menuHidden;
  }
}
