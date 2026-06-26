import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      setUser(res.data.user);
    } catch (err) {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    await api.post("/post", { content });
    setContent("");
    fetchProfile();
  };

  const handleLike = async (postId) => {
    await api.get(`/like/${postId}`);
    fetchProfile();
  };

  const handleLogout = async () => {
    await api.get("/logout");
    navigate("/login");
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
        <button
          onClick={handleLogout}
          className="text-sm text-zinc-400 hover:text-red-400"
        >
          Logout
        </button>
      </header>

      <main className="max-w-xl mx-auto px-6 py-10">
        <div className="flex items-center gap-4 mb-8">
          <img
            className="w-14 h-14 rounded-full object-cover"
            src="https://i.pinimg.com/originals/e2/e1/bd/e2e1bd2e5c02d4d598a1abcf978789bd.gif"
            alt="avatar"
          />
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-zinc-400 text-sm">@{user.username}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 mb-10">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="3"
            placeholder="what's on your mind..."
            className="bg-zinc-800 border border-zinc-700 text-sm placeholder-zinc-500 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          <div className="flex justify-end">
            <button
              onClick={handlePost}
              className="bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold px-6 py-2 rounded-lg"
            >
              Post
            </button>
          </div>
        </div>

        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-4">Your Posts</p>

        {user.posts.length === 0 && (
          <p className="text-zinc-600 text-sm text-center py-10">no posts yet.</p>
        )}

        <div className="flex flex-col gap-4">
          {user.posts.map((post) => {
            const liked = post.likes.indexOf(user._id) !== -1;
            return (
              <div key={post._id} className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
                <p className="text-indigo-400 text-xs mb-2">@{user.username}</p>
                <p className="text-sm text-zinc-200">{post.content}</p>
                <div className="flex gap-4 mt-4 border-t border-zinc-700 pt-3">
                  <button
                    onClick={() => handleLike(post._id)}
                    className={`text-xs transition ${liked ? "text-indigo-400" : "text-zinc-500 hover:text-indigo-400"}`}
                  >
                    {liked ? "unlike" : "♥ like"} · {post.likes.length}
                  </button>
                  <Link
                    to={`/edit/${post._id}`}
                    className="text-zinc-500 text-xs hover:text-indigo-400"
                  >
                    ✎ edit
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
