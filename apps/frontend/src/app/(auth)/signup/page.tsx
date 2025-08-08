import React, { Suspense } from "react";
import Register from "./Register";

const page = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      }
    >
      <Register />
    </Suspense>
  );
};

export default page;
