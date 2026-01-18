import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';

// Extensions pré-configurées (singleton)
const extensions = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
  }),
  Underline,
  TaskList,
  TaskItem.configure({ nested: true }),
];

export const getExtensions = () => extensions;
