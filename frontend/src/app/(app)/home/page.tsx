import RightSidebar from "@/components/RightSidebar";
import PostInput from "@/components/feed/PostInput";
import { Metadata } from "next";
import { TabProvider } from "./[context]/TabContext";
import Tab from "./[context]/TabContext";
import PostFeed from "./[components]/PostFeed";

export const metadata: Metadata = {
  title: "Home / X",
  openGraph: {
    title: "Home / X",
    description: "X (formerly Twitter)",
    images: [
      {
        url: `${process.env.MAIN_IMAGE_URL}`,
        alt: "X Social Platform",
      },
    ],
  },
};

const Home = () => {
  return (
    <TabProvider>
      <div className="flex min-h-screen">
        {/* Main Content */}
        <div className="max-w-2xl flex-1 border-r border-borderColor">
          {/* Adjust max-width and margins */}
          <div>
            {/* For you and Following Tabs */}
            <Tab />

            {/* Post Input  */}
            <PostInput />

            {/* Post Feed will conditionally render based on selected tab */}
            <PostFeed />
          </div>
        </div>
        {/* Right Sidebar */}
        <div className="hidden w-[350px] flex-shrink-0 lg:block">
          <RightSidebar />
        </div>
      </div>
    </TabProvider>
  );
};

export default Home;
