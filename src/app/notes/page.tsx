"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { NoteForm } from "./components/NoteForm";
import { NoteList } from "./components/NoteList";
import { Note, NoteFormData, NoteUpdateData } from "./types";

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [noteToUpdate, setNoteToUpdate] = useState<NoteUpdateData | null>(null);

  // État du formulaire
  const [newNote, setNewNote] = useState<NoteFormData>({
    title: "",
    content: null,
  });

  // Charger les notes au chargement de la page
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("/api/notes");
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des notes");
        }
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error("Erreur:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les notes",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [toast]);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNote),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la création de la note");
      }

      const createdNote = await response.json();
      setNotes([createdNote, ...notes]);
      setNewNote({
        title: "",
        content: null,
      });
      setIsDialogOpen(false);
      toast({
        title: "Note créée",
        description: "La note a été créée avec succès",
      });
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la création de la note",
        variant: "destructive",
      });
    }
  };

  const handleUpdateNote = async (note: Note) => {
    const formData: NoteUpdateData = {
      id: note.id,
      title: note.title,
      content: note.content,
    };
    setNoteToUpdate(formData);
    setIsUpdateDialogOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteToUpdate) return;

    try {
      const response = await fetch(`/api/notes/${noteToUpdate.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteToUpdate),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de la note");
      }

      const updatedNote = await response.json();
      setNotes(notes.map(n => n.id === updatedNote.id ? updatedNote : n));
      setIsUpdateDialogOpen(false);
      setNoteToUpdate(null);

      toast({
        title: "Succès",
        description: "La note a été mise à jour avec succès",
      });
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour de la note",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de la note");
      }
      setNotes(notes.filter(note => note.id !== id));
      toast({
        title: "Succès",
        description: "La note a été supprimée avec succès",
      });
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de la note",
        variant: "destructive",
      });
    }
  };

  const handleReorder = async (newNotes: Note[]) => {
    setNotes(newNotes);
    try {
      // Assign new order values to the notes
      const notesWithOrder = newNotes.map((note, index) => ({
        id: note.id,
        order: index
      }));

      // Save the new order to the backend
      const response = await fetch("/api/notes/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: notesWithOrder }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde de l'ordre des notes");
      }
    } catch (error) {
      console.error("Error saving note order:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'ordre des notes",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 p-2 pt-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Notes</h1>
        <Button onClick={() => setIsDialogOpen(true)}>Nouvelle note</Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="flex justify-center items-center h-40 border rounded-md">
          <p className="text-muted-foreground">Aucune note pour le moment</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <NoteList
            notes={notes}
            onReorder={handleReorder}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
          />
        </div>
      )}

      <NoteForm
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        note={newNote}
        setNote={setNewNote}
        onSubmit={handleCreateNote}
        mode="create"
      />

      {noteToUpdate && (
        <NoteForm
          isOpen={isUpdateDialogOpen}
          onOpenChange={setIsUpdateDialogOpen}
          note={noteToUpdate}
          setNote={setNoteToUpdate}
          onSubmit={handleUpdateSubmit}
          mode="edit"
        />
      )}
    </div>
  );
}
