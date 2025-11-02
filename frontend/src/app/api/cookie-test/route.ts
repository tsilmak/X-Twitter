import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get cookies from the incoming request (these come from the Java backend)
    const cookies = request.cookies.getAll();
    const cookieHeader = cookies
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    console.log("Cookies received by Next.js API:", cookieHeader);
    console.log("All cookies:", cookies);

    // Forward the request to Rust backend with cookies
    const rustApiUrl =
      process.env.NEXT_USERNAME_CHECK_RUST_API_URL ||
      process.env.USERNAME_CHECK_RUST_API_URL ||
      "http://127.0.0.1:43069/";

    const response = await fetch(`${rustApiUrl}cookie-test`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Forward cookies from the incoming request
        Cookie: cookieHeader,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: "Failed to call debug-cookies endpoint",
      }));
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();

    // Include cookie information in the response for debugging
    return NextResponse.json({
      ...data,
      cookiesSent: cookieHeader,
      cookieCount: cookies.length,
      allCookies: cookies,
    });
  } catch (error) {
    console.error("Error in debug-cookies API route:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
