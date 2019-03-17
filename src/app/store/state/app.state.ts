import { RouterReducerState } from '@ngrx/router-store';
import { ITicketState, initialTicketState } from './ticket.state';

export interface IAppState {
  router?: RouterReducerState;
  tickets: ITicketState;
}

export const initialAppState: IAppState = {
  tickets: initialTicketState
};

export function getInitialState(): IAppState {
  return initialAppState;
}
