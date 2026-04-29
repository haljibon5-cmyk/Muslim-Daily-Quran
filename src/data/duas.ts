export type Language = 'en' | 'bn' | 'ur' | 'hi' | 'id';

export interface LocalizedString {
  en: string;
  bn: string;
  ur: string;
  hi: string;
  id: string;
}

export interface Dua {
  title: LocalizedString;
  arabic: string;
  transliteration: string;
  translation: LocalizedString;
  reference: string;
}

export const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
];

export const duasData: Record<string, Dua[]> = {
  morning: [
    {
      title: {
        en: "Morning Supplication",
        bn: "সকালের দোয়া",
        ur: "صبح کی دعا",
        hi: "सुबह की दुआ",
        id: "Dzikir Pagi"
      },
      arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
      transliteration: "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namut wa ilayk-an-nushur.",
      translation: {
        en: "O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the Final Return.",
        bn: "হে আল্লাহ, তোমারই রহমতে আমরা সকালে উপনীত হই, তোমারই রহমতে আমরা সন্ধ্যায় উপনীত হই, তোমারই রহমতে আমরা বেঁচে থাকি, তোমারই রহমতে আমরা মৃত্যুবরণ করি। এবং তোমারই কাছে আমাদের চূড়ান্ত প্রত্যাবর্তন।",
        ur: "اے اللہ! تیری ہی رحمت سے ہم نے صبح کی اور تیری ہی رحمت سے ہم نے شام کی اور تیرے ہی حکم سے ہم جیتے ہیں اور تیرے ہی حکم سے ہم مرتے ہیں اور تیری ہی طرف لوٹ کر جانا ہے۔",
        hi: "ऐ अल्लाह, तेरी ही रहमत से हमने सुबह की और तेरी ही रहमत से हमने शाम की, तेरे ही हुक्म से हम जीते हैं और तेरे ही हुक्म से हम मरते हैं, और तेरी ही तरफ लौट कर जाना है।",
        id: "Ya Allah, dengan rahmat dan pertolongan-Mu kami memasuki waktu pagi, dan dengan rahmat dan pertolongan-Mu kami memasuki waktu petang. Dengan kehendak-Mu kami hidup dan dengan kehendak-Mu kami mati. Dan kepada-Mu kebangkitan."
      },
      reference: "Abu Dawud 5068"
    }
  ],
  home: [
    {
      title: {
        en: "Leaving the House",
        bn: "ঘর থেকে বের হওয়ার দোয়া",
        ur: "گھر سے نکلنے کی دعا",
        hi: "घर से निकलने की दुआ",
        id: "Doa Keluar Rumah"  
      },
      arabic: "بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
      transliteration: "Bismillahi, tawakkaltu 'alal-lah, wa la hawla wa la quwwata illa billah.",
      translation: {
        en: "In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.",
        bn: "আল্লাহর নামে, আমি আল্লাহর উপর ভরসা করলাম, আর আল্লাহর সাহায্য ছাড়া (পাপ থেকে বাঁচার) কোনো উপায় এবং (সৎকাজ করার) কোনো শক্তি কারো নেই।",
        ur: "اللہ کے نام سے، میں نے اللہ پر توکل کیا، اور اللہ کی مدد کے بغیر نہ کسی برائی سے بچنے کی طاقت ہے اور نہ کسی نیکی کے کرنے کی قوت۔",
        hi: "अल्लाह के नाम से, मैंने अल्लाह पर भरोसा किया, और अल्लाह की मदद के बिना न किसी बुराई से बचने की ताकत है और न किसी नेकी के करने की कुव्वत।",
        id: "Dengan nama Allah, aku bertawakkal kepada Allah, tiada daya dan upaya kecuali dengan pertolongan Allah."
      },
      reference: "Abu Dawud 5095"
    }
  ],
  food: [
    {
      title: {
        en: "Before Eating",
        bn: "খাওয়ার আগের দোয়া",
        ur: "کھانا کھانے سے پہلے کی دعا",
        hi: "खाना खाने से पहले की दुआ",
        id: "Doa Sebelum Makan"
      },
      arabic: "بِسْمِ اللَّهِ",
      transliteration: "Bismillah",
      translation: {
        en: "In the name of Allah.",
        bn: "আল্লাহর নামে (শুরু করছি)।",
        ur: "اللہ کے نام سے شروع۔",
        hi: "अल्लाह के नाम से।",
        id: "Dengan nama Allah."
      },
      reference: "Abu Dawud 3767"
    },
    {
      title: {
        en: "After Eating",
        bn: "খাওয়ার পরের দোয়া",
        ur: "کھانا کھانے کے بعد کی دعا",
        hi: "खाना खाने के बाद की दुआ",
        id: "Doa Setelah Makan"
      },
      arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
      transliteration: "Alhamdulillahil-ladhi at'amana wa saqana wa ja'alana muslimin.",
      translation: {
        en: "Praise be to Allah Who has fed us and given us drink, and made us Muslims.",
        bn: "সর্ববিধ প্রশংসা আল্লাহর জন্য, যিনি আমাদেরকে খাইয়েছেন ও পান করিয়েছেন এবং আমাদেরকে মুসলমান বানিয়েছেন।",
        ur: "تمام تعریفیں اللہ کے لیے ہیں جس نے ہمیں کھلایا اور پلایا اور ہمیں مسلمان بنایا۔",
        hi: "तमाम तारीफें अल्लाह के लिए हैं जिसने हमें खिलाया और पिलाया और हमें मुसलमान बनाया।",
        id: "Segala puji bagi Allah yang telah memberi kami makan dan minum, serta menjadikan kami muslim."
      },
      reference: "Abu Dawud 3850"
    }
  ],
  sleep: [
    {
      title: {
        en: "Before Sleeping",
        bn: "ঘুমানোর দোয়া",
        ur: "سونے سے پہلے کی دعا",
        hi: "सोने से पहले की दुआ",
        id: "Doa Sebelum Tidur"
      },
      arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
      transliteration: "Bismik-Allahumma amutu wa ahya.",
      translation: {
        en: "In Your name, O Allah, I die and I live.",
        bn: "হে আল্লাহ! আপনার নামেই আমি মরে যাই (ঘুমাই) এবং আপনার নামেই জীবিত হই (জাগি)।",
        ur: "اے اللہ! میں تیرے نام کے ساتھ مرتا ہوں (سوتا ہوں) اور جیتا ہوں (جاگتا ہوں)۔",
        hi: "ऐ अल्लाह! मैं तेरे नाम के साथ मरता हूँ (सोता हूँ) और जीता हूँ (जागता हूँ)।",
        id: "Dengan nama-Mu, ya Allah, aku mati dan aku hidup."
      },
      reference: "Sahih Al-Bukhari 6312"
    }
  ],
  rizq: [
    {
      title: {
        en: "For Beneficial Knowledge & Provision",
        bn: "উপকারী জ্ঞান ও উত্তম রিজিকের দোয়া",
        ur: "نافع علم اور پاکیزہ رزق کی دعا",
        hi: "फ़ायदेमंद इल्म और पाकीज़ा रिज़्क़ की दुआ",
        id: "Doa Meminta Ilmu dan Rezeki"
      },
      arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا",
      transliteration: "Allahumma inni as'aluka 'ilman nafi'an, wa rizqan tayyiban, wa 'amalan mutaqabbalan.",
      translation: {
        en: "O Allah, I ask You for beneficial knowledge, goodly provision and acceptable deeds.",
        bn: "হে আল্লাহ! আমি আপনার কাছে উপকারী ইলম (জ্ঞান), উত্তম রিজিক এবং কবুলযোগ্য আমলের প্রার্থনা করছি।",
        ur: "اے اللہ! بے شک میں تجھ سے نفع بخش علم، پاکیزہ رزق اور قبول ہونے والے عمل کا سوال کرتا ہوں۔",
        hi: "ऐ अल्लाह! बेशक़ मैं तुझसे फ़ायदेमंद इल्म, पाकीज़ा रिज़्क़ और क़बूल होने वाले अमल का सवाल करता हूँ।",
        id: "Ya Allah, sungguh aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang baik, dan amal yang diterima."
      },
      reference: "Ibn Majah 925"
    }
  ],
  travel: [
    {
      title: {
        en: "Riding a Vehicle",
        bn: "গাড়িতে বা বাহনে ওঠার দোয়া",
        ur: "سواری کی دعا",
        hi: "सवारी की दुआ",
        id: "Doa Naik Kendaraan"
      },
      arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
      transliteration: "Subhanal-ladhi sakh-khara lana hadha wa ma kunna lahu muqrinin. Wa inna ila Rabbina lamunqalibun.",
      translation: {
        en: "Glory unto Him Who created this transportation, for unto it we were of ourselves unable to control, and unto our Lord we shall return.",
        bn: "পবিত্র সেই সত্তা, যিনি এসব বাহন আমাদের বশীভূত করে দিয়েছেন। আমরা এগুলোকে বশীভূত করতে সক্ষম ছিলাম না। আর আমরা আমাদের রবের দিকেই ফিরে যাব।",
        ur: "پاک ہے وہ ذات جس نے اس (سواری) کو ہمارے تابع کر دیا، حالانکہ ہم اسے قابو میں کرنے والے نہ تھے، اور بے شک ہم اپنے رب کی طرف لوٹ کر جانے والے ہیں۔",
        hi: "पाक है वो ज़ात जिसने इस (सवारी) को हमारे ताबे कर दिया, हालाँकि हम इसे क़ाबू में करने वाले न थे, और बेशक़ हम अपने रब की तरफ लौट कर जाने वाले हैं।",
        id: "Maha Suci Tuhan yang telah menundukkan semua ini bagi kami padahal kami sebelumnya tidak mampu menguasainya, dan sesungguhnya kami akan kembali kepada Tuhan kami."
      },
      reference: "Surah Az-Zukhruf 43:13-14"
    }
  ],
  social: [
    {
      title: {
        en: "When Sneezing",
        bn: "হাঁচি দেওয়ার পর",
        ur: "چھینک آنے پر",
        hi: "छींक आने पर",
        id: "Saat Bersin"
      },
      arabic: "الْحَمْدُ لِلَّهِ",
      transliteration: "Alhamdulillah",
      translation: {
        en: "All praise is due to Allah.",
        bn: "সমস্ত প্রশংসা আল্লাহর জন্য।",
        ur: "تمام تعریفیں اللہ کے لیے ہیں۔",
        hi: "तमाम तारीफें अल्लाह के लिए हैं।",
        id: "Segala puji bagi Allah."
      },
      reference: "Sahih Al-Bukhari 6224"
    }
  ],
  gratitude: [
    {
      title: {
        en: "The Best Way of Seeking Forgiveness (Sayyidul Istighfar)",
        bn: "ক্ষমা প্রার্থনার শ্রেষ্ঠ দোয়া (সায়্যিদুল ইস্তিগফার)",
        ur: "استغفار کی بہترین دعا (سید الاستغفار)",
        hi: "मुआफी मांगने की सबसे बेहतरीन दुआ (सैयदुल इस्तिगफार)",
        id: "Doa Istighfar Terbaik (Sayyidul Istighfar)"
      },
      arabic: "اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
      transliteration: "Allahumma Anta Rabbi la ilaha illa Ant. Khalaqtani wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika mastata'tu. A'udhu bika min sharri ma sana'tu. Abu'u laka bini'matika 'alayya, wa abu'u laka bidhanbi faghfir li, fa-innahu la yaghfirudh-dhunuba illa Ant.",
      translation: {
        en: "O Allah, You are my Lord, none has the right to be worshipped except You, You created me and I am Your servant and I abide to Your covenant and promise as best I can, I take refuge in You from the evil of which I have committed. I acknowledge Your favor upon me and I acknowledge my sin, so forgive me, for verily none can forgive sin except You.",
        bn: "হে আল্লাহ! তুমি আমার প্রতিপালক, তুমি ছাড়া আর কোনো উপাস্য নেই। তুমি আমাকে সৃষ্টি করেছ, আর আমি তোমার বান্দা। আমি আমার সাধ্যমতো তোমার প্রতিশ্রুতি ও অঙ্গীকারের ওপর অবিচল আছি। আমার কৃতকর্মের অনিষ্ট হতে তোমার কাছে আশ্রয় চাই। আমার ওপর তোমার প্রদত্ত নেয়ামতের স্বীকৃতি দিচ্ছি এবং আমার পাপের স্বীকৃতি দিচ্ছি। অতএব আমাকে ক্ষমা করো। নিশ্চয়ই তুমি ছাড়া আর কেউ পাপ ক্ষমা করতে পারে না।",
        ur: "اے اللہ! تو ہی میرا رب ہے، تیرے سوا کوئی معبود نہیں، تو نے مجھے پیدا کیا ہے اور میں تیرا بندہ ہوں اور میں اپنی طاقت کے مطابق تیرے عہد اور وعدے پر قائم ہوں۔ میں اپنے کیے کے شر سے تیری پناہ مانگتا ہوں، میں اپنے اوپر تیری نعمتوں کا اعتراف کرتا ہوں اور اپنے گناہوں کا بھی اعتراف کرتا ہوں، پس مجھے بخش دے، بے شک تیرے سوا کوئی گناہوں کو بخشنے والا نہیں ہے۔",
        hi: "ऐ अल्लाह! तू ही मेरा रब है, तेरे सिवा कोई इबादत के लायक नहीं, तूने मुझे पैदा किया है और मैं तेरा बंदा हूँ... ",
        id: "Ya Allah, Engkau adalah Tuhanku, tidak ada tuhan yang berhak disembah selain Engkau. Engkau telah menciptakanku dan aku adalah hamba-Mu. Aku senantiasa menepati janji dan ketentuan-Mu sesuai dengan kemampuanku..."
      },
      reference: "Sahih Bukhari 6306"
    }
  ],
  illness: [
    {
      title: {
        en: "Visiting the Sick",
        bn: "রোগী দেখার দোয়া",
        ur: "بیمار کی عیادت کی دعا",
        hi: "बीमार की आयधत की दुआ",
        id: "Doa Menjenguk Orang Sakit"
      },
      arabic: "أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ",
      transliteration: "As'alullahal-'Azima Rabbal-'Arshil-'Azimi an yashfiyaka. (7 times)",
      translation: {
        en: "I ask Allah the Mighty, Lord of the Mighty Throne, to cure you.",
        bn: "আমি মহান আল্লাহর কাছে প্রার্থনা করছি, যিনি মহান আরশের মালিক, যেন তিনি আপনাকে আরোগ্য দান করেন। (৭ বার)",
        ur: "میں عظمت والے اللہ جو عظیم عرش کا رب ہے، سے سوال کرتا ہوں کہ وہ تجھے شفا دے۔ (7 مرتبہ)",
        hi: "मैं अज़मत वाले अल्लाह जो अज़ीम अर्श का रब है, से सवाल करता हूँ कि वो तुझे शिफा दे। (7 मर्तबा)",
        id: "Aku memohon kepada Allah Yang Maha Agung, Tuhan Arasy yang agung, agar Dia menyembuhkanmu. (7 kali)"
      },
      reference: "Abu Dawud 3106"
    }
  ],
  salah: [
    {
      title: {
        en: "After Adhan",
        bn: "আজানের দোয়া",
        ur: "اذان کے بعد کی دعا",
        hi: "अज़ान के बाद की दुआ",
        id: "Doa Setelah Adzan"
      },
      arabic: "اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ",
      transliteration: "Allahumma Rabba hadhihid-da'watit-tammah, was-salatil-qa'imah, ati Muhammadan al-wasilata wal-fadhilah, wab'ath-hu maqaman mahmudan alladhi wa'adtah.",
      translation: {
        en: "O Allah, Lord of this perfect call and established prayer. Grant Muhammad the intercession and favor, and raise him to the honored station You have promised him.",
        bn: "হে আল্লাহ! এ পরিপূর্ণ আহ্বান এবং প্রতিষ্ঠিত নামাজের তুমিই প্রভু! মুহাম্মদ (সা.)-কে অসিলা ও শ্রেষ্ঠত্ব দান করো এবং তাঁকে সেই প্রশংসিত স্থানে পৌঁছে দাও যার প্রতিশ্রুতি তুমি তাঁকে দিয়েছ।",
        ur: "اے اللہ! اس مکمل پکار اور کھڑی ہونے والی نماز کے رب! محمد صلی اللہ علیہ وسلم کو وسیلہ اور فضیلت عطا فرما اور انہیں اس مقام محمود پر فائز فرما جس کا تو نے ان سے وعدہ کیا ہے۔",
        hi: "ऐ अल्लाह! इस मुकम्मल पुकार और खड़ी होने वाली नमाज़ के रब! मुहम्मद (सल्लल्लाहु अलैहि वसल्लम) को वसीला और फ़ज़ीलत अता फ़रमा...",
        id: "Ya Allah, Tuhan pemilik panggilan yang sempurna ini dan shalat yang didirikan. Berilah Nabi Muhammad wasilah (tempat yang tinggi di surga) dan keutamaan..."
      },
      reference: "Sahih Bukhari 614"
    }
  ],
  quranic: [
    {
      title: {
        en: "For Good in This World and the Hereafter",
        bn: "দুনিয়া ও আখেরাতের কল্যাণের দোয়া",
        ur: "دنیا اور آخرت کی بھلائی کی دعا",
        hi: "दुनिया और आख़िरत की भलाई की दुआ",
        id: "Doa Kebaikan Dunia dan Akhirat"
      },
      arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar.",
      translation: {
        en: "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.",
        bn: "হে আমাদের প্রতিপালক! আমাদের দুনিয়াতে কল্যাণ দান করো এবং আখেরাতেও কল্যাণ দান করো, আর আমাদেরকে আগুনের আযাব থেকে রক্ষা করো।",
        ur: "اے ہمارے رب! ہمیں دنیا میں بھی بھلائی دے اور آخرت میں بھی بھلائی دے اور ہمیں آگ کے عذاب سے بچا لے۔",
        hi: "ऐ हमारे रब! हमें दुनिया में भी भलाई दे और आख़िरत में भी भलाई दे और हमें आग के अज़ाब से बचा ले।",
        id: "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat dan peliharalah kami dari siksa neraka."
      },
      reference: "Surah Al-Baqarah 2:201"
    }
  ],
  purification: [
    {
      title: {
        en: "After Wudu",
        bn: "ওজুর পরের দোয়া",
        ur: "وضو کے بعد کی دعا",
        hi: "वज़ू के बाद की दुआ",
        id: "Doa Setelah Wudhu"
      },
      arabic: "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
      transliteration: "Ash-hadu an la ilaha illallah wahdahu la sharika lah, wa ash-hadu anna Muhammadan 'abduhu wa rasuluh.",
      translation: {
        en: "I bear witness that none has the right to be worshipped but Allah alone, Who has no partner; and I bear witness that Muhammad is His slave and His Messenger.",
        bn: "আমি সাক্ষ্য দিচ্ছি যে, আল্লাহ ছাড়া কোনো মাবুদ নেই। তিনি এক, তাঁর কোনো শরিক নেই। আমি আরও সাক্ষ্য দিচ্ছি যে, মুহাম্মদ (সা.) তাঁর বান্দা ও রাসুল।",
        ur: "میں گواہی دیتا ہوں کہ اللہ کے سوا کوئی سچا معبود نہیں، وہ اکیلا ہے اس کا کوئی شریک نہیں، اور میں گواہی دیتا ہوں کہ محمد (صلی اللہ علیہ وسلم) اس کے بندے اور رسول ہیں۔",
        hi: "मैं गवाही देता हूँ कि अल्लाह के सिवा कोई इबादत के लायक़ नहीं...",
        id: "Aku bersaksi bahwasanya tiada sesembahan yang benar kecuali Allah semata, tidak ada sekutu bagi-Nya, dan aku bersaksi bahwasanya Nabi Muhammad adalah hamba dan utusan-Nya."
      },
      reference: "Sahih Muslim 234a"
    }
  ],
  refuge: [
    {
      title: {
        en: "From Anxiety and Sorrow",
        bn: "দুশ্চিন্তা ও ঋণ মুক্তির দোয়া",
        ur: "غم اور پریشانی سے بچنے کی دعا",
        hi: "ग़म और परेशानी से बचने की दुआ",
        id: "Doa Berlindung dari Kesedihan"
      },
      arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
      transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazani, wal-'ajzi wal-kasali, wal-bukhli wal-jubni, wa dhala'id-dayni wa ghalabatir-rijal.",
      translation: {
        en: "O Allah, I take refuge in You from anxiety and sorrow, weakness and laziness, miserliness and cowardice, the burden of debts and from being overpowered by men.",
        bn: "হে আল্লাহ! আমি আপনার কাছে আশ্রয় চাই দুশ্চিন্তা ও পেরেশানি থেকে, অক্ষমতা ও অলসতা থেকে, কৃপণতা ও ভীরুতা থেকে, ঋণের বোঝা ও মানুষের আধিপত্য থেকে।",
        ur: "اے اللہ! بے شک میں تیری پناہ مانگتا ہوں فکر اور غم سے، عاجزی اور سستی سے، بخل اور بزدلی سے، قرض کے بوجھ اور لوگوں کے غلبے سے۔",
        hi: "ऐ अल्लाह! बेशक़ मैं तेरी पनाह माँगता हूँ फ़िक्र और ग़म से...",
        id: "Ya Allah, aku berlindung kepada-Mu dari kebingungan dan kesedihan, kelemahan dan kemalasan, sifat pengecut dan kikir, lilitan utang dan penindasan orang-orang."
      },
      reference: "Sahih Bukhari 2893"
    }
  ],
  ramadan: [
    {
      title: {
        en: "Breaking Fast",
        bn: "ইফতারের দোয়া",
        ur: "افطار کی دعا",
        hi: "इफ्तार की दुआ",
        id: "Doa Berbuka Puasa"
      },
      arabic: "ذَهَبَ الظَّمَأُ، وَابْتَلَّتِ الْعُرُوقُ، وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ",
      transliteration: "Dhahabaz-zama'u wabtallatil-'uruqu, wa thabatal-ajru in sha'Allah.",
      translation: {
        en: "The thirst is gone, the veins are moistened and the reward is confirmed, if Allah wills.",
        bn: "পিপাসা নিবৃত্ত হলো, শিরা-উপশিরা সিক্ত হলো এবং আল্লাহর ইচ্ছায় পুরস্কার নির্ধারিত হলো।",
        ur: "پیاس بجھ گئی، رگیں تر ہو گئیں اور اللہ نے چاہا تو اجر ثابت ہو گیا۔",
        hi: "प्यास बुझ गई, रगें तर हो गईं और अल्लाह ने चाहा तो अजर साबित हो गया।",
        id: "Telah hilang rasa haus, telah basah urat-urat, dan telah pasti ganjaran, dengan kehendak Allah."
      },
      reference: "Abu Dawud 2357"
    }
  ],
  hajj: [
    {
      title: {
        en: "Talbiyah",
        bn: "তালবিয়া",
        ur: "تلبیہ",
        hi: "तल्बियह",
        id: "Talbiyah"
      },
      arabic: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لاَ شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لاَ شَرِيكَ لَكَ",
      transliteration: "Labbaykallahumma Labbayk, labbayka la sharika laka labbayk, innal-hamda wan-ni'mata laka wal-mulk, la sharika lak.",
      translation: {
        en: "Here I am, O Allah, here I am. Here I am, You have no partner, here I am. Verily all praise and grace is Yours, and the sovereignty too. You have no partner.",
        bn: "আমি হাজির, হে আল্লাহ, আমি হাজির। আমি হাজির, তোমার কোনো শরিক নেই, আমি হাজির। নিশ্চয়ই সমস্ত প্রশংসা, নেয়ামত এবং রাজত্ব তোমারই। তোমার কোনো শরিক নেই।",
        ur: "میں حاضر ہوں اے اللہ میں حاضر ہوں، تیرا کوئی شریک نہیں میں حاضر ہوں، بے شک تمام تعریفیں اور نعمتیں اور بادشاہی تیری ہی ہے، تیرا کوئی شریک نہیں۔",
        hi: "मैं हाज़िर हूँ ऐ अल्लाह मैं हाज़िर हूँ...",
        id: "Aku memenuhi panggilan-Mu ya Allah, aku memenuhi panggilan-Mu. Aku memenuhi panggilan-Mu, tiada sekutu bagi-Mu, aku memenuhi panggilan-Mu..."
      },
      reference: "Sahih Bukhari 1549"
    }
  ]
};
