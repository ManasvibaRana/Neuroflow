// -------------------- CommunityPage.jsx --------------------
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import CommunityHeader from "./CommunityHeader";
import NewPostForm from "./NewPostForm";
import PostCard from "./PostCard";
import CommunitySidebar from "./CommunitySidebar";
import { Heart, Smile, Cloud, Leaf, Moon, Sparkles } from "lucide-react";
import Navbar from "/src/Navbar";


const API = axios.create({
  baseURL: "http://127.0.0.1:8000/community/",
});

API.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const moodOptions = [
  { icon: Smile, name: "Content" },
  { icon: Cloud, name: "Peaceful" },
  { icon: Leaf, name: "Growth" },
  { icon: Moon, name: "Reflective" },
  { icon: Sparkles, name: "Joyful" },
];

const reactionOptions = [{ icon: Heart, type: "heart", label: "Love" }];

export default function CommunityPage() {
  const currentUserId = sessionStorage.getItem("userid");
  const [posts, setPosts] = useState([]);
  const [filterMood, setFilterMood] = useState(null);
  const [sortBy, setSortBy] = useState("newest");

  // -------------------- Fetch posts + comments --------------------
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await API.get("posts/", {
          params: { user_id: currentUserId }, // <-- send user_id to backend
        });
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, [currentUserId]);

  // -------------------- Handle Like --------------------
  const handleReaction = useCallback(
    async (postId) => {
      try {
        const res = await API.post(`posts/${postId}/like/`, { user_id: currentUserId });

        // Update post state based on backend response
        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post.id === postId) {
              const liked = res.data.message === "Post liked"; // read backend
              const like_count = liked ? post.like_count + 1 : post.like_count - 1;
              return { ...post, like_count, userLiked: liked };
            }
            return post;
          })
        );
      } catch (err) {
        console.error("Error toggling like:", err);
      }
    },
    [currentUserId]
  );

  // -------------------- Add Comment --------------------
  const handleAddComment = useCallback(
    async (postId, commentContent) => {
      if (!commentContent.trim()) return;
      try {
        const res = await API.post("comments/", {
          post: postId,
          content: commentContent,
          user_id: currentUserId,
        });
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? { ...post, comments: [...(post.comments || []), res.data] }
              : post
          )
        );
      } catch (err) {
        console.error("Error adding comment:", err);
      }
    },
    [currentUserId]
  );

  // -------------------- Create New Post --------------------
  const handleNewPost = useCallback(
    async (postContent, moodIcon, moodName) => {
      if (!currentUserId) {
        alert("You must be logged in to create a post!");
        return;
      }
      if (!postContent.trim()) {
        alert("Post content cannot be empty.");
        return;
      }
      if (!moodName) {
        alert("Please select a mood for your post.");
        return;
      }
      try {
        const res = await API.post("posts/", {
          user_id: currentUserId,
          content: postContent.trim(),
          mood: moodName.toLowerCase(),
        });
        setPosts((prevPosts) => [res.data, ...prevPosts]);
      } catch (err) {
        console.error("Error creating post:", err.response?.data || err.message);
        alert("Failed to create post. " + JSON.stringify(err.response?.data || {}));
      }
    },
    [currentUserId]
  );

  // -------------------- Delete Post --------------------
  const handleDeletePost = useCallback(async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await API.delete(`posts/${postId}/`);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  }, []);

  // -------------------- Update Post --------------------
  const handleUpdatePost = useCallback(
    async (postId, updatedContent, updatedMoodIcon, updatedMoodName) => {
      if (!currentUserId) return;
      if (!updatedContent.trim()) return;
      if (!updatedMoodName) return;
      try {
        const res = await API.put(`posts/${postId}/`, {
          user_id: currentUserId,
          content: updatedContent.trim(),
          mood: updatedMoodName.toLowerCase(),
        });
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post.id === postId ? res.data : post))
        );
      } catch (err) {
        console.error("Error updating post:", err.response?.data || err.message);
      }
    },
    [currentUserId]
  );

  // -------------------- Filter + Sort --------------------
  const filteredAndSortedPosts = useMemo(() => {
    let displayPosts = [...posts];
    if (filterMood) displayPosts = displayPosts.filter((post) => post.mood === filterMood.toLowerCase());
    if (sortBy === "total_reactions") {
      displayPosts.sort((a, b) => b.like_count - a.like_count);
    } else {
      displayPosts.sort((a, b) => b.id - a.id);
    }
    return displayPosts;
  }, [posts, filterMood, sortBy]);

  return (
    <>
    <Navbar/>

    <div className="min-h-screen bg-gradient-to-br from-[#f3f4ff] to-[#e7eaf7] py-8 px-4 sm:px-6 lg:px-8">

      <div className="max-w-6xl mx-auto space-y-8">
        <CommunityHeader />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <NewPostForm onNewPost={handleNewPost} moodOptions={moodOptions} />
            <div className="space-y-6">
              {filteredAndSortedPosts.length === 0 && (
                <p className="text-center text-gray-600 text-lg py-8">
                  No posts found.
                </p>
              )}
              {filteredAndSortedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  id={`post-${post.id}`}
                  post={post}
                  onReaction={handleReaction}
                  onAddComment={handleAddComment}
                  onDeletePost={handleDeletePost}
                  onUpdatePost={handleUpdatePost}
                  currentUserId={currentUserId}
                  reactionOptions={reactionOptions}
                  moodOptions={moodOptions}
                />
              ))}
            </div>
          </div>
          <CommunitySidebar
            moodOptions={moodOptions}
            filterMood={filterMood}
            setFilterMood={setFilterMood}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>
      </div>
    </div>
    </>
  );
}
