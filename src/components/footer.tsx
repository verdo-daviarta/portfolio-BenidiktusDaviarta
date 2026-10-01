import { profile } from "@/data/profile";
export function Footer() {
  return (
    <footer className="container footer">
      <p>
        © {new Date().getFullYear()} {profile.name}
      </p>
      <a href="#home" className="eyebrow">
        Back to top ↑
      </a>
    </footer>
  );
}
