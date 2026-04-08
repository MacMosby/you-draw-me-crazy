import logo from "../../assets/logo4.png";

export default function Logo() {
  return (
   <img
      src={logo}
      alt="You Draw Me Crazy logo"
      className="max-w-64 sm:max-w-96 max-h-64 sm:max-h-96 object-contain rounded-2xl"
    />
  )
}