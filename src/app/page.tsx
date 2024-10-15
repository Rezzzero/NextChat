import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <p>This is the home page.</p>

      <Link href="/voice-chat">Voice Chat</Link>
      <Link href="/chat">Chat</Link>
    </div>
  );
}
