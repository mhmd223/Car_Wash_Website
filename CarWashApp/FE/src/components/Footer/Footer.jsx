import NavBar from "../navbar/NavBar";
import classes from "./footer.module.css";
export default function Footer({ instagram, phone, user }) {
  return (
    <footer>
      <NavBar user={user} />
    </footer>
  );
}
