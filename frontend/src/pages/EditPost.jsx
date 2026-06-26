import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../utils/api";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/edit/${id}`);
        setContent(res.data.post.content);
      } catch (err) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post(`/edit/${id}`, { content });
    navigate("/profile");
  };

  if (loading) return (
    <div className="bg-zinc-900 min-h-screen text-white flex items-center justify-center">
      <p className="text-zinc-500 text-sm">loading...</p>
    </div>
  );

  return (
    <div className="bg-zinc-900 min-h-screen text-white">
      <header className="bg-zinc-800 px-8 py-4 flex items-center justify-between border-b border-zinc-700">
        <h1 className="text-lg font-bold">Postly</h1>
        <Link to="/profile" className="text-sm text-zinc-400 hover:text-indigo-400">← back</Link>
      </header>

      <main className="max-w-xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-1">Edit Post</h1>
        <p className="text-zinc-500 text-sm mb-8">make your changes below.</p>

        <div className="flex flex-col gap-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="5"
            className="bg-zinc-800 border border-zinc-700 text-sm text-white placeholder-zinc-500 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold px-6 py-2 rounded-lg"
            >
              Update Post
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
