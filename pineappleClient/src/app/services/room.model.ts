import { Participant } from './participant.model';

export interface Room {
  id: number;
  gameId: number;
  participants: Participant[];
}