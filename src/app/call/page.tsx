import VideoCallPage from "@/components/pages/video_call/VideoCallPage";
import { Suspense } from "react";

const page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <VideoCallPage />;
  </Suspense>
);

export default page;
