import { useAuth } from '../auth/AuthContext';

export default function Header() {
  const { logout, user } = useAuth();

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>ChEMBL Explorer</div>

      <div>
        {user?.email}
        <button onClick={logout} style={{ marginLeft: 10 }}>
          Logout
        </button>
      </div>
    </div>
  );
}