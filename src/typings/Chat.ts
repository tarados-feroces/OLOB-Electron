import { User } from './UserTypings';

export interface MessageHistory {
    messages: Message[];
}

export interface Message {
    text: string;
    author: string;
}
