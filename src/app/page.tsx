// src/app/page.tsx
import { redirect } from "next/navigation";

const HomePage = () => {
  redirect("/chat");
  return null;
};

export default HomePage;
