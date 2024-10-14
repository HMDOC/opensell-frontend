import "../../css/component/part/ProfilIcon.css";
import { getCustomerIconUrl } from "../../services/FileService";
import { NO_PROFILE_ICON } from "./UserProfil";

export default function ProfilIcon(props: { src: string }) {
  return (
    <img
      className="user-profil-picture"
      src={props.src ? getCustomerIconUrl(props.src) : NO_PROFILE_ICON}
      alt="user-profile"
    />
  );
}
