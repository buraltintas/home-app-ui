// One message for both "not signed in" and "not an administrator". The backend answers 404
// to a non-administrator on purpose, and repeating that distinction here would give it away.
export function AccessDenied(){
  return <>
    <h1>Bu sayfaya erişemiyorsun</h1>
    <p className="admin-lead">
      Yönetim paneli yalnızca yetkili adreslere açıktır. Yetkili bir hesapla giriş yaptıysan
      ve bu ekranı görüyorsan, oturumun sona ermiş olabilir.
    </p>
  </>;
}
