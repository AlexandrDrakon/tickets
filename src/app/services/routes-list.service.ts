import { ITicket } from '../models/ticket.interface';

export class RoutesListService {
  static find(tickets: ITicket[]): ITicket[][] {
    let result = tickets.map(ticket => [ticket]);

    tickets.forEach(ticket => {
      const pathList = RoutesListService.findPathList(tickets, [ticket]);
      result = result.concat(pathList);
    });

    return result;
  }

  private static findPathList(tickets: ITicket[], path: ITicket[]): ITicket[][] {
    let result = [];
    const pathIds = path.map(ticket => ticket.id);
    const ticketsFree = tickets.filter(ticket => pathIds.indexOf(ticket.id) === -1);
    const lastTicketInPath = path[path.length - 1];
    ticketsFree.forEach(ticket => {
      if (ticket.cityFrom === lastTicketInPath.cityTo && ticket.timeFrom > lastTicketInPath.timeTo) {
        const newPath = path.concat(ticket);
        const newPathList = RoutesListService.findPathList(tickets, newPath);
        result = result.concat([newPath], newPathList);
      }
    });

    return result;
  }
}
