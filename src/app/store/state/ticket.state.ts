import { ITicket } from '../../models/ticket.interface';

export interface ITicketState {
  tickets: ITicket[];
}

export const initialTicketState: ITicketState = {
  tickets: [
    {id: -1, cityFrom: 'Новосибирск', timeFrom: '06:00', cityTo: 'Томск', timeTo: '08:00'},
    {id: -2, cityFrom: 'Новосибирск', timeFrom: '08:00', cityTo: 'Омск', timeTo: '10:00'},
    {id: -3, cityFrom: 'Новосибирск', timeFrom: '10:00', cityTo: 'Барнаул', timeTo: '12:00'},
    {id: -4, cityFrom: 'Томск', timeFrom: '09:00', cityTo: 'Кемерово', timeTo: '11:30'}
  ]
};
