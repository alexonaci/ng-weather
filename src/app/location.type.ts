export const LOCATIONS = 'locations';

export interface LocationUpdate {
  operation: Operation;
  zipcode: string;
}

export enum Operation {
  ADD,
  DELETE,
  READ,
}
