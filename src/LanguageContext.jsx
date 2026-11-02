
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const LanguageContext = createContext(null)
const STORAGE_KEY = 'dzshop_language'

const translations = {
  en: {
    home: 'Home',
    products: 'Products',
    favorites: 'Favorites',
    contact: 'Contact',
    bag: 'Bag',
    categories: 'Categories',
    admin: 'Admin',
    account: 'Account',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    searchPlaceholder: 'Search products, brands or categories...',
    clearSearch: 'Clear search',
    suggestions: 'Suggestions',
    noProductsFound: 'No products found',
    tryAnotherSearch: 'Try another product, brand or category.',
    recentSearches: 'Recent searches',
    clearAll: 'Clear all',
    searchHint: 'Search by product, brand or category.',
    tagline: 'Quality · Price · Trust',

    catAll: 'All',
    catClothing: 'Clothing',
    catShoes: 'Shoes',
    catBags: 'Bags',
    catWatches: 'Watches',
    catPhones: 'Phones',
    catAudio: 'Audio',
    catComputers: 'Computers',
    catGaming: 'Gaming',
    catPersonalCare: 'Personal Care',
    catAccessories: 'Accessories',
    catSports: 'Sports',
    catMakeup: 'Makeup',
    catHome: 'Home',
    catCamping: 'Camping',
    catDecor: 'Decor',
    catArtCrafts: 'Art & Crafts',
    catReading: 'Reading',
    catOffice: 'Office',

    myAccount: 'My Account',
    manageAccount: 'Manage your account and track your orders.',
    welcome: 'Welcome to DZShop',
    customerAccount: 'CUSTOMER ACCOUNT',
    myFavorites: 'My Favorites',
    savedItems: 'saved item(s)',
    myCart: 'My Cart',
    cartItems: 'item(s)',
    needHelp: 'Need Help?',
    contactDZShop: 'Contact DZShop',
    accountSecurity: 'ACCOUNT SECURITY',
    added: 'Added',
    yourActivity: 'YOUR ACTIVITY',
    myOrders: 'My Orders',
    orders: 'order(s)',
    loadingOrders: 'Loading your orders...',
    ordersError: 'Unable to load your orders.',
    tryAgain: 'Try Again',
    noOrders: 'No orders yet',
    noOrdersHint: 'Your orders will appear here after your first purchase.',
    browseProducts: 'Browse Products',
    order: 'Order',
    dateUnavailable: 'Date unavailable',
    pending: 'Pending',
    confirmed: 'Confirmed',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    details: 'Details',
    orderFallback: 'DZShop Order',
    language: 'Language',
    appearance: 'Appearance',
    darkMode: 'Dark mode',
    lightMode: 'Light mode',
    english: 'English',
    french: 'Français',
    arabic: 'العربية',
  },

  fr: {
    home: 'Accueil',
    products: 'Produits',
    favorites: 'Favoris',
    contact: 'Contact',
    bag: 'Panier',
    categories: 'Catégories',
    admin: 'Administration',
    account: 'Mon compte',
    signIn: 'Connexion',
    signUp: 'Créer un compte',
    signOut: 'Déconnexion',
    searchPlaceholder: 'Rechercher des produits, marques ou catégories...',
    clearSearch: 'Effacer la recherche',
    suggestions: 'Suggestions',
    noProductsFound: 'Aucun produit trouvé',
    tryAnotherSearch: 'Essayez un autre produit, une marque ou une catégorie.',
    recentSearches: 'Recherches récentes',
    clearAll: 'Tout effacer',
    searchHint: 'Rechercher par produit, marque ou catégorie.',
    tagline: 'Qualité · Prix · Confiance',

    catAll: 'Tout',
    catClothing: 'Vêtements',
    catShoes: 'Chaussures',
    catBags: 'Sacs',
    catWatches: 'Montres',
    catPhones: 'Téléphones',
    catAudio: 'Audio',
    catComputers: 'Ordinateurs',
    catGaming: 'Jeux vidéo',
    catPersonalCare: 'Soins personnels',
    catAccessories: 'Accessoires',
    catSports: 'Sport',
    catMakeup: 'Maquillage',
    catHome: 'Maison',
    catCamping: 'Camping',
    catDecor: 'Décoration',
    catArtCrafts: 'Art et création',
    catReading: 'Lecture',
    catOffice: 'Bureau',

    myAccount: 'Mon compte',
    manageAccount: 'Gérez votre compte et suivez vos commandes.',
    welcome: 'Bienvenue chez DZShop',
    customerAccount: 'COMPTE CLIENT',
    myFavorites: 'Mes favoris',
    savedItems: 'article(s) enregistré(s)',
    myCart: 'Mon panier',
    cartItems: 'article(s)',
    needHelp: 'Besoin d’aide ?',
    contactDZShop: 'Contacter DZShop',
    accountSecurity: 'SÉCURITÉ DU COMPTE',
    added: 'Ajoutée le',
    yourActivity: 'VOTRE ACTIVITÉ',
    myOrders: 'Mes commandes',
    orders: 'commande(s)',
    loadingOrders: 'Chargement de vos commandes...',
    ordersError: 'Impossible de charger vos commandes.',
    tryAgain: 'Réessayer',
    noOrders: 'Aucune commande',
    noOrdersHint: 'Vos commandes apparaîtront ici après votre premier achat.',
    browseProducts: 'Voir les produits',
    order: 'Commande',
    dateUnavailable: 'Date indisponible',
    pending: 'En attente',
    confirmed: 'Confirmée',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée',
    details: 'Détails',
    orderFallback: 'Commande DZShop',
    language: 'Langue',
    appearance: 'Apparence',
    darkMode: 'Mode sombre',
    lightMode: 'Mode clair',
    english: 'English',
    french: 'Français',
    arabic: 'العربية',
  },

  ar: {
    home: 'الرئيسية',
    products: 'المنتجات',
    favorites: 'المفضلة',
    contact: 'اتصل بنا',
    bag: 'السلة',
    categories: 'التصنيفات',
    admin: 'الإدارة',
    account: 'حسابي',
    signIn: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    signOut: 'تسجيل الخروج',
    searchPlaceholder: 'ابحث عن المنتجات أو العلامات أو التصنيفات...',
    clearSearch: 'مسح البحث',
    suggestions: 'اقتراحات',
    noProductsFound: 'لم يتم العثور على منتجات',
    tryAnotherSearch: 'جرّب منتجًا أو علامة أو تصنيفًا آخر.',
    recentSearches: 'عمليات البحث الأخيرة',
    clearAll: 'مسح الكل',
    searchHint: 'ابحث باسم المنتج أو العلامة أو التصنيف.',
    tagline: 'الجودة · السعر · الثقة',

    catAll: 'الكل',
    catClothing: 'الملابس',
    catShoes: 'الأحذية',
    catBags: 'الحقائب',
    catWatches: 'الساعات',
    catPhones: 'الهواتف',
    catAudio: 'الصوتيات',
    catComputers: 'الحواسيب',
    catGaming: 'الألعاب',
    catPersonalCare: 'العناية الشخصية',
    catAccessories: 'الإكسسوارات',
    catSports: 'الرياضة',
    catMakeup: 'المكياج',
    catHome: 'المنزل',
    catCamping: 'التخييم',
    catDecor: 'الديكور',
    catArtCrafts: 'الفن والأشغال اليدوية',
    catReading: 'القراءة',
    catOffice: 'المكتب',

    myAccount: 'حسابي',
    manageAccount: 'أدر حسابك وتابع طلباتك.',
    welcome: 'مرحبًا بك في DZShop',
    customerAccount: 'حساب العميل',
    myFavorites: 'مفضلتي',
    savedItems: 'منتج محفوظ',
    myCart: 'سلتي',
    cartItems: 'منتج',
    needHelp: 'تحتاج مساعدة؟',
    contactDZShop: 'تواصل مع DZShop',
    accountSecurity: 'أمان الحساب',
    added: 'تاريخ الإضافة',
    yourActivity: 'نشاطك',
    myOrders: 'طلباتي',
    orders: 'طلب',
    loadingOrders: 'جارٍ تحميل طلباتك...',
    ordersError: 'تعذّر تحميل طلباتك.',
    tryAgain: 'إعادة المحاولة',
    noOrders: 'لا توجد طلبات بعد',
    noOrdersHint: 'ستظهر طلباتك هنا بعد أول عملية شراء.',
    browseProducts: 'تصفح المنتجات',
    order: 'الطلب',
    dateUnavailable: 'التاريخ غير متاح',
    pending: 'قيد الانتظار',
    confirmed: 'تم التأكيد',
    shipped: 'تم الشحن',
    delivered: 'تم التوصيل',
    cancelled: 'ملغى',
    details: 'التفاصيل',
    orderFallback: 'طلب DZShop',
    language: 'اللغة',
    appearance: 'المظهر',
    darkMode: 'الوضع الداكن',
    lightMode: 'الوضع الفاتح',
    english: 'English',
    french: 'Français',
    arabic: 'العربية',
  },
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved && translations[saved] ? saved : 'en'
    } catch {
      return 'en'
    }
  })

  useEffect(() => {
    const isArabic = language === 'ar'

    document.documentElement.lang = language
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr'
  }, [language])

  const setLanguage = (nextLanguage) => {
    if (!translations[nextLanguage]) return

    setLanguageState(nextLanguage)

    try {
      localStorage.setItem(STORAGE_KEY, nextLanguage)
    } catch {
      // The language still works for the current session.
    }
  }

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key) =>
        translations[language][key] ?? translations.en[key] ?? key,
    }),
    [language],
  )

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider')
  }

  return context
}
