import { Action } from '@ngrx/store';
import { ITicket } from '../../models/ticket.interface';

export enum ETicketActions {
  AddTicket = '[Ticket] Add Ticket',
  RemoveTicket = '[Ticket] Remove Ticket'
}

export class AddTicket implements Action {
  public readonly type = ETicketActions.AddTicket;
  constructor(public payload: ITicket) {}
}

export class RemoveTicket implements Action {
  public readonly type = ETicketActions.RemoveTicket;
  constructor(public payload: number) {}
}

export type TicketActions = AddTicket | RemoveTicket;
