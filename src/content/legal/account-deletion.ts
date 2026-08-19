import type {LegalDoc} from './types';

// Checked line by line against the deletion transaction in internal/user/service.go and
// reactivateUser in internal/auth/service.go. Two facts drive this page and neither may be
// softened: the email address is deliberately retained so the account can be reactivated,
// and reactivation restores the account but never the content, which stays blanked.
export const accountDeletion:LegalDoc={
  slug:'account-deletion',
  version:'1.0',
  effective:'2026-08-18',
  updated:'2026-08-18',
  requiresEntity:false,
  content:{
    tr:{
      title:'Hesabınızı silmek',
      summary:'Hesabınızı profil sayfanızdan kendiniz silebilirsiniz. Bu sayfa neyin silindiğini, neyin anonimleştirildiğini ve neyin bilerek saklandığını tek tek anlatır.',
      sections:[
        {id:'nasil',heading:'Nasıl silinir',blocks:[
          {p:'Profil sayfanızın en altındaki bölümden hesabınızı silebilirsiniz. İşlem için bizimle yazışmanız gerekmez.'},
        ]},
        {id:'silinenler',heading:'Silinenler',blocks:[
          {p:'Silme işlemi tek bir işlemde şunları kalıcı olarak kaldırır:'},
          {ul:[
            'Beğenileriniz',
            'Takip ettikleriniz ve sizi takip edenler',
            'Favorileriniz',
            'Arama geçmişiniz',
            'Ziyaret doğrulamalarınız',
            'Bildirim tercihleriniz ve bekleyen bildirimleriniz',
            'Kayıtlı bildirim cihazlarınız',
            'İlişki durumu, çocuk yaş aralıkları, konut durumu, meslek, yaş aralığı ve ilgi alanları dahil özel profil bilgileriniz',
            'Kaydettiğiniz keşif konumunuz',
            'E-posta adresinize ait doğrulama kodları ve bekleyen e-postalar',
          ]},
        ]},
        {id:'anonimlestirilenler',heading:'Silinmeyip anonimleştirilenler',blocks:[
          {p:'Yazdığınız değerlendirmelerin ve yorumların metni boşaltılır ve içerik kaldırılmış olarak işaretlenir. Kayıtların kendisi, bağlı oldukları mağaza istatistiklerinin ve konuşma zincirlerinin tutarlı kalması için veritabanında kalır ancak içerikleri okunamaz.'},
          {p:'Görünen profiliniz anonimleştirilir: kullanıcı adınız serbest bırakılır, görünen adınız "Deleted user" olur, biyografiniz, şehriniz ve profil görseliniz kaldırılır.'},
          {p:'Yüklediğiniz görseller silinmiş olarak işaretlenir. Ürün içi analitik kayıtlarındaki kullanıcı bağlantısı koparılır.'},
          {p:'Tüm oturumlarınız iptal edilir, yani açık olan diğer cihazlardan da çıkış yapılmış olur.'},
        ]},
        {id:'saklananlar',heading:'Bilerek saklanan tek şey',blocks:[
          {p:'E-posta adresiniz hesap kaydında saklanmaya devam eder. Hesap "etkin değil" durumuna alınır ve silinme tarihi işaretlenir.'},
          {p:'Bunun sebebi şudur: aynı e-posta adresiyle tekrar giriş yaparsanız hesabınız yeniden etkinleştirilir. Adres saklanmasaydı bu mümkün olmazdı. Adres, yeni birinin aynı e-postayla kayıt olmasını da engellemez.'},
          {note:'Bu, silme işleminin "her şey gider" anlamına gelmediği tek noktadır ve bu yüzden burada açıkça yazılmıştır.'},
        ]},
        {id:'geri-donus',heading:'Yeniden etkinleştirme',blocks:[
          {p:'Aynı e-posta adresiyle yeniden giriş yaparsanız hesabınız etkinleştirilir ve size varsayılan bir kullanıcı adı ile görünen ad verilir.'},
          {p:'Hesabınız geri gelir, içeriğiniz gelmez. Silinen değerlendirmelerinizin ve yorumlarınızın metni boşaltılmıştır ve geri getirilemez. Beğenileriniz, favorileriniz, takipleriniz ve arama geçmişiniz de geri gelmez.'},
        ]},
      ],
    },
    en:{
      title:'Deleting your account',
      summary:'You can delete your account yourself from your profile page. This page states exactly what is deleted, what is anonymised, and the one thing that is deliberately kept.',
      sections:[
        {id:'nasil',heading:'How to delete',blocks:[
          {p:'You can delete your account from the section at the bottom of your profile page. You do not need to contact us.'},
        ]},
        {id:'silinenler',heading:'What is deleted',blocks:[
          {p:'Deletion permanently removes the following, in a single transaction:'},
          {ul:[
            'Your likes',
            'Everyone you follow and everyone following you',
            'Your favourites',
            'Your search history',
            'Your visit verifications',
            'Your notification preferences and any pending notifications',
            'Your registered notification devices',
            'Your private profile details, including relationship status, children’s age ranges, housing status, occupation, age range and interests',
            'The discovery location you saved',
            'Verification codes and pending emails for your address',
          ]},
        ]},
        {id:'anonimlestirilenler',heading:'What is anonymised rather than deleted',blocks:[
          {p:'The text of your reviews and comments is emptied and the entries are marked as removed. The records themselves stay in the database so that store statistics and conversation threads remain consistent, but their content is no longer readable.'},
          {p:'Your visible profile is anonymised: your username is released, your display name becomes "Deleted user", and your bio, city and profile image are removed.'},
          {p:'Images you uploaded are marked deleted. The link between you and internal product analytics records is severed.'},
          {p:'All your sessions are revoked, so you are signed out on other devices too.'},
        ]},
        {id:'saklananlar',heading:'The one thing deliberately kept',blocks:[
          {p:'Your email address remains on the account record. The account is set to inactive and the deletion date is recorded.'},
          {p:'The reason is reactivation: if you sign in again with the same email address, your account comes back. That would not be possible if the address were removed. Keeping it also does not stop someone else from registering with that address.'},
          {note:'This is the single point at which deletion does not mean "everything is gone", which is why it is stated plainly here.'},
        ]},
        {id:'geri-donus',heading:'Reactivation',blocks:[
          {p:'Signing in again with the same email address reactivates your account and gives you a fresh default username and display name.'},
          {p:'Your account returns; your content does not. The text of your deleted reviews and comments was emptied and cannot be restored. Your likes, favourites, follows and search history do not return either.'},
        ]},
      ],
    },
    de:{
      title:'Konto löschen',
      summary:'Du kannst dein Konto selbst über deine Profilseite löschen. Diese Seite nennt genau, was gelöscht, was anonymisiert und was bewusst aufbewahrt wird.',
      sections:[
        {id:'nasil',heading:'So löschst du',blocks:[
          {p:'Du kannst dein Konto im Abschnitt am Ende deiner Profilseite löschen. Eine Kontaktaufnahme mit uns ist nicht erforderlich.'},
        ]},
        {id:'silinenler',heading:'Was gelöscht wird',blocks:[
          {p:'Die Löschung entfernt Folgendes in einer einzigen Transaktion dauerhaft:'},
          {ul:[
            'Deine Likes',
            'Alle, denen du folgst, und alle, die dir folgen',
            'Deine Favoriten',
            'Deinen Suchverlauf',
            'Deine Besuchsbestätigungen',
            'Deine Benachrichtigungseinstellungen und ausstehende Benachrichtigungen',
            'Deine registrierten Benachrichtigungsgeräte',
            'Deine privaten Profilangaben, einschließlich Beziehungsstatus, Altersgruppen von Kindern, Wohnsituation, Beruf, Altersgruppe und Interessen',
            'Den von dir gespeicherten Entdeckungsstandort',
            'Bestätigungscodes und ausstehende E-Mails für deine Adresse',
          ]},
        ]},
        {id:'anonimlestirilenler',heading:'Was anonymisiert statt gelöscht wird',blocks:[
          {p:'Der Text deiner Bewertungen und Kommentare wird geleert und die Einträge als entfernt markiert. Die Datensätze selbst bleiben in der Datenbank, damit Geschäftsstatistiken und Kommentarverläufe konsistent bleiben, ihr Inhalt ist jedoch nicht mehr lesbar.'},
          {p:'Dein sichtbares Profil wird anonymisiert: Dein Benutzername wird freigegeben, dein Anzeigename wird „Deleted user“, und Biografie, Stadt und Profilbild werden entfernt.'},
          {p:'Von dir hochgeladene Bilder werden als gelöscht markiert. Die Verbindung zwischen dir und internen Produktanalysedaten wird getrennt.'},
          {p:'Alle deine Sitzungen werden widerrufen, du wirst also auch auf anderen Geräten abgemeldet.'},
        ]},
        {id:'saklananlar',heading:'Das Einzige, was bewusst bleibt',blocks:[
          {p:'Deine E-Mail-Adresse bleibt im Kontodatensatz. Das Konto wird auf inaktiv gesetzt und das Löschdatum vermerkt.'},
          {p:'Der Grund ist die Reaktivierung: Meldest du dich erneut mit derselben E-Mail-Adresse an, kommt dein Konto zurück. Ohne die gespeicherte Adresse wäre das nicht möglich. Sie hindert auch niemand anderen daran, sich mit dieser Adresse zu registrieren.'},
          {note:'Dies ist der einzige Punkt, an dem Löschung nicht „alles ist weg“ bedeutet, und deshalb steht er hier ausdrücklich.'},
        ]},
        {id:'geri-donus',heading:'Reaktivierung',blocks:[
          {p:'Eine erneute Anmeldung mit derselben E-Mail-Adresse reaktiviert dein Konto und vergibt einen neuen Standard-Benutzernamen und Anzeigenamen.'},
          {p:'Dein Konto kehrt zurück, deine Inhalte nicht. Der Text deiner gelöschten Bewertungen und Kommentare wurde geleert und kann nicht wiederhergestellt werden. Likes, Favoriten, Gefolgte und Suchverlauf kehren ebenfalls nicht zurück.'},
        ]},
      ],
    },
    ru:{
      title:'Удаление аккаунта',
      summary:'Вы можете удалить аккаунт самостоятельно на странице профиля. Здесь точно указано, что удаляется, что обезличивается и что сохраняется намеренно.',
      sections:[
        {id:'nasil',heading:'Как удалить',blocks:[
          {p:'Аккаунт удаляется в разделе внизу страницы профиля. Связываться с нами не нужно.'},
        ]},
        {id:'silinenler',heading:'Что удаляется',blocks:[
          {p:'Удаление безвозвратно убирает следующее, одной транзакцией:'},
          {ul:[
            'Ваши отметки «нравится»',
            'Ваши подписки и подписчиков',
            'Ваше избранное',
            'Историю поиска',
            'Подтверждения визитов',
            'Настройки уведомлений и ожидающие уведомления',
            'Зарегистрированные устройства для уведомлений',
            'Приватные данные профиля, включая семейное положение, возрастные группы детей, жилищную ситуацию, профессию, возрастную группу и интересы',
            'Сохранённое вами место поиска',
            'Коды подтверждения и ожидающие письма для вашего адреса',
          ]},
        ]},
        {id:'anonimlestirilenler',heading:'Что обезличивается, а не удаляется',blocks:[
          {p:'Текст ваших отзывов и комментариев очищается, а записи помечаются как удалённые. Сами записи остаются в базе, чтобы статистика магазинов и ветки обсуждений оставались согласованными, но их содержимое больше не читается.'},
          {p:'Ваш видимый профиль обезличивается: имя пользователя освобождается, отображаемое имя становится «Deleted user», а описание, город и изображение профиля удаляются.'},
          {p:'Загруженные вами изображения помечаются как удалённые. Связь между вами и записями внутренней аналитики разрывается.'},
          {p:'Все ваши сессии отзываются, то есть выход выполняется и на других устройствах.'},
        ]},
        {id:'saklananlar',heading:'Единственное, что сохраняется намеренно',blocks:[
          {p:'Ваш адрес электронной почты остаётся в записи аккаунта. Аккаунт переводится в неактивное состояние, дата удаления фиксируется.'},
          {p:'Причина — восстановление: если вы снова войдёте с тем же адресом, аккаунт вернётся. Без сохранённого адреса это было бы невозможно. При этом он не мешает другому человеку зарегистрироваться с этим адресом.'},
          {note:'Это единственный случай, когда удаление не означает «исчезло всё», поэтому он указан прямо.'},
        ]},
        {id:'geri-donus',heading:'Восстановление',blocks:[
          {p:'Повторный вход с тем же адресом электронной почты восстанавливает аккаунт и присваивает новое имя пользователя и отображаемое имя по умолчанию.'},
          {p:'Аккаунт возвращается, содержимое — нет. Текст удалённых отзывов и комментариев был очищен и не восстанавливается. Отметки «нравится», избранное, подписки и история поиска также не возвращаются.'},
        ]},
      ],
    },
  },
};
