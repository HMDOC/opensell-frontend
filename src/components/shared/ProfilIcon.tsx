import "@css/component/part/ProfilIcon.css";

export default function ProfilIcon(props: { src?: string , className?: string }) {
    return (
        <img className={`user-profil-picture ${props.className}`} src={props.src ? props.src : "https://cdn-icons-png.freepik.com/512/149/149071.png"} />
    )
}