import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

function Home() {
  return <>home</>;
}

function Register() {
  return <>register</>;
}

function Login() {
  return <>login</>;
}

export default App;
