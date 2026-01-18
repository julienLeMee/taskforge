"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Note } from "../types";
import { Edit, Trash, Ellipsis, GripVertical, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEditor, EditorContent, JSONContent } from '@tiptap/react';
import { getExtensions } from '../lib/tiptap-extensions';

interface NoteRowProps {
  note: Note;
  onUpdateNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function NotePreview({ content }: { content: JSONContent | null }) {
  const editor = useEditor({
    extensions: getExtensions(),
    content: content || '',
    editable: false,
    immediatelyRender: false,
  });

  if (!editor || !content) {
    return <span className="text-muted-foreground italic">Aucun contenu</span>;
  }

  return (
    <div className="tiptap prose prose-sm dark:prose-invert max-w-none max-h-[300px] overflow-y-auto">
      <EditorContent editor={editor} />
    </div>
  );
}

export function NoteRow({
  note,
  onUpdateNote,
  onDeleteNote,
}: NoteRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: note.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style} className={isDragging ? "z-50" : ""}>
      <TableCell>
        <div className="flex items-center gap-2">
          <div {...attributes} {...listeners} className="cursor-grab hover:cursor-grabbing">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <span
            onClick={() => onUpdateNote(note)}
            className="cursor-pointer hover:underline font-medium"
          >
            {note.title}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Eye className="h-4 w-4 mr-1" />
              Aperçu
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-96">
            <NotePreview content={note.content} />
          </HoverCardContent>
        </HoverCard>
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {formatDate(note.updatedAt)}
      </TableCell>
      <TableCell className="text-right space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onUpdateNote(note)} className="cursor-pointer">
              <Edit className="h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDeleteNote(note.id)} className="cursor-pointer">
              <Trash className="h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
