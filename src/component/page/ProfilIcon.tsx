import "../../css/component/part/ProfilIcon.css"

export default function ProfilIcon(props: { src: string }) {
    return (
        <img className="user-profil-picture" src={props.src} />
    )
}