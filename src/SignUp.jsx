function SignUp() {
  return (
    <div>
      <h1>Créer un compte</h1>

      <input type="text" placeholder="Nom" />
      <input type="tel" placeholder="Numéro de téléphone" />
      <input type="password" placeholder="Mot de passe" />
      <input type="password" placeholder="Confirmer le mot de passe" />

      <button>Sign Up</button>
    </div>
  );
}

export default SignUp;