import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the username from query parameters
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username parameter is required" },
        { status: 400 }
      );
    }

    // Get cookies from the incoming request
    const cookies = request.cookies.getAll();
    const cookieHeader = cookies
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    // Forward the request to Rust backend with cookies
    const rustApiUrl =
      process.env.NEXT_USERNAME_CHECK_RUST_API_URL ||
      process.env.USERNAME_CHECK_RUST_API_URL ||
      "http://127.0.0.1:43069/";

    const response = await fetch(
      `${rustApiUrl}check-username?username=${encodeURIComponent(username)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Forward cookies from the incoming request
          Cookie: cookieHeader,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: "Failed to check username",
      }));
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in check-username API route:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

