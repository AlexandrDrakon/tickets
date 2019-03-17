import { ETicketActions, TicketActions } from '../actions/ticket.actions';
import { ITicketState, initialTicketState } from '../state/ticket.state';

export const ticketReducers = (
  state = initialTicketState,
  action: TicketActions
): ITicketState => {
  switch (action.type) {
    case ETicketActions.AddTicket: {
      return {
        ...state,
        tickets: state.tickets.concat(action.payload)
      };
    }
    case ETicketActions.RemoveTicket: {
      return {
        ...state,
        tickets: state.tickets.filter(i => i.id !== action.payload)
      };
    }

    default:
      return state;
  }
};
