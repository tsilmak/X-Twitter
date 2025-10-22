"use client";
import React from "react";
import PostView from "@/components/feed/PostView";
import { useTabContext } from "../[context]/TabContext";

// Sample data - later, fetch this data
const forYouPosts = [
  {
    username: "username",
    name: "name",
    postContent: "This is a post content",
    postDate: "1h",
    postLikes: 1100,
    postComments: 20000,
    postRetweets: 120021,
    postViews: 100,
  },
];

const followingPosts = [
  {
    username: "username2",
    name: "name2",
    postContent: "This is a post content from a following person",
    postDate: "1h",
    postLikes: 1100,
    postComments: 200,
    postRetweets: 12021,
    postViews: 120,
  },
];

const PostFeed = () => {
  const { selectedTab } = useTabContext();

  // Determine which posts to display based on the selected tab
  const postsToShow =
    selectedTab === "Following" ? followingPosts : forYouPosts;

  return (
    <>
      {postsToShow.map((post, index) => (
        <PostView
          key={`post-${index}`}
          username={post.username}
          name={post.name}
          postContent={post.postContent}
          postDate={post.postDate}
          postLikes={post.postLikes}
          postComments={post.postComments}
          postRetweets={post.postRetweets}
          postViews={post.postViews}
        />
      ))}
    </>
  );
};

export default PostFeed;
