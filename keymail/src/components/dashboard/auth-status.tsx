"use client";

import { useSession } from "next-auth/react";

export function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="rounded-md bg-yellow-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Loading session...</h3>
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Authentication error - Not logged in
            </h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md bg-green-50 p-4">
      <div className="flex">
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800">
            Authenticated as {session?.user?.name} ({session?.user?.email})
          </h3>
          <div className="mt-2 text-sm text-green-700">
            <p>
              Authentication provider: {session?.user?.provider || "Not specified"}
            </p>
            <p>
              User ID: {session?.user?.id || "Not found"}
            </p>
            <p>
              Plan: {session?.user?.plan || "Not specified"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 