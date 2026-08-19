import {AdminSignIn} from './AdminSignIn';

// One message for "not signed in" and "not an administrator". The backend answers 404 to a
// non-administrator on purpose, and repeating that distinction here would give it away.
export function AccessDenied(){
  return <div className="admin-gate">
    <h1>Yönetim paneli</h1>
    <p className="admin-lead">
      Bu panel yalnızca yetkili adreslere açıktır. Devam etmek için e-posta adresine gelen
      tek kullanımlık kodla giriş yap.
    </p>
    <AdminSignIn/>
  </div>;
}
