import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { IAppState } from '../../store/state/app.state';
import { selectTicketList } from '../../store/selectors/ticket.selector';
import { RemoveTicket } from '../../store/actions/ticket.actions';

@Component({
  selector: 'app-tickets-list',
  templateUrl: './tickets-list.component.html',
  styleUrls: ['./tickets-list.component.scss']
})
export class TicketsListComponent implements OnInit {
  tickets$ = this.store.pipe(select(selectTicketList));

  constructor(private store: Store<IAppState>) { }

  ngOnInit() {
  }

  removeTicket(id: number) {
    this.store.dispatch(new RemoveTicket(id));
  }
}
