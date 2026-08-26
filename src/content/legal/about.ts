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
  updated:'2026-08-25',
  requiresEntity:false,
  content:{
    tr:{
      title:'Boşa Gezme! nedir?',
      summary:'Boşa Gezme!, fiziksel ev ve yaşam mağazalarını değerlendirmeye yarayan bir topluluk platformudur. Perde, halı, mobilya, aydınlatma, mutfak ve ev tekstili gibi ev ve yaşam ürünlerini satan gerçek mağazaları bulmanızı ve oraya gerçekten gitmiş insanların değerlendirmelerini görmenizi sağlar. Platformun gelişimi adına size de değerlendirme yapma imkânı tanır. Platformun nihai amacı, tamamı platform kullanıcıları tarafından yapılmış değerlendirme havuzu ile, kullanıcıları en kısa sürede kendilerine en uygun mağazaya yönlendirmektir.',
      sections:[
        {id:'nasil',heading:'Nasıl çalışır?',blocks:[
          {p:'Döngü dört adımdan oluşur: keşfedin, gidin, değerlendirin, bir sonraki kişinin seçimine yardım edin.'},
          {p:'Önce ne aradığınızı kendi cümlelerinizle yazarsınız. Sonuçlar size en yakından en uzağa sıralanır; topluluğun daha önce değerlendirdiği ve sizinle aynı şehirde olan mağazalar öne çıkar. Bir mağazaya gittiğinizde, oradayken ziyaretinizi doğrulayıp değerlendirmenizi yapabilirsiniz.'},
        ]},
        {id:'satis',heading:'Boşa Gezme! ürün satıyor mu?',blocks:[
          {p:'Hayır. Bu platformda satış, sepete atma, sipariş verme veya ödeme işlevi yoktur. Hiçbir ürün buradan satın alınamaz.'},
          {p:'Boşa Gezme! satıcı, mağaza sahibi, tüccar veya herhangi bir mağazanın temsilcisi değildir. Stok, fiyat, çalışma saati veya ürün bulunabilirliği konusunda taraf değildir.'},
        ]},
        {id:'partner',heading:'Listelenen mağazalar iş ortağı mı?',blocks:[
          {p:'Bir mağazanın burada yer alması, o mağazayla aramızda bir ticari ilişki veya ortaklık bulunduğu anlamına gelmez. Mağazalar keşfedilebilir oldukları için listelenir.'},
          {p:'Ücretli yerleşim, sponsorluk veya bir mağazanın öne çıkarılması söz konusu olduğunda, bu durum ilgili yerde açıkça belirtilir. Etiketlenmemiş bir sonuç, ödeme karşılığı öne çıkarılmış değildir.'},
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
        {id:'katki',heading:'Katkı seviyesi ne işe yarar?',blocks:[
          {p:'Katkı seviyesi, yayımladığınız doğrulanmış değerlendirme sayısına göre topluluğa yaptığınız katkıyı gösterir. İlk değerlendirmede Yeni gezgin, 5 değerlendirmede Kaşif, 15 değerlendirmede Deneyimli, 40 değerlendirmede Rehber ve 100 değerlendirmede Usta Rehber olursunuz.'},
          {p:'Bu seviye para, indirim veya mağaza ayrıcalığı değildir. Profilinizde ve paylaşımlarınızda, diğer insanlara ne kadar deneyim aktardığınızı gösteren bir topluluk işaretidir.'},
        ]},
        {id:'konum',heading:'Mağaza konumları listelemeyi nasıl etkiliyor',blocks:[
          {p:'Sonuçlar mesafeye göre sıralanır, bu yüzden her arama bir konum gerektirir. Konumunuz, cihaz ayarlarından otomatik olarak alınabilir veya arama çubuğundan kendiniz bir konum girebilirsiniz.'},
          {p:'Konumunuzun tam olarak nasıl işlendiğini, neyin saklanıp neyin saklanmadığını konum gizliliği sayfasında ayrıntılı olarak bulabilirsiniz.'},
        ]},
        {id:'duzeltme',heading:'Mağazalara ait hatalı bilgi nasıl bildirilir?',blocks:[
          {p:'Bir mağazanın adresi, kategorisi veya durumu yanlışsa mağaza sayfasındaki “Mağaza bilgilerinde düzenleme öner.” bağlantısını kullanabilir veya info@bosagezme.com adresine yazabilirsiniz.'},
        ]},
        {id:'magaza-hesabi',heading:'Mağaza hesabı açabilir miyim?',blocks:[
          {p:'Şu anda mağaza sahipliği doğrulama süreci bulunmamaktadır.'},
        ]},
      ],
    },
    en:{
      title:'What is Boşa Gezme!?',
      summary:'Boşa Gezme! is a community platform for reviewing physical home and living stores. It helps you find real stores selling curtains, rugs, furniture, lighting, kitchenware, home textiles and other home and living products, and see reviews from people who actually visited them. You can also contribute your own review as the platform grows. Its ultimate aim is to use a review pool created entirely by platform users to direct each person to the store that suits them best, as quickly as possible.',
      sections:[
        {id:'nasil',heading:'How does it work?',blocks:[
          {p:'The loop has four steps: discover, visit, review, help the next person choose.'},
          {p:'First, you describe what you are looking for in your own words. Results are ordered from nearest to farthest; stores in your city that the community has already reviewed are prioritised. When you visit a store, you can verify your visit while you are there and submit your review.'},
        ]},
        {id:'satis',heading:'Does Boşa Gezme! sell products?',blocks:[
          {p:'No. This platform has no sales, add-to-cart, ordering or payment functionality. Nothing can be purchased here.'},
          {p:'Boşa Gezme! is not a seller, a store owner, a merchant, or an agent for any store. It is not a party to stock, pricing, opening hours or product availability.'},
        ]},
        {id:'partner',heading:'Are the stores listed here partners?',blocks:[
          {p:'A store appearing here does not mean there is a commercial relationship or partnership between it and Boşa Gezme!. Stores are listed because they are discoverable.'},
          {p:'Wherever paid placement, sponsorship or promotion of a store applies, it is marked clearly at the point you see it. A result without such a label was not promoted in exchange for payment.'},
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
        {id:'katki',heading:'What are contributor levels for?',blocks:[
          {p:'Your contributor level reflects how many verified reviews you have published. You become a New explorer after the first review, Explorer at 5, Seasoned at 15, Guide at 40, and Master guide at 100.'},
          {p:'A level is not money, a discount, or a store benefit. It is a community marker on your profile and contributions that shows how much first-hand experience you have shared.'},
        ]},
        {id:'konum',heading:'How do store locations affect listing?',blocks:[
          {p:'Results are ordered by distance, so every search needs a location. It can be read automatically from your device settings, or you can enter a location yourself in the search bar.'},
          {p:'You can find full details on how your location is processed, and what is and is not stored, on the location privacy page.'},
        ]},
        {id:'duzeltme',heading:'How can incorrect information about a store be reported?',blocks:[
          {p:'If a store’s address, category or status is wrong, use the “Suggest an edit to store information” link on its page or email info@bosagezme.com.'},
        ]},
        {id:'magaza-hesabi',heading:'Can I open a store account?',blocks:[
          {p:'There is currently no store ownership verification process.'},
        ]},
      ],
    },
    de:{
      title:'Was ist Boşa Gezme!?',
      summary:'Boşa Gezme! ist eine Community-Plattform zur Bewertung physischer Wohn- und Einrichtungsgeschäfte. Sie hilft dabei, echte Geschäfte für Vorhänge, Teppiche, Möbel, Beleuchtung, Küchenbedarf, Heimtextilien und andere Wohnprodukte zu finden und Bewertungen von Menschen zu lesen, die tatsächlich dort waren. Mit einer eigenen Bewertung kannst du ebenfalls zur Weiterentwicklung der Plattform beitragen. Das Ziel ist, Menschen mithilfe eines vollständig von der Community aufgebauten Bewertungspools so schnell wie möglich zum für sie passenden Geschäft zu führen.',
      sections:[
        {id:'nasil',heading:'Wie funktioniert es?',blocks:[
          {p:'Der Kreislauf hat vier Schritte: entdecken, hingehen, bewerten und der nächsten Person bei der Auswahl helfen.'},
          {p:'Zuerst beschreibst du in eigenen Worten, was du suchst. Die Ergebnisse werden von nah nach fern sortiert; bereits von der Community bewertete Geschäfte in deiner Stadt werden priorisiert. Wenn du ein Geschäft besuchst, kannst du deinen Besuch vor Ort bestätigen und deine Bewertung abgeben.'},
        ]},
        {id:'satis',heading:'Verkauft Boşa Gezme! Produkte?',blocks:[
          {p:'Nein. Es gibt auf dieser Plattform keinen Verkauf, keinen Warenkorb, keine Bestellung und keine Zahlungsfunktion. Hier kann nichts gekauft werden.'},
          {p:'Boşa Gezme! ist weder Verkäufer noch Geschäftsinhaber, Händler oder Vertreter eines Geschäfts und ist nicht Partei in Bezug auf Bestand, Preise, Öffnungszeiten oder Verfügbarkeit.'},
        ]},
        {id:'partner',heading:'Sind die gelisteten Geschäfte Partner?',blocks:[
          {p:'Dass ein Geschäft hier erscheint, bedeutet nicht, dass zwischen ihm und Boşa Gezme! eine geschäftliche Beziehung oder Partnerschaft besteht. Geschäfte werden gelistet, weil sie auffindbar sind.'},
          {p:'Wo bezahlte Platzierung, Sponsoring oder die Hervorhebung eines Geschäfts vorliegt, wird das an der betreffenden Stelle deutlich gekennzeichnet. Ein Ergebnis ohne solche Kennzeichnung wurde nicht gegen Bezahlung hervorgehoben.'},
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
        {id:'katki',heading:'Wozu dienen Beitragsstufen?',blocks:[
          {p:'Deine Beitragsstufe richtet sich nach der Zahl deiner veröffentlichten, bestätigten Bewertungen. Nach der ersten Bewertung bist du Neu unterwegs, bei 5 Entdecker, bei 15 Erfahren, bei 40 Guide und bei 100 Meister-Guide.'},
          {p:'Eine Stufe ist weder Geld noch Rabatt oder ein Vorteil bei einem Geschäft. Sie zeigt in deinem Profil und deinen Beiträgen, wie viel eigene Erfahrung du mit der Community geteilt hast.'},
        ]},
        {id:'konum',heading:'Wie beeinflussen Geschäftsstandorte die Reihenfolge?',blocks:[
          {p:'Ergebnisse werden nach Entfernung sortiert, deshalb benötigt jede Suche einen Standort. Er kann automatisch aus deinen Geräteeinstellungen übernommen oder von dir in der Suchleiste eingegeben werden.'},
          {p:'Ausführliche Informationen dazu, wie dein Standort verarbeitet wird und was gespeichert beziehungsweise nicht gespeichert wird, findest du auf der Seite zum Standortdatenschutz.'},
        ]},
        {id:'duzeltme',heading:'Wie kann ich fehlerhafte Angaben zu einem Geschäft melden?',blocks:[
          {p:'Wenn Adresse, Kategorie oder Status eines Geschäfts falsch sind, nutze den Link „Änderung der Geschäftsinformationen vorschlagen“ auf der Geschäftsseite oder schreibe an info@bosagezme.com.'},
        ]},
        {id:'magaza-hesabi',heading:'Kann ich ein Geschäftskonto eröffnen?',blocks:[
          {p:'Derzeit gibt es kein Verfahren zur Überprüfung der Geschäftsinhaberschaft.'},
        ]},
      ],
    },
    ru:{
      title:'Что такое Boşa Gezme!?',
      summary:'Boşa Gezme! — это платформа сообщества для оценки физических магазинов товаров для дома. Она помогает находить настоящие магазины штор, ковров, мебели, освещения, кухонных принадлежностей, домашнего текстиля и других товаров для дома и читать отзывы людей, которые действительно там побывали. Вы также можете внести свой вклад в развитие платформы, оставив отзыв. Конечная цель — с помощью полностью созданной пользователями базы отзывов как можно быстрее направить каждого в наиболее подходящий магазин.',
      sections:[
        {id:'nasil',heading:'Как это работает?',blocks:[
          {p:'Цикл состоит из четырёх шагов: найти, съездить, оценить и помочь следующему человеку с выбором.'},
          {p:'Сначала вы описываете своими словами, что ищете. Результаты сортируются от ближайших к дальним; магазины в вашем городе, уже оценённые сообществом, получают приоритет. Посетив магазин, вы можете на месте подтвердить визит и оставить отзыв.'},
        ]},
        {id:'satis',heading:'Продаёт ли Boşa Gezme! товары?',blocks:[
          {p:'Нет. На платформе нет продаж, корзины, заказов и оплаты. Здесь ничего нельзя купить.'},
          {p:'Boşa Gezme! не является продавцом, владельцем магазина, торговцем или представителем какого-либо магазина и не отвечает за наличие товара, цены, часы работы и доступность.'},
        ]},
        {id:'partner',heading:'Являются ли магазины партнёрами?',blocks:[
          {p:'Присутствие магазина здесь не означает наличия коммерческих отношений или партнёрства с Boşa Gezme!. Магазины перечислены потому, что их можно найти.'},
          {p:'Там, где применяется платное размещение, спонсорство или продвижение магазина, это явно обозначается на месте. Результат без такой пометки не продвигался за плату.'},
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
        {id:'katki',heading:'Для чего нужны уровни участника?',blocks:[
          {p:'Уровень участника зависит от количества опубликованных подтверждённых отзывов. После первого отзыва присваивается уровень Новичок, после 5 — Исследователь, после 15 — Опытный, после 40 — Гид, после 100 — Мастер-гид.'},
          {p:'Уровень не является деньгами, скидкой или привилегией магазина. Это знак сообщества в профиле и публикациях, показывающий, каким объёмом личного опыта вы поделились.'},
        ]},
        {id:'konum',heading:'Как местоположение магазинов влияет на порядок выдачи?',blocks:[
          {p:'Результаты сортируются по расстоянию, поэтому для каждого поиска требуется местоположение. Оно может определяться автоматически из настроек устройства, либо вы можете самостоятельно указать место в строке поиска.'},
          {p:'Подробности о том, как обрабатывается ваше местоположение и какие данные сохраняются или не сохраняются, приведены на странице о конфиденциальности геоданных.'},
        ]},
        {id:'duzeltme',heading:'Как сообщить об ошибочных сведениях о магазине?',blocks:[
          {p:'Если адрес, категория или статус магазина указаны неверно, воспользуйтесь ссылкой «Предложить исправление данных магазина» на его странице или напишите на info@bosagezme.com.'},
        ]},
        {id:'magaza-hesabi',heading:'Можно ли открыть аккаунт магазина?',blocks:[
          {p:'Сейчас процедуры подтверждения владения магазином нет.'},
        ]},
      ],
    },
  },
};
