"use client";

import React, { useState } from "react";
import { Heart, MessageCircle, Send, Edit, Trash2, X, Check } from "lucide-react";
import CustomPopover from "./CustomPopover";
import { classNames } from "./Utils";

export default function PostCard({
  post,
  onReaction,
  onAddComment,
  onDeletePost,
  onUpdatePost,
  currentUserId,
}) {
  const [commentInput, setCommentInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);

  const isAuthor = post.userName === currentUserId;

  const getInitial = (name) => name?.charAt(0).toUpperCase() || "";

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentInput.trim()) {
      onAddComment(post.id, commentInput);
      setCommentInput("");
    }
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (editedContent.trim()) {
      onUpdatePost(post.id, editedContent, null, post.mood);
      setIsEditing(false);
    }
  };

  // -------------------- Render --------------------
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 group transition-all duration-300 hover:shadow-xl hover:scale-[1.005]">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3">
        <CustomPopover
          trigger={
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#a2a8e8] flex items-center justify-center bg-gray-200 text-gray-700 font-semibold">
                {post.userAvatar ? (
                  <img src={post.userAvatar} alt={post.userName} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-sm">{getInitial(post.userName)}</div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{post.userName || "Anonymous"}</p>
                <p className="text-sm text-gray-500">{post.date_created}</p>
              </div>
            </div>
          }
          content={<div className="w-64 p-4 bg-white rounded-lg shadow-xl border border-gray-100"></div>}
        />
        {isAuthor && !isEditing && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button onClick={() => setIsEditing(true)} className="p-2 rounded-full text-gray-500 hover:text-[#6e68bd] hover:bg-[#f3f4ff]">
              <Edit className="w-4 h-4" />
            </button>
            <button onClick={() => onDeletePost(post.id)} className="p-2 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {isEditing ? (
        <form onSubmit={handleUpdateSubmit} className="space-y-4 py-2">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c3c8eb] resize-none text-gray-800"
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center gap-1">
              <X className="w-4 h-4" /> Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-md bg-[#838beb] hover:bg-[#6e68bd] text-white font-medium flex items-center gap-1">
              <Check className="w-4 h-4" /> Save
            </button>
          </div>
        </form>
      ) : (
        <p className="text-gray-800 leading-relaxed py-2">{post.content}</p>
      )}

      {/* Reactions */}
      <div className="flex items-center justify-between mt-3">
        <button
          onClick={() => onReaction(post.id)}
          className={classNames(
            "flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium transition-colors duration-200",
            post.userLiked ? "text-red-500 bg-red-50" : "text-gray-500 hover:bg-gray-100"
          )}
        >
          <Heart
            className={classNames(
              "w-4 h-4 transition-transform duration-200",
              post.userLiked ? "fill-red-500 scale-110" : ""
            )}
          />
          <span className="text-xs">{post.like_count || 0}</span>
        </button>
        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <MessageCircle className="w-4 h-4" />
          <span>{post.comments?.length || 0} Comments</span>
        </div>
      </div>

      {/* Comments */}
      {post.comments?.length > 0 && (
        <div className="mt-3 space-y-2">
          {post.comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-200 text-gray-700 text-xs font-semibold">
                {comment.userAvatar ? (
                  <img src={comment.userAvatar} alt={comment.userName} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-xs">{getInitial(comment.userName)}</div>
                )}
              </div>
              <div className="bg-gray-50 p-2 rounded-lg flex-1 text-sm">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">{comment.userName || "Anonymous"}</span>
                  <span className="text-gray-500 text-xs">{comment.date_created}</span>
                </div>
                <p>{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Comment */}
      <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 mt-2">
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#c3c8eb]"
        />
        <button type="submit" className="p-2 rounded-full text-[#6e68bd] hover:text-[#5852a4] hover:bg-[#f3f4ff]">
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
