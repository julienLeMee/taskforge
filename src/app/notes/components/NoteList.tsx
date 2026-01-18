"use client";

import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { Note } from '../types';
import { NoteRow } from './NoteRow';
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface NoteListProps {
  notes: Note[];
  onReorder: (notes: Note[]) => void;
  onUpdateNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
}

export function NoteList({
  notes,
  onReorder,
  onUpdateNote,
  onDeleteNote,
}: NoteListProps) {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = notes.findIndex((note) => note.id === active.id);
      const newIndex = notes.findIndex((note) => note.id === over.id);
      const newNotes = arrayMove(notes, oldIndex, newIndex);
      onReorder(newNotes);
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Titre</TableHead>
            <TableHead className="w-[20%]">Aperçu</TableHead>
            <TableHead className="w-[20%]">Modifié</TableHead>
            <TableHead className="w-[20%] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <SortableContext items={notes.map(note => note.id)} strategy={verticalListSortingStrategy}>
            {notes.map((note) => (
              <NoteRow
                key={note.id}
                note={note}
                onUpdateNote={onUpdateNote}
                onDeleteNote={onDeleteNote}
              />
            ))}
          </SortableContext>
        </TableBody>
      </Table>
    </DndContext>
  );
}
