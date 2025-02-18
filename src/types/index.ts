export interface Friend {
  id: string;
  name: string;
}

export interface Split {
  friendId: string;
  amount: number;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  date: string;
  splits: Split[];
}

export interface Balance {
  friendId: string;
  amount: number;
}