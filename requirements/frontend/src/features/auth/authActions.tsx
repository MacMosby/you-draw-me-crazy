import { Button } from "../../components/button.tsx";
import { useNavigate } from "react-router-dom";

export default function AuthActions() {
	const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-3 w-full max-w-[280px]">
      <Button onClick={() => navigate("/login")}>Log in</Button>
      <Button variant="secondary" onClick={() => navigate("/sign-up")}>Sign up</Button>
    </div>
  )
}