import type {LegalDoc} from './types';

// Written answer-first so that each heading is a question a person or an answer engine
// actually asks, and each opening sentence can be quoted on its own without becoming
// misleading. Every claim is checked: there is no payment, checkout, cart or order code
// anywhere in either repository, and no store has any partnership relationship in the
// data model, so both can be stated flatly rather than hedged.
export const about:LegalDoc={
  slug:'about',
  version:'1.0',
  effective:'2026-08-18',
  updated:'2026-08-18',
  requiresEntity:false,
  content:{
    tr:{
      title:'Boşa Gezme! nedir?',
      summary:'Boşa Gezme!, gerçek ev ve yaşam mağazalarını keşfetmeye yarayan bir topluluk platformudur. Ürün satmaz; oraya gerçekten gitmiş insanların değerlendirmeleriyle, gitmeye değer olup olmadığına karar vermenize yardım eder.',
      sections:[
        {id:'nedir',heading:'Boşa Gezme! nedir?',blocks:[
          {p:'Boşa Gezme!, fiziksel ev ve yaşam mağazalarını keşfetmeye yarayan bir topluluk platformudur. Perde, halı, mobilya, aydınlatma, mutfak ve ev tekstili gibi ürünler satan gerçek dükkânları bulmanızı ve oraya gitmiş insanların ne bulduğunu okumanızı sağlar.'},
          {p:'Adı, çözmeye çalıştığı sorunu anlatır: bir mağazaya gidip aradığınızı bulamamak. Ürünün tamamı bu boşa giden yolculuğu azaltmak üzerine kuruludur.'},
        ]},
        {id:'nasil',heading:'Nasıl çalışır?',blocks:[
          {p:'Döngü dört adımdır: keşfedin, gidin, deneyiminizi yazın, bir sonraki kişinin keşfetmesine yardım edin.'},
          {p:'Ne aradığınızı kendi cümlelerinizle yazarsınız. Sonuçlar size en yakından en uzağa sıralanır; topluluğun daha önce değerlendirdiği ve sizinle aynı şehirde olan mağazalar öne çıkar. Bir mağazaya gittiğinizde, oradayken ziyaretinizi doğrulayıp deneyiminizi yazabilirsiniz.'},
        ]},
        {id:'satis',heading:'Boşa Gezme! ürün satıyor mu?',blocks:[
          {p:'Hayır. Bu platformda satış, sepet, sipariş veya ödeme işlevi yoktur. Hiçbir ürün burada satın alınamaz.'},
          {p:'Boşa Gezme! satıcı, mağaza sahibi, tüccar veya herhangi bir mağazanın temsilcisi değildir. Stok, fiyat, çalışma saati veya ürün bulunabilirliği konusunda taraf değildir.'},
        ]},
        {id:'partner',heading:'Listelenen mağazalar iş ortağı mı?',blocks:[
          {p:'Hayır. Bir mağazanın burada yer alması, o mağazayla aramızda herhangi bir ticari ilişki, anlaşma veya ortaklık olduğu anlamına gelmez.'},
          {p:'Mağazalar keşfedilebilir oldukları için listelenir, bir şey ödedikleri için değil. Şu anda ücretli yerleşim, sponsorluk veya reklam bulunmamaktadır.'},
        ]},
        {id:'kaynak',heading:'Mağaza bilgileri nereden geliyor?',blocks:[
          {p:'Mağaza adları, adresleri ve konumları büyük ölçüde Google Places üzerinden gelir. Bir mağaza sayfasında Google kaynaklı puan ve yorum sayısı görürseniz, bunlar Google\'a aittir ve bizim topluluk puanımızdan ayrı bir bölümde gösterilir.'},
          {p:'Bu iki veri kaynağı kasıtlı olarak birbirine karıştırılmaz. Topluluk puanı yalnızca Boşa Gezme! kullanıcılarının yazdığı değerlendirmelerden hesaplanır.'},
          {p:'Üçüncü taraf kaynaklardan gelen bilgiler eskimiş olabilir. Bir yere gitmeden önce mağazanın açık olduğunu doğrulamanızı öneririz.'},
        ]},
        {id:'degerlendirme',heading:'Değerlendirmeler nasıl çalışır?',blocks:[
          {p:'Bir mağaza için değerlendirme yazabilmek için önce o mağazanın yanında olduğunuzu doğrulamanız gerekir. Bu, değerlendirmelerin gerçekten oraya gitmiş insanlardan gelmesini sağlamak içindir.'},
          {p:'Değerlendirmeler yazanların kendi görüşleridir. Boşa Gezme! her değerlendirmeyi onaylamaz ve içeriğinden yazarı sorumludur.'},
        ]},
        {id:'konum',heading:'Konum keşfi nasıl etkiliyor?',blocks:[
          {p:'Sonuçlar mesafeye göre sıralanır, bu yüzden arama bir konum gerektirir. Konumunuzu cihazınızdan alabilir veya listeden bir yer seçebilirsiniz.'},
          {p:'Konumunuzun tam olarak nasıl işlendiğini, neyin saklanıp neyin saklanmadığını konum gizliliği sayfasında ayrıntılı olarak anlattık.'},
        ]},
        {id:'duzeltme',heading:'Yanlış mağaza bilgisi nasıl bildirilir?',blocks:[
          {p:'Bir mağazanın adresi, kategorisi veya durumu yanlışsa bize bildirebilirsiniz. Bildirim kanalları hazırlanma aşamasındadır ve tamamlandığında iletişim sayfasında yayımlanacaktır.'},
          {note:'Şu anda mağaza sahipliği doğrulama süreci bulunmamaktadır. Bir mağaza sayfasını yönettiğini beyan eden kişileri doğrulayan bir mekanizma yoktur.'},
        ]},
      ],
    },
    en:{
      title:'What is Boşa Gezme!?',
      summary:'Boşa Gezme! is a community platform for discovering real, physical home and living stores. It does not sell anything; it helps you decide whether a trip is worth making, using reviews from people who actually went.',
      sections:[
        {id:'nedir',heading:'What is Boşa Gezme!?',blocks:[
          {p:'Boşa Gezme! is a community platform for discovering physical home and living stores. It helps you find real shops selling things like curtains, rugs, furniture, lighting, kitchenware and home textiles, and read what people who went there actually found.'},
          {p:'The name describes the problem it addresses: travelling to a store and not finding what you came for. The whole product is built around making that wasted trip less likely.'},
        ]},
        {id:'nasil',heading:'How does it work?',blocks:[
          {p:'The loop has four steps: discover, visit, write about your experience, help the next person discover.'},
          {p:'You describe what you are looking for in your own words. Results are ordered from nearest to farthest, with stores the community has already reviewed in your own city coming first. When you go to a store, you can verify your visit while you are there and write about your experience.'},
        ]},
        {id:'satis',heading:'Does Boşa Gezme! sell products?',blocks:[
          {p:'No. There is no sale, cart, order or payment functionality on this platform. Nothing can be purchased here.'},
          {p:'Boşa Gezme! is not a seller, a store owner, a merchant, or an agent for any store. It is not a party to stock, pricing, opening hours or product availability.'},
        ]},
        {id:'partner',heading:'Are the stores listed here partners?',blocks:[
          {p:'No. A store appearing here does not mean there is any commercial relationship, agreement or partnership between that store and Boşa Gezme!.'},
          {p:'Stores are listed because they are discoverable, not because they paid for anything. There is currently no paid placement, sponsorship or advertising.'},
        ]},
        {id:'kaynak',heading:'Where does store information come from?',blocks:[
          {p:'Store names, addresses and locations largely come from Google Places. Where you see a Google rating and review count on a store page, those belong to Google and are shown in a separate panel from our own community rating.'},
          {p:'The two sources are deliberately never mixed. The community rating is calculated only from reviews written by Boşa Gezme! users.'},
          {p:'Information from third-party sources can be out of date. We recommend confirming that a store is open before travelling to it.'},
        ]},
        {id:'degerlendirme',heading:'How do reviews work?',blocks:[
          {p:'To write a review of a store, you first have to confirm that you are at that store. This is what keeps reviews coming from people who genuinely went.'},
          {p:'Reviews are the opinions of the people who wrote them. Boşa Gezme! does not endorse every review, and their authors are responsible for their content.'},
        ]},
        {id:'konum',heading:'How does location affect discovery?',blocks:[
          {p:'Results are ordered by distance, which is why search needs a location. You can take it from your device or choose a place from a list.'},
          {p:'Exactly how your location is processed, and what is and is not stored, is set out in detail on the location privacy page.'},
        ]},
        {id:'duzeltme',heading:'How can incorrect store information be reported?',blocks:[
          {p:'If a store’s address, category or status is wrong, you can tell us. Reporting channels are being prepared and will be published on the contact page once complete.'},
          {note:'There is currently no store ownership verification process. No mechanism verifies people who claim to manage a store page.'},
        ]},
      ],
    },
    de:{
      title:'Was ist Boşa Gezme!?',
      summary:'Boşa Gezme! ist eine Community-Plattform zum Entdecken echter Wohn- und Einrichtungsgeschäfte. Sie verkauft nichts, sondern hilft mit Bewertungen von Menschen, die tatsächlich dort waren, zu entscheiden, ob sich der Weg lohnt.',
      sections:[
        {id:'nedir',heading:'Was ist Boşa Gezme!?',blocks:[
          {p:'Boşa Gezme! ist eine Community-Plattform zum Entdecken physischer Wohn- und Einrichtungsgeschäfte. Sie hilft, echte Läden für Vorhänge, Teppiche, Möbel, Beleuchtung, Küchenbedarf und Heimtextilien zu finden und zu lesen, was Besucherinnen und Besucher dort tatsächlich vorgefunden haben.'},
          {p:'Der Name beschreibt das Problem: zu einem Geschäft zu fahren und das Gesuchte nicht zu finden. Das gesamte Produkt ist darauf ausgerichtet, diesen vergeblichen Weg unwahrscheinlicher zu machen.'},
        ]},
        {id:'nasil',heading:'Wie funktioniert es?',blocks:[
          {p:'Der Kreislauf hat vier Schritte: entdecken, hingehen, die Erfahrung aufschreiben, der nächsten Person beim Entdecken helfen.'},
          {p:'Du beschreibst in eigenen Worten, was du suchst. Die Ergebnisse werden von nah nach fern sortiert, wobei Geschäfte in deiner Stadt, die die Community bereits bewertet hat, zuerst erscheinen. Vor Ort kannst du deinen Besuch bestätigen und deine Erfahrung schreiben.'},
        ]},
        {id:'satis',heading:'Verkauft Boşa Gezme! Produkte?',blocks:[
          {p:'Nein. Es gibt auf dieser Plattform keinen Verkauf, keinen Warenkorb, keine Bestellung und keine Zahlungsfunktion. Hier kann nichts gekauft werden.'},
          {p:'Boşa Gezme! ist weder Verkäufer noch Geschäftsinhaber, Händler oder Vertreter eines Geschäfts und ist nicht Partei in Bezug auf Bestand, Preise, Öffnungszeiten oder Verfügbarkeit.'},
        ]},
        {id:'partner',heading:'Sind die gelisteten Geschäfte Partner?',blocks:[
          {p:'Nein. Dass ein Geschäft hier erscheint, bedeutet nicht, dass zwischen diesem Geschäft und Boşa Gezme! eine geschäftliche Beziehung, Vereinbarung oder Partnerschaft besteht.'},
          {p:'Geschäfte werden gelistet, weil sie auffindbar sind, nicht weil sie dafür bezahlt haben. Es gibt derzeit keine bezahlte Platzierung, kein Sponsoring und keine Werbung.'},
        ]},
        {id:'kaynak',heading:'Woher stammen die Geschäftsinformationen?',blocks:[
          {p:'Namen, Adressen und Standorte stammen überwiegend aus Google Places. Wo auf einer Geschäftsseite eine Google-Bewertung und Bewertungsanzahl erscheint, gehört diese Google und wird getrennt von unserer Community-Bewertung dargestellt.'},
          {p:'Die beiden Quellen werden bewusst nie vermischt. Die Community-Bewertung wird ausschließlich aus Bewertungen von Boşa Gezme!-Nutzenden berechnet.'},
          {p:'Informationen aus Drittquellen können veraltet sein. Wir empfehlen, vor der Fahrt zu prüfen, ob ein Geschäft geöffnet ist.'},
        ]},
        {id:'degerlendirme',heading:'Wie funktionieren Bewertungen?',blocks:[
          {p:'Um ein Geschäft zu bewerten, musst du zunächst bestätigen, dass du dort bist. So bleiben Bewertungen bei Menschen, die tatsächlich dort waren.'},
          {p:'Bewertungen sind die Meinungen ihrer Verfasserinnen und Verfasser. Boşa Gezme! macht sich nicht jede Bewertung zu eigen; für den Inhalt sind die Verfassenden verantwortlich.'},
        ]},
        {id:'konum',heading:'Wie beeinflusst der Standort das Entdecken?',blocks:[
          {p:'Ergebnisse werden nach Entfernung sortiert, deshalb benötigt die Suche einen Standort. Du kannst ihn von deinem Gerät übernehmen oder einen Ort aus einer Liste wählen.'},
          {p:'Wie dein Standort genau verarbeitet wird und was gespeichert wird, steht ausführlich auf der Seite zum Standortdatenschutz.'},
        ]},
        {id:'duzeltme',heading:'Wie melde ich falsche Geschäftsangaben?',blocks:[
          {p:'Wenn Adresse, Kategorie oder Status eines Geschäfts falsch sind, kannst du uns das mitteilen. Die Meldewege werden vorbereitet und nach Fertigstellung auf der Kontaktseite veröffentlicht.'},
          {note:'Derzeit gibt es kein Verfahren zur Überprüfung der Geschäftsinhaberschaft. Es existiert kein Mechanismus, der Personen prüft, die angeben, eine Geschäftsseite zu verwalten.'},
        ]},
      ],
    },
    ru:{
      title:'Что такое Boşa Gezme!?',
      summary:'Boşa Gezme! — это сообщество для поиска настоящих магазинов товаров для дома. Платформа ничего не продаёт: она помогает решить, стоит ли ехать, опираясь на отзывы тех, кто там действительно был.',
      sections:[
        {id:'nedir',heading:'Что такое Boşa Gezme!?',blocks:[
          {p:'Boşa Gezme! — это платформа сообщества для поиска физических магазинов товаров для дома. Она помогает найти настоящие магазины со шторами, коврами, мебелью, освещением, посудой и домашним текстилем и прочитать, что там нашли побывавшие люди.'},
          {p:'Название описывает проблему, которую платформа решает: приехать в магазин и не найти то, за чем ехали. Весь продукт построен вокруг того, чтобы такие поездки случались реже.'},
        ]},
        {id:'nasil',heading:'Как это работает?',blocks:[
          {p:'Цикл состоит из четырёх шагов: найти, съездить, описать свой опыт, помочь следующему.'},
          {p:'Вы описываете своими словами, что ищете. Результаты сортируются от ближайших к дальним, причём магазины в вашем городе, уже оценённые сообществом, идут первыми. Находясь в магазине, вы можете подтвердить визит и написать отзыв.'},
        ]},
        {id:'satis',heading:'Продаёт ли Boşa Gezme! товары?',blocks:[
          {p:'Нет. На платформе нет продаж, корзины, заказов и оплаты. Здесь ничего нельзя купить.'},
          {p:'Boşa Gezme! не является продавцом, владельцем магазина, торговцем или представителем какого-либо магазина и не отвечает за наличие товара, цены, часы работы и доступность.'},
        ]},
        {id:'partner',heading:'Являются ли магазины партнёрами?',blocks:[
          {p:'Нет. Присутствие магазина здесь не означает наличия коммерческих отношений, договора или партнёрства с Boşa Gezme!.'},
          {p:'Магазины перечислены потому, что их можно найти, а не потому, что они за это заплатили. Платного размещения, спонсорства и рекламы сейчас нет.'},
        ]},
        {id:'kaynak',heading:'Откуда берутся сведения о магазинах?',blocks:[
          {p:'Названия, адреса и координаты в основном поступают из Google Places. Если на странице магазина показаны рейтинг и число отзывов Google, они принадлежат Google и отображаются отдельно от рейтинга нашего сообщества.'},
          {p:'Эти два источника намеренно никогда не смешиваются. Рейтинг сообщества рассчитывается только по отзывам пользователей Boşa Gezme!.'},
          {p:'Сведения из сторонних источников могут устареть. Рекомендуем убедиться, что магазин открыт, прежде чем ехать.'},
        ]},
        {id:'degerlendirme',heading:'Как работают отзывы?',blocks:[
          {p:'Чтобы написать отзыв о магазине, нужно сначала подтвердить, что вы находитесь в нём. Так отзывы остаются от людей, которые действительно там были.'},
          {p:'Отзывы отражают мнение их авторов. Boşa Gezme! не поддерживает каждый отзыв, за содержание отвечают авторы.'},
        ]},
        {id:'konum',heading:'Как местоположение влияет на поиск?',blocks:[
          {p:'Результаты сортируются по расстоянию, поэтому поиску нужно местоположение. Его можно взять с устройства или выбрать место из списка.'},
          {p:'Как именно обрабатывается ваше местоположение и что сохраняется, подробно описано на странице о конфиденциальности геоданных.'},
        ]},
        {id:'duzeltme',heading:'Как сообщить о неверных данных магазина?',blocks:[
          {p:'Если адрес, категория или статус магазина указаны неверно, сообщите нам. Каналы для обращений готовятся и будут опубликованы на странице контактов.'},
          {note:'Процедуры подтверждения владения магазином сейчас нет. Механизм проверки лиц, заявляющих об управлении страницей магазина, отсутствует.'},
        ]},
      ],
    },
  },
};
