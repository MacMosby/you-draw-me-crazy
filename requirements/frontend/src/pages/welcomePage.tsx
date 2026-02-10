import AuthLayout from "../layouts/authLayout.tsx"
import AuthActions from "../features/auth/authActions.tsx"
import Logo from "../features/auth/logo.tsx"
import { Card } from "../components/card.tsx";
import Footer from "../layouts/footer.tsx";
import PageOrnaments from "../components/pageOrnaments.tsx";

export default function WelcomePage() {
  return (
    <PageOrnaments>
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center px-6">
          <AuthLayout>
            <Card>
              <div className="flex flex-col items-center gap-4">
                <Logo />
                <AuthActions />
              </div>
            </Card>
          </AuthLayout>
        </div>
        <Footer />
      </div>
    </PageOrnaments>
  );
}