type Common = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

export type Task = Common & {
  completed: boolean;
}

export type Event = Common & {
}
