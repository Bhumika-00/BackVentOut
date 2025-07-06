function Login() {
  const googleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };
  return (
    <div>
      <h2>Login Page</h2>
      <button onClick={googleLogin}>Login with Google</button>
    </div>
  );
}
export default Login;