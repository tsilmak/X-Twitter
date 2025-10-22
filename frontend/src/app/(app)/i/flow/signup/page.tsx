import SignUpForm from "@/components/auth/registration/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up for X / X",
  description:
    "From breaking news and entertainment to sports and politics, get the full story with all the live commentary.",
  openGraph: {
    title: "Sign up for X / X",
    description:
      "From breaking news and entertainment to sports and politics, get the full story with all the live commentary.",
    siteName: "X (formerly Twitter)",
    url: `${process.env.WEBSITE_URL}`,
    images: [
      {
        url: `${process.env.MAIN_IMAGE_URL}`,
      },
    ],
    type: "website",
  },
};

export default function SignUpPage() {
  return <SignUpForm />;
}
