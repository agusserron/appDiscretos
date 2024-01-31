import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'angular';

  constructor(private router: Router, private dialog: MatDialog) {
    this.checkTimeOutInactivity();
    this.userInactive.subscribe((message) => {
      this.closeAllDialogs();
      this.router.navigate(['login']);
    }
    )
  }

  timeoutId?: any;
  userInactive: Subject<any> = new Subject();
    
  ngOnInit(): void{
  }

  checkTimeOutInactivity() {
    const minutes = 15;
    const timeInactivity = minutes * 60 * 1000;
    this.timeoutId = setTimeout(
      () => this.userInactive.next("User has been inactive for 15 minutes"), timeInactivity
    );
  }

  closeAllDialogs(): void {
    this.dialog.closeAll();
  }

  @HostListener('window:keydown')
  @HostListener('window:mousedown')
  checkUserActivity() {
    clearTimeout(this.timeoutId);
    this.checkTimeOutInactivity();
  }

  

}
