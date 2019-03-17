import { createSelector } from '@ngrx/store';

import { IAppState } from '../state/app.state';
import { ITicketState } from '../state/ticket.state';

const selectTickets = (state: IAppState) => state.tickets;

export const selectTicketList = createSelector(
  selectTickets,
  (state: ITicketState) => state.tickets
);
