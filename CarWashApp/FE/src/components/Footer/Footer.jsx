import NavBar from "../navbar/NavBar";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa6";
import classes from "./footer.module.css";

const socialLinks = [
  {
    name: "Instagram",
    href: import.meta.env.INSTAGRAM_URL || "https://www.instagram.com/",
    icon: FaInstagram,
  },
  {
    name: "Facebook",
    href: import.meta.env.FACEBOOK_URL || "https://www.facebook.com/",
    icon: FaFacebookF,
  },
  {
    name: "TikTok",
    href: import.meta.env.TIKTOK_URL || "https://www.tiktok.com/",
    icon: FaTiktok,
  },
  {
    name: "WhatsApp",
    href: import.meta.env.WHATSAPP_URL || "https://www.whatsapp.com/",
    icon: FaWhatsapp,
  },
];

export default function Footer({ user }) {
  return (
    <footer>
      <NavBar user={user} />
      <div className={classes.socialSection}>
        <span className={classes.socialTitle}>Connect with us</span>
        <div className={classes.socialLinks}>
          {socialLinks.map(({ name, href, icon: Icon }) => (
            <a
              key={name}
              className={classes.socialLink}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Visit our ${name} page`}
              title={name}
            >
              <Icon aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
