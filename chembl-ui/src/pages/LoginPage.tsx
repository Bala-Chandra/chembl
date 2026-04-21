import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { api } from '../api/axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async () => {
    const res = await api.post('/auth/login', {
      email,
      password,
    });

    login(res.data);

    if (res.data.user.roles.includes('admin')) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: '100px auto' }}>
      <h2>Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={onSubmit}>Login</button>
    </div>
  );
}