"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NoteFormData, NoteUpdateData } from "../types";
import { NoteEditor } from "./NoteEditor";
import { JSONContent } from '@tiptap/react';

interface BaseNoteFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

interface CreateNoteFormProps extends BaseNoteFormProps {
  mode: "create";
  note: NoteFormData;
  setNote: (note: NoteFormData) => void;
}

interface UpdateNoteFormProps extends BaseNoteFormProps {
  mode: "edit";
  note: NoteUpdateData;
  setNote: (note: NoteUpdateData) => void;
}

type NoteFormProps = CreateNoteFormProps | UpdateNoteFormProps;

export function NoteForm({
  isOpen,
  onOpenChange,
  onSubmit,
  note,
  setNote,
  mode,
}: NoteFormProps) {
  const title = mode === "create" ? "Créer une nouvelle note" : "Modifier la note";
  const description = mode === "create"
    ? "Ajoutez une nouvelle note à votre liste."
    : "Modifiez le contenu de votre note.";

  const handleNoteUpdate = (updates: Partial<typeof note>) => {
    if (mode === "create") {
      setNote({ ...note, ...updates } as NoteFormData);
    } else {
      setNote({ ...note, ...updates } as NoteUpdateData);
    }
  };

  const handleContentChange = (content: JSONContent) => {
    handleNoteUpdate({ content });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={onSubmit} className="space-y-6">
          <DialogHeader className="pb-4">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={note.title}
                onChange={(e) => handleNoteUpdate({ title: e.target.value })}
                placeholder="Titre de la note"
              />
            </div>

            <div className="space-y-2">
              <Label>Contenu</Label>
              <NoteEditor
                content={note.content}
                onChange={handleContentChange}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit">
              {mode === "create" ? "Créer" : "Mettre à jour"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
