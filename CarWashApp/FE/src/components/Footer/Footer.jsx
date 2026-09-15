import NavBar from "../navbar/NavBar";
export default function Footer({ user }) {
  return (
    <footer>
      <NavBar user={user} />
    </footer>
  );
}
