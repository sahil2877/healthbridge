export interface AppNotification {
  _id?: string;
  user?: string;
  type: string;        // appointment | lab | invoice | info
  title: string;
  body?: string;
  link?: string;
  read: boolean;
  createdAt?: string;
}
