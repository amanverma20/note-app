import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import API from "@/lib/api";
import { Edit, Loader, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Note {
  _id: string;
  title: string;
  content?: string;
  createdAt: string;
}

interface User {
  name: string;
  email: string;
}

const Dashboard = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/signin");
      return;
    }

    const fetchData = async () => {
      try {
        const [notesRes, userRes] = await Promise.all([
          API.get("/notes", { headers: { Authorization: `Bearer ${token}` } }),
          API.get("/user/me", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setNotes(notesRes.data);
        setUser(userRes.data);
      } catch {
        toast.error("Failed to load data");
      }
    };

    fetchData();
  }, [token, navigate]);

  const handleCreateNote = async () => {
    if (!title.trim()) return toast.error("Title is required");

    setLoading(true);
    try {
      const res = await API.post(
        "/notes",
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes((prev) => [res.data, ...prev]);
      setTitle("");
      setContent("");
      toast.success("Note created");
    } catch {
      toast.error("Failed to create note");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await API.delete(`/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes((prev) => prev.filter((note) => note._id !== id));
      toast.success("Note deleted");
    } catch {
      toast.error("Failed to delete note");
    }
  };

  const handleEdit = (note: Note) => {
    setEditingId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  };

  const handleUpdateNote = async (id: string) => {
    if (!editTitle.trim()) return toast.error("Title is required");

    try {
      const res = await API.put(
        `/notes/${id}`,
        { title: editTitle, content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes((prev) =>
        prev.map((note) => (note._id === id ? res.data : note))
      );
      setEditingId(null);
      setEditTitle("");
      setEditContent("");
      toast.success("Note updated");
    } catch {
      toast.error("Failed to update note");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/sign-in");
  };

  return (
    <div className="min-h-screen w-full max-w-3xl mx-auto px-4 py-6 md:px-8 lg:px-10 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Loader className="text-blue-600" />
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>
        <button onClick={handleLogout} className="text-blue-600 text-sm font-medium">
          Sign Out
        </button>
      </div>

      {/* Welcome Box */}
      <Card className="shadow-md">
        <CardContent className="py-4">
          <p className="sm:text-xl md:text-2xl font-bold mb-1">
            Welcome, {user?.name || "User"} !
          </p>
          <p className="text-sm text-muted-foreground">Email: {user?.email}</p>
        </CardContent>
      </Card>

      {/* Create Note */}
      <div className="flex flex-col gap-3">
        <Input
          placeholder="Enter note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-gray-400"
        />
        <Textarea
          placeholder="Enter note content (optional)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border-gray-400 min-h-[100px]"
        />
        <Button
          onClick={handleCreateNote}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 w-full"
        >
          {loading ? "Creating..." : "Create Note"}
        </Button>
      </div>

      {/* Notes List */}
      <div className="space-y-3">
        <h3 className="text-base font-medium">Notes</h3>
        {notes.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm">No notes yet.</p>
        ) : (
          notes.map((note) => (
            <div
              key={note._id}
              className="border border-gray-300 rounded-md shadow-sm bg-white hover:shadow-md transition-shadow"
            >
              {editingId === note._id ? (
                // Edit Mode
                <div className="p-4 space-y-3">
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Note title"
                    className="border-gray-400"
                  />
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Note content"
                    className="border-gray-400 min-h-[100px]"
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      onClick={() => handleUpdateNote(note._id)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      size="sm"
                      variant="outline"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-medium text-gray-800">{note.title}</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(note)}
                        className="text-gray-600 hover:text-blue-500 transition-colors"
                        title="Edit note"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(note._id)}
                        className="text-gray-600 hover:text-red-500 transition-colors"
                        title="Delete note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {note.content && (
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">
                      {note.content}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Created: {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
