export default function ForgotPasswordConfirmationPage() {
  return (
    <div
      className="w-screen min-h-screen flex items-center text-rose-500 justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://xcwrhyjbfgzsaslstssc.supabase.co/storage/v1/object/public/storage//watermelon-woman-background.webp')",
      }}
    >
      <div className="bg-red-100 border border-rose-500 bg-opacity-90 backdrop-blur-md rounded-2xl shadow-xl p-10 m-10 max-w-md w-full">
        <div className="flex flex-col gap-3">
          <h1 className="text-center font-medium text-xl">Email envoyé</h1>
          <p className="text-center text-sm text-black font-light">
            Si un compte existe avec cette adresse email, un lien de
            réinitialisation vous a été envoyé. Veuillez vérifier votre boîte de
            réception et suivre les instructions.
          </p>
          <div className="mt-6 w-full justify-center items-center flex">
            <a
              href="/login"
              className="rounded-md border px-6 py-2 border-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
            >
              Retour à la connexion
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
