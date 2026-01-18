import { JSONContent } from '@tiptap/react';

export interface Note {
  id: string;
  title: string;
  content: JSONContent | null;
  order: number | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface NoteFormData {
  title: string;
  content: JSONContent | null;
}

export interface NoteUpdateData extends NoteFormData {
  id: string;
}
