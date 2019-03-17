import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IAppState } from '../../store/state/app.state';
import { selectTicketList } from '../../store/selectors/ticket.selector';
import { RoutesListService } from '../../services/routes-list.service';

@Component({
  selector: 'app-routes-list',
  templateUrl: './routes-list.component.html',
  styleUrls: ['./routes-list.component.scss']
})
export class RoutesListComponent implements OnInit {
  pathList$: Observable<any>;

  constructor(private store: Store<IAppState>) { }

  ngOnInit() {
    this.pathList$ = this.store
      .pipe(
        select(selectTicketList),
        map(tickets => RoutesListService.find(tickets))
      );
  }

}
