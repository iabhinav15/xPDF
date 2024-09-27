import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center gap-2 my-2">
      <div className="spinner" data-testid="spinner"></div>
      <h1 className="text-lg font-semibold">Loading...</h1>
    </div>

  );
};

export default Loading;
