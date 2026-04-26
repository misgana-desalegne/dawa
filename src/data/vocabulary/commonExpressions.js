const MIN_ENTRIES_PER_LEVEL = 80;

const baseExpressionsByLevel = {
  A1: [
    { id: "a1_hello", en: "Hello", fr: "Bonjour", am: "ሰላም", ti: "ሰላም", fa: "سلام" },
    { id: "a1_good_morning", en: "Good morning", fr: "Bonjour", am: "እንደምን አደሩ", ti: "ከመይ ሓዲርካ", fa: "صبح بخیر" },
    { id: "a1_good_evening", en: "Good evening", fr: "Bonsoir", am: "መልካም ምሽት", ti: "ሰናይ ምሸት", fa: "عصر بخیر" },
    { id: "a1_goodbye", en: "Goodbye", fr: "Au revoir", am: "ደህና ሁን", ti: "ደሓን ኩን", fa: "خداحافظ" },
    { id: "a1_please", en: "Please", fr: "S'il vous plait", am: "እባክህ", ti: "በጃኻ", fa: "لطفا" },
    { id: "a1_thank_you", en: "Thank you", fr: "Merci", am: "እናመሰግናለን", ti: "የቐንየለይ", fa: "تشکر" },
    { id: "a1_excuse_me", en: "Excuse me", fr: "Excusez-moi", am: "ይቅርታ", ti: "ይቕረታ", fa: "ببخشید" },
    { id: "a1_yes", en: "Yes", fr: "Oui", am: "አዎ", ti: "እወ", fa: "بله" },
    { id: "a1_no", en: "No", fr: "Non", am: "አይ", ti: "ኣይፋል", fa: "نه" },
    { id: "a1_water", en: "Water", fr: "Eau", am: "ውሃ", ti: "ማይ", fa: "آب" },
    { id: "a1_bread", en: "Bread", fr: "Pain", am: "ዳቦ", ti: "ባኒ", fa: "نان" },
    { id: "a1_house", en: "House", fr: "Maison", am: "ቤት", ti: "ገዛ", fa: "خانه" },
    { id: "a1_book", en: "Book", fr: "Livre", am: "መጽሐፍ", ti: "መጽሓፍ", fa: "کتاب" },
    { id: "a1_my_name", en: "My name is...", fr: "Je m'appelle...", am: "ስሜ ... ነው", ti: "ስመይ ... እዩ", fa: "نام من ... است" },
    { id: "a1_i_am", en: "I am...", fr: "Je suis...", am: "እኔ ... ነኝ", ti: "ኣነ ... እየ", fa: "من ... هستم" },
    { id: "a1_where_is", en: "Where is...?", fr: "Ou est...?", am: "... የት ነው?", ti: "... ኣበይ ኣሎ?", fa: "... کجاست؟" },
    { id: "a1_im_thirsty", en: "I'm thirsty", fr: "J'ai soif", am: "ራብ አለብኝ", ti: "ጠሚ ኣለኒ", fa: "تشنه هستم" },
    { id: "a1_im_hungry", en: "I'm hungry", fr: "J'ai faim", am: "ራብ አለብኝ", ti: "ጠሚ ኣለኒ", fa: "گرسنه هستم" },
    { id: "a1_can_i_help", en: "Can I help you?", fr: "Puis-je vous aider?", am: "ለመርዳት እችላለሁ?", ti: "ክሕግዝካ እኽእል?", fa: "می توانم کمکتان کنم؟" },
    { id: "a1_how_are_you", en: "How are you?", fr: "Comment allez-vous?", am: "እንዴት ነህ?", ti: "ከመይ ኣለካ?", fa: "حالتان چطور است؟" },
    { id: "a1_very_well", en: "Very well, thank you", fr: "Tres bien, merci", am: "በጣም ጥሩ ነው፣ እናመሰግናለን", ti: "ብዙሕ ጥሩ እዩ፣ የቐንየለይ", fa: "خیلی خوب، ممنون" },
    { id: "a1_what_is_your_name", en: "What is your name?", fr: "Comment vous appelez-vous?", am: "ስምህ ምን ነው?", ti: "ስመካ መን እዩ?", fa: "نام شما چیست؟" },
    { id: "a1_nice_to_meet_you", en: "Nice to meet you", fr: "Ravi de vous rencontrer", am: "መስተያየት ያስደስተኛል", ti: "መራኸቢ ጥሩ እዩ", fa: "خوشحالم که ملاقاتتان کردم" },
    { id: "a1_where_do_you_live", en: "Where do you live?", fr: "Ou habitez-vous?", am: "የት ትኖራለህ?", ti: "ኣበይ ትነብር?", fa: "کجا زندگی می کنید؟" },
    { id: "a1_i_live_here", en: "I live here", fr: "J'habite ici", am: "እዚህ እኖራለሁ", ti: "ኣብዚ እነብር", fa: "اینجا زندگی می کنم" },
    { id: "a1_do_you_speak_english", en: "Do you speak English?", fr: "Parlez-vous anglais?", am: "እንግሊዝኛ ትናገራለህ?", ti: "እንግሊዝኛ ትዛረብ?", fa: "انگلیسی صحبت می کنید؟" },
    { id: "a1_i_speak_a_little", en: "I speak a little", fr: "Je parle un peu", am: "ትንሽ እናገራለሁ", ti: "እንግሊዝኛ ትንሽ እዛረብ", fa: "کم صحبت می کنم" },
    { id: "a1_can_you_repeat", en: "Can you repeat that?", fr: "Pouvez-vous repeter?", am: "እባክዎ ይድገሙ", ti: "በጃኹም ደጊምኩም", fa: "می توانید تکرار کنید؟" },
    { id: "a1_slower_please", en: "Slower, please", fr: "Plus lentement, s'il vous plait", am: "እባክዎ በዝቶ", ti: "በጃኹም ብዝሒ", fa: "آهسته تر لطفا" },
    { id: "a1_i_dont_understand", en: "I don't understand", fr: "Je ne comprends pas", am: "አልገባኝም", ti: "ኣይተረድኣንን", fa: "متوجه نمی شوم" },
    { id: "a1_what_does_it_mean", en: "What does it mean?", fr: "Qu'est-ce que ca veut dire?", am: "ምን ማለት ነው?", ti: "መን እዩ ማለት?", fa: "چه معنایی دارد؟" },
    { id: "a1_how_much_is_this", en: "How much is this?", fr: "C'est combien?", am: "ይህ ስንት ነው?", ti: "እዚ ክንደይ እዩ?", fa: "این چند است؟" },
    { id: "a1_too_expensive", en: "Too expensive", fr: "Trop cher", am: "በጣም ያልተለመደ", ti: "ብዙሕ ያልተለመደ", fa: "خیلی گران" },
    { id: "a1_can_i_have", en: "Can I have...?", fr: "Puis-je avoir...?", am: "እችላለሁ ... ለማግኘት?", ti: "ክረኽብ እኽእል...?", fa: "می توانم داشته باشم...؟" },
    { id: "a1_where_is_the_bathroom", en: "Where is the bathroom?", fr: "Ou sont les toilettes?", am: "የመፀዳጃ ቦታ የት ነው?", ti: "ኣበይ ኣሎ መፀዳጃ ቦታ?", fa: "دستشویی کجاست؟" },
    { id: "a1_i_need_help", en: "I need help", fr: "J'ai besoin d'aide", am: "እገዛ እፈልጋለሁ", ti: "ሓገዝ የድልየኒ", fa: "کمک نیاز دارم" },
    { id: "a1_im_lost", en: "I'm lost", fr: "Je suis perdu", am: "ተሳሳተሁ", ti: "ተሳሳጥኩ", fa: "گم شده ام" },
    { id: "a1_which_way", en: "Which way to...?", fr: "Quelle direction pour...?", am: "... ወደ የት ነው መሄድ?", ti: "... ናብ ኣበይ እኸይድ?", fa: "راه ... کدام طرف است؟" },
    { id: "a1_bus_stop", en: "Where is the bus stop?", fr: "Ou est l'arret de bus?", am: "የአውቶቡስ ማቆሚያ የት ነው?", ti: "ኣበይ ኣሎ መዓቀፊ ኣውቶቡስ?", fa: "ایستگاه اتوبوس کجاست؟" },
    { id: "a1_train_station", en: "Where is the train station?", fr: "Ou est la gare?", am: "የባቡር ጣቢያ የት ነው?", ti: "ኣበይ ኣሎ ጣብያ ባቡር?", fa: "ایستگاه قطار کجاست؟" },
    { id: "a1_how_do_i_get_to", en: "How do I get to...?", fr: "Comment aller a...?", am: "... እንዴት እችላለሁ መሄድ?", ti: "... ከመይ እኸይድ?", fa: "چطور بروم به...؟" },
    { id: "a1_left_right", en: "Left or right?", fr: "A gauche ou a droite?", am: "ግራ ወይም ቀኝ?", ti: "ጸጋማ ወይ የማን?", fa: "چپ یا راست؟" },
    { id: "a1_straight_ahead", en: "Straight ahead", fr: "Tout droit", am: "ቀጥታ ወደ ፊት", ti: "ቀጥታ ናብ ቅድሚ", fa: "مستقیم جلو" },
    { id: "a1_turn_left", en: "Turn left", fr: "Tournez a gauche", am: "ወደ ግራ ተያያዝ", ti: "ተያየጡ ናብ ጸጋማ", fa: "به چپ بپیچید" },
    { id: "a1_turn_right", en: "Turn right", fr: "Tournez a droite", am: "ወደ ቀኝ ተያያዝ", ti: "ተያየጡ ናብ የማን", fa: "به راست بپیچید" },
    { id: "a1_near_far", en: "Is it near or far?", fr: "C'est pres ou loin?", am: "አጭር ወይም ራቅ ነው?", ti: "ቅሩብ ወይ ራሓቅ እዩ?", fa: "نزدیک است یا دور؟" },
    { id: "a1_walking_distance", en: "Is it walking distance?", fr: "Est-ce a distance de marche?", am: "በእግር መሄድ የሚሆን ርቀት ነው?", ti: "ብእግር ክምለስ የብሎም ራሓቅ እዩ?", fa: "فاصله پیاده روی است؟" },
    { id: "a1_taxi_please", en: "Taxi, please", fr: "Taxi, s'il vous plait", am: "ታክሲ እባክዎ", ti: "ታክሲ በጃኹም", fa: "تاکسی لطفا" },
    { id: "a1_how_much_to", en: "How much to...?", fr: "Combien pour aller a...?", am: "... እንዴት ነው ዋጋው?", ti: "... ክንደይ እዩ ዋጋ?", fa: "تا ... چقدر است؟" },
    { id: "a1_one_ticket", en: "One ticket, please", fr: "Un billet, s'il vous plait", am: "አንድ ትኬት እባክዎ", ti: "ኣሐዱ ትኬት በጃኹም", fa: "یک بلیط لطفا" },
    { id: "a1_when_does_it_leave", en: "When does it leave?", fr: "Quand part-il?", am: "ምን ጊዜ ያልቀሳል?", ti: "መን ሰዓት ይኸይድ?", fa: "کی حرکت می کند؟" },
    { id: "a1_next_bus", en: "When is the next bus?", fr: "Quand est le prochain bus?", am: "ቀጣዩ አውቶቡስ ምን ጊዜ ነው?", ti: "መን ሰዓት እዩ ዝመጽእ ኣውቶቡስ?", fa: "اتوبوس بعدی کی است؟" },
    { id: "a1_this_way", en: "Is this the way to...?", fr: "Est-ce le chemin pour...?", am: "... ወደ የሚሄድ መንገድ ነው ይህ?", ti: "... ናብ እኸይድ እዩ እንገዲ እዚ?", fa: "این راه ... است؟" },
    { id: "a1_im_sorry", en: "I'm sorry", fr: "Je suis desole", am: "እኔ እናወቅሃለሁ", ti: "እናወቅሃለሁ", fa: "متاسفم" },
    { id: "a1_no_problem", en: "No problem", fr: "Pas de probleme", am: "ምንም ችግር የለም", ti: "ምንም ጸገም የለን", fa: "مشکل نیست" },
    { id: "a1_see_you_later", en: "See you later", fr: "A plus tard", am: "ቆይተህ እንያይ", ti: "ንሕና ንራኸብ እንተራኸብ", fa: "بعدا می بینمت" },
    { id: "a1_have_a_good_day", en: "Have a good day", fr: "Passez une bonne journee", am: "መልክ ቀን ያለህ", ti: "መልክ መዓልቲ ኩን", fa: "روز خوبی داشته باشید" },
    { id: "a1_good_luck", en: "Good luck", fr: "Bonne chance", am: "መልክ እጣ ያለህ", ti: "መልክ እጣ ኩን", fa: "موفق باشید" },
    { id: "a1_congratulations", en: "Congratulations", fr: "Felicitations", am: "እንኳን ያደረሰህ", ti: "እንኳን ያደረሰካ", fa: "تبریک می گویم" },
    { id: "a1_happy_birthday", en: "Happy birthday", fr: "Joyeux anniversaire", am: "መልክ ልደት ቀን ያለህ", ti: "መልክ መዓልቲ ልደት ኩን", fa: "تولدت مبارک" },
    { id: "a1_merry_christmas", en: "Merry Christmas", fr: "Joyeux Noel", am: "መልክ ለደት እንኳን ያደረሰህ", ti: "መልክ ለደት እንኳን ያደረሰካ", fa: "کریسمس مبارک" },
    { id: "a1_happy_new_year", en: "Happy New Year", fr: "Bonne annee", am: "አዲስ አመት ያለህ መልክ", ti: "አዲስ ዓመት መልክ ኩን", fa: "سال نو مبارک" },
    { id: "a1_what_time_is_it", en: "What time is it?", fr: "Quelle heure est-il?", am: "ስንት ሰዓት ነው?", ti: "ሰዓት ክንደይ እዩ?", fa: "ساعت چند است؟" },
    { id: "a1_its_time_to_go", en: "It's time to go", fr: "Il est temps de partir", am: "መሄድ ጊዜ አለ", ti: "ሰዓት ናብ ክምለስ እዩ", fa: "وقت رفتن است" },
    { id: "a1_wait_a_minute", en: "Wait a minute", fr: "Attendez une minute", am: "አንድ የካቲት ጊዜ ተጠባበጥ", ti: "ኣሐዱ የካቲት ሰዓት ተጠባበጡ", fa: "یک دقیقه صبر کنید" },
    { id: "a1_come_with_me", en: "Come with me", fr: "Venez avec moi", am: "ከእኔ ጋር ና", ti: "ምስኡይ ንዑ", fa: "با من بیایید" },
    { id: "a1_stay_here", en: "Stay here", fr: "Restez ici", am: "እዚህ ተቀምጥ", ti: "ኣብዚ ኩኑ", fa: "اینجا بمانید" },
    { id: "a1_be_careful", en: "Be careful", fr: "Faites attention", am: "ተያያዝ", ti: "ተጠንቀቁ", fa: "مراقب باشید" },
    { id: "a1_watch_out", en: "Watch out!", fr: "Attention!", am: "ተያያዝ!", ti: "ተጠንቀቁ!", fa: "مواظب باشید!" },
    { id: "a1_help_me", en: "Help me!", fr: "Aidez-moi!", am: "ለምርዳኝ!", ti: "ሕግዝኒ!", fa: "کمکم کنید!" },
    { id: "a1_stop", en: "Stop!", fr: "Arretez!", am: "ቁም!", ti: "ቅዑ!", fa: "متوقف شوید!" },
    { id: "a1_go", en: "Go!", fr: "Allez!", am: "ሂድ!", ti: "ኺድ!", fa: "بروید!" },
    { id: "a1_look", en: "Look!", fr: "Regardez!", am: "ተመልከት!", ti: "ርኢ!", fa: "نگاه کنید!" },
    { id: "a1_listen", en: "Listen!", fr: "Ecoutez!", am: "ስማ!", ti: "ስምዑ!", fa: "گوش کنید!" },
    { id: "a1_speak", en: "Speak!", fr: "Parlez!", am: "ናገር!", ti: "ዛረብ!", fa: "صحبت کنید!" },
    { id: "a1_read", en: "Read!", fr: "Lisez!", am: "አንብ!", ti: "ኣንብ!", fa: "بخوانید!" },
    { id: "a1_write", en: "Write!", fr: "Ecrivez!", am: "ጻፍ!", ti: "ጽሕፍ!", fa: "بنویسید!" },
    { id: "a1_understand", en: "Do you understand?", fr: "Comprenez-vous?", am: "ተረዳህ?", ti: "ተረዳኣካ?", fa: "متوجه شدید؟" },
    { id: "a1_i_understand", en: "I understand", fr: "Je comprends", am: "ተረዳሁ", ti: "ተረዳእኩ", fa: "متوجه شدم" },
    { id: "a1_i_like_it", en: "I like it", fr: "J'aime ca", am: "እወዳለሁ", ti: "እፈቱ", fa: "دوست دارم" },
    { id: "a1_i_dont_like_it", en: "I don't like it", fr: "Je n'aime pas ca", am: "አልወዳለሁም", ti: "ኣይፈቱን", fa: "دوست ندارم" },
    { id: "a1_its_good", en: "It's good", fr: "C'est bon", am: "ጥሩ ነው", ti: "ጥሩ እዩ", fa: "خوب است" },
    { id: "a1_its_bad", en: "It's bad", fr: "C'est mauvais", am: "መጥፎ ነው", ti: "ሕማቅ እዩ", fa: "بد است" },
    { id: "a1_its_big", en: "It's big", fr: "C'est grand", am: "ትልቅ ነው", ti: "ዓቢ እዩ", fa: "بزرگ است" },
    { id: "a1_its_small", en: "It's small", fr: "C'est petit", am: "ትንሽ ነው", ti: "ንእሽተይ እዩ", fa: "کوچک است" },
    { id: "a1_its_hot", en: "It's hot", fr: "C'est chaud", am: "ያልተለመደ ነው", ti: "ሙቅ እዩ", fa: "داغ است" },
    { id: "a1_its_cold", en: "It's cold", fr: "C'est froid", am: "ቀዝቃዛ ነው", ti: "ቀዝቃዛ እዩ", fa: "سرد است" },
    { id: "a1_its_easy", en: "It's easy", fr: "C'est facile", am: "ለምክ ነው", ti: "ቀሊል እዩ", fa: "آسان است" },
    { id: "a1_its_difficult", en: "It's difficult", fr: "C'est difficile", am: "አስቸኳይ ነው", ti: "ኣስቸኳይ እዩ", fa: "سخت است" },
    { id: "a1_its_near", en: "It's near", fr: "C'est pres", am: "አጭር ነው", ti: "ቅሩብ እዩ", fa: "نزدیک است" },
    { id: "a1_its_far", en: "It's far", fr: "C'est loin", am: "ራቅ ነው", ti: "ራሓቅ እዩ", fa: "دور است" },
    { id: "a1_its_here", en: "It's here", fr: "C'est ici", am: "እዚህ ነው", ti: "ኣብዚ እዩ", fa: "اینجاست" },
    { id: "a1_its_there", en: "It's there", fr: "C'est la", am: "እዚያ ነው", ti: "ኣብቲ እዩ", fa: "آنجاست" },
    { id: "a1_what_is_this", en: "What is this?", fr: "Qu'est-ce que c'est?", am: "ይህ ምን ነው?", ti: "እዚ መን እዩ?", fa: "این چیست؟" },
    { id: "a1_who_is_this", en: "Who is this?", fr: "Qui est-ce?", am: "ይህ ማነው?", ti: "እዚ መኑ እዩ?", fa: "این کیست؟" },
    { id: "a1_where_are_you_from", en: "Where are you from?", fr: "D'ou venez-vous?", am: "ከየት ነህ የምትመጣ?", ti: "ካበይ ትመጽእ?", fa: "از کجا هستید؟" },
    { id: "a1_im_from", en: "I'm from...", fr: "Je viens de...", am: "እኔ ከ... ነኝ", ti: "ኣነ ካብ... እየ", fa: "من از ... هستم" },
    { id: "a1_do_you_have", en: "Do you have...?", fr: "Avez-vous...?", am: "... አለህ?", ti: "... ኣለካ?", fa: "... دارید؟" },
    { id: "a1_i_have", en: "I have...", fr: "J'ai...", am: "እኔ ... አለኝ", ti: "ኣነ ... ኣለኒ", fa: "من ... دارم" },
    { id: "a1_i_dont_have", en: "I don't have...", fr: "Je n'ai pas...", am: "እኔ ... አልነበረኝም", ti: "ኣነ ... ኣይብሎን ኣለኒ", fa: "من ... ندارم" },
    { id: "a1_give_me", en: "Give me...", fr: "Donnez-moi...", am: "... ለምስጠኝ", ti: "... ለምስጠኒ", fa: "... بدهید" },
    { id: "a1_show_me", en: "Show me...", fr: "Montrez-moi...", am: "... አሳየኝ", ti: "... ኣርኢኒ", fa: "... نشان دهید" },
    { id: "a1_take_me", en: "Take me to...", fr: "Emmenez-moi a...", am: "... ወደ ያለኝ ውሰዱኝ", ti: "... ናብ ኣብልኒ", fa: "... ببریدم به" },
    { id: "a1_bring_me", en: "Bring me...", fr: "Apportez-moi...", am: "... አምጣልኝ", ti: "... ኣምጣልኒ", fa: "... بیاورید" },
    { id: "a1_wait_for_me", en: "Wait for me", fr: "Attendez-moi", am: "ለእኔ ተጠባበጥ", ti: "ለእኔ ተጠባበጡ", fa: "منتظرم باشید" },
    { id: "a1_follow_me", en: "Follow me", fr: "Suivez-moi", am: "ከእኔ ተከተል", ti: "ምስኡይ ንዑ", fa: "دنبالم بیایید" },
    { id: "a1_lets_eat", en: "Let's eat", fr: "Mangeons", am: "እንብላ", ti: "ንብላ", fa: "بیایید بخوریم" },
    { id: "a1_lets_drink", en: "Let's drink", fr: "Buvons", am: "እንጠጣ", ti: "ንሰቲ", fa: "بیایید بنوشیم" },
    { id: "a1_lets_go_home", en: "Let's go home", fr: "Rentrons a la maison", am: "እንሂድ ቤት", ti: "ንኺድ ናብ ገዛ", fa: "بیایید برویم خانه" },
    { id: "a1_lets_sleep", en: "Let's sleep", fr: "Dormons", am: "እንተኛ", ti: "ንተኛ", fa: "بیایید بخوابیم" },
    { id: "a1_lets_work", en: "Let's work", fr: "Travaillons", am: "እንስራ", ti: "ንስራሕ", fa: "بیایید کار کنیم" },
    { id: "a1_lets_play", en: "Let's play", fr: "Jouons", am: "እንጫወት", ti: "ንጻወት", fa: "بیایید بازی کنیم" },
    { id: "a1_lets_learn", en: "Let's learn", fr: "Apprenons", am: "እንማር", ti: "ንመሃር", fa: "بیایید یاد بگیریم" },
    { id: "a1_lets_talk", en: "Let's talk", fr: "Parlons", am: "እንወያይ", ti: "ንዛረብ", fa: "بیایید صحبت کنیم" },
    { id: "a1_lets_walk", en: "Let's walk", fr: "Marchons", am: "እንሂድ በእግር", ti: "ንምለስ ብእግር", fa: "بیایید پیاده روی کنیم" },
    { id: "a1_lets_run", en: "Let's run", fr: "Courons", am: "እንሮጥ", ti: "ንሮጥ", fa: "بیایید بدویم" },
    { id: "a1_lets_sit", en: "Let's sit", fr: "Asseyons-nous", am: "እንቀመጥ", ti: "ንተቀመጥ", fa: "بیایید بنشینیم" },
    { id: "a1_lets_stand", en: "Let's stand", fr: "Leveons-nous", am: "እንቁም", ti: "ንተቐምጥ", fa: "بیایید بایستیم" },
    { id: "a1_lets_stop", en: "Let's stop", fr: "Arretons-nous", am: "እንቁም", ti: "ንቅዑ", fa: "بیایید متوقف شویم" },
    { id: "a1_lets_start", en: "Let's start", fr: "Commencons", am: "እንጀምር", ti: "ንጀምር", fa: "بیایید شروع کنیم" },
    { id: "a1_lets_finish", en: "Let's finish", fr: "Finissons", am: "እንጨርስ", ti: "ንያየል", fa: "بیایید تمام کنیم" },
    { id: "a1_lets_wait", en: "Let's wait", fr: "Attendons", am: "እንተጠባበጥ", ti: "ንተጠባበጥ", fa: "بیایید صبر کنیم" },
    { id: "a1_lets_rest", en: "Let's rest", fr: "Reposons-nous", am: "እንለምድ", ti: "ንለምድ", fa: "بیایید استراحت کنیم" },
    { id: "a1_lets_continue", en: "Let's continue", fr: "Continuons", am: "እንቀጥል", ti: "ንቀጣእ", fa: "بیایید ادامه دهیم" },
    { id: "a1_lets_try", en: "Let's try", fr: "Essayons", am: "እንሞክር", ti: "ንፈትን", fa: "بیایید امتحان کنیم" },
    { id: "a1_lets_help", en: "Let's help", fr: "Aidons", am: "እንርዳ", ti: "ንሕግዝ", fa: "بیایید کمک کنیم" },
    { id: "a1_lets_share", en: "Let's share", fr: "Partageons", am: "እንካፈል", ti: "ንካፈል", fa: "بیایید تقسیم کنیم" },
    { id: "a1_lets_listen", en: "Let's listen", fr: "Ecoutons", am: "እንስማ", ti: "ንስምዕ", fa: "بیایید گوش کنیم" },
    { id: "a1_lets_look", en: "Let's look", fr: "Regardons", am: "እንመልክ", ti: "ንርኢ", fa: "بیایید نگاه کنیم" },
    { id: "a1_lets_read", en: "Let's read", fr: "Lisons", am: "እንንብ", ti: "ንኣንብ", fa: "بیایید بخوانیم" },
    { id: "a1_lets_write", en: "Let's write", fr: "Ecrivons", am: "እንጻፍ", ti: "ንጽሕፍ", fa: "بیایید بنویسیم" },
    { id: "a1_lets_sing", en: "Let's sing", fr: "Chantons", am: "እንዘምር", ti: "ንዘምር", fa: "بیایید بخوانیم" },
    { id: "a1_lets_dance", en: "Let's dance", fr: "Dansons", am: "እንዳንስ", ti: "ንዳንስ", fa: "بیایید برقصیم" },
    { id: "a1_lets_laugh", en: "Let's laugh", fr: "Rions", am: "እንሳቅ", ti: "ንሳቅ", fa: "بیایید بخندیم" },
    { id: "a1_lets_cry", en: "Let's cry", fr: "Pleurons", am: "እንለምድ", ti: "ንበክይ", fa: "بیایید گریه کنیم" },
    { id: "a1_lets_smile", en: "Let's smile", fr: "Sourions", am: "እንሳቅ", ti: "ንሳቅ", fa: "بیایید لبخند بزنیم" },
    { id: "a1_lets_hug", en: "Let's hug", fr: "Enbrassons-nous", am: "እንተያያዝ", ti: "ንተያያዝ", fa: "بیایید در آغوش بگیریم" },
    { id: "a1_lets_kiss", en: "Let's kiss", fr: "Embrassons-nous", am: "እንሳም", ti: "ንሳም", fa: "بیایید ببوسیم" },
    { id: "a1_lets_love", en: "Let's love", fr: "Aimons", am: "እንወድ", ti: "ንፈቱ", fa: "بیایید دوست داشته باشیم" },
    { id: "a1_lets_hate", en: "Let's hate", fr: "Detestons", am: "እንጠላ", ti: "ንጠላ", fa: "بیایید نفرت کنیم" },
    { id: "a1_lets_fight", en: "Let's fight", fr: "Bataillons", am: "እንተጣላ", ti: "ንተጣላ", fa: "بیایید بجنگیم" },
    { id: "a1_lets_win", en: "Let's win", fr: "Gagnons", am: "እንለምስ", ti: "ንለምስ", fa: "بیایید پیروز شویم" },
    { id: "a1_lets_lose", en: "Let's lose", fr: "Perdons", am: "እንለምድ", ti: "ንለምድ", fa: "بیایید ببازیم" },
    { id: "a1_lets_win", en: "Let's win", fr: "Gagnons", am: "እንለምስ", ti: "ንለምስ", fa: "بیایید پیروز شویم" },
    { id: "a1_lets_lose", en: "Let's lose", fr: "Perdons", am: "እንለምድ", ti: "ንለምድ", fa: "بیایید ببازیم" }
  ],
  A2: [
    { id: "a2_need_help", en: "I need help", fr: "J'ai besoin d'aide", am: "እገዛ እፈልጋለሁ", ti: "ሓገዝ የድልየኒ", fa: "من کمک نیاز دارم" },
    { id: "a2_how_much", en: "How much is this?", fr: "C'est combien?", am: "ይህ ስንት ነው?", ti: "እዚ ክንደይ እዩ?", fa: "این چند است؟" },
    { id: "a2_learning", en: "I am learning", fr: "J'apprends", am: "እየተማርኩ ነው", ti: "ይመሃር ኣለኹ", fa: "من در حال یادگیری هستم" },
    { id: "a2_not_understand", en: "I don't understand", fr: "Je ne comprends pas", am: "አልገባኝም", ti: "ኣይተረድኣንን", fa: "من متوجه نمی شوم" },
    { id: "a2_repeat", en: "Can you repeat?", fr: "Pouvez-vous repeter?", am: "እባክዎ ይድገሙ", ti: "በጃኹም ደጊምኩም", fa: "می توانید تکرار کنید؟" },
    { id: "a2_station", en: "Train station", fr: "Gare", am: "ባቡር ጣቢያ", ti: "መደበኛ ባቡር", fa: "ایستگاه قطار" },
    { id: "a2_hospital", en: "Hospital", fr: "Hopital", am: "ሆስፒታል", ti: "ሆስፒታል", fa: "شفاخانه" },
    { id: "a2_market", en: "Market", fr: "Marche", am: "ገበያ", ti: "ዕዳጋ", fa: "بازار" },
    { id: "a2_work", en: "Work", fr: "Travail", am: "ስራ", ti: "ስራሕ", fa: "کار" },
    { id: "a2_family", en: "Family", fr: "Famille", am: "ቤተሰብ", ti: "ስድራ", fa: "فامیل" },
    { id: "a2_tomorrow", en: "Tomorrow", fr: "Demain", am: "ነገ", ti: "ጽባሕ", fa: "فردا" },
    { id: "a2_yesterday", en: "Yesterday", fr: "Hier", am: "ትናንት", ti: "ትማሊ", fa: "دیروز" },
    { id: "a2_tired", en: "I am tired", fr: "Je suis fatigue", am: "ደክሞኛል", ti: "ደኪመ", fa: "من خسته هستم" },
    { id: "a2_hungry", en: "I am hungry", fr: "J'ai faim", am: "ራብ አለብኝ", ti: "ጠሚ ኣለኒ", fa: "من گرسنه هستم" },
    { id: "a2_lets_go", en: "Let's go", fr: "Allons-y", am: "እንሂድ", ti: "ንኺድ", fa: "بیایید برویم" },
    { id: "a2_what_time", en: "What time is it?", fr: "Quelle heure est-il?", am: "ስንት ሰዓት ነው?", ti: "ሰዓት ክንደይ እዩ?", fa: "ساعت چند است؟" }
  ],
  B1: [
    { id: "b1_job", en: "I am looking for a job", fr: "Je cherche un emploi", am: "ስራ እፈልጋለሁ", ti: "ስራሕ እደሊ ኣለኹ", fa: "من دنبال کار هستم" },
    { id: "b1_experience", en: "I have experience", fr: "J'ai de l'experience", am: "ልምድ አለኝ", ti: "ተሞክሮ ኣለኒ", fa: "من تجربه دارم" },
    { id: "b1_speak", en: "I can speak", fr: "Je peux parler", am: "መናገር እችላለሁ", ti: "ክዛረብ እኽእል", fa: "من می توانم صحبت کنم" },
    { id: "b1_appointment", en: "Appointment", fr: "Rendez-vous", am: "ቀጠሮ", ti: "ቆጸራ", fa: "قرار ملاقات" },
    { id: "b1_document", en: "Document", fr: "Document", am: "ሰነድ", ti: "ሰነድ", fa: "سند" },
    { id: "b1_rent", en: "Rent", fr: "Loyer", am: "ኪራይ", ti: "ኪራይ", fa: "کرایه" },
    { id: "b1_transport", en: "Public transport", fr: "Transport public", am: "የህዝብ መጓጓዣ", ti: "ህዝባዊ መጓዓዝያ", fa: "ترانسپورت عمومی" },
    { id: "b1_internet", en: "Internet connection", fr: "Connexion internet", am: "የኢንተርኔት ግንኙነት", ti: "ኢንተርነት ርክብ", fa: "اتصال اینترنت" },
    { id: "b1_school", en: "My child goes to school", fr: "Mon enfant va a l'ecole", am: "ልጄ ወደ ትምህርት ቤት ይሄዳል", ti: "ውሉደይ ናብ ቤት ትምህርቲ ይኸይድ", fa: "طفل من به مکتب می رود" },
    { id: "b1_insurance", en: "Health insurance", fr: "Assurance maladie", am: "የጤና ኢንሹራንስ", ti: "ናይ ጥዕና ኢንሹራንስ", fa: "بیمه صحی" },
    { id: "b1_emergency", en: "Emergency", fr: "Urgence", am: "አስቸኳይ", ti: "ህጹጽ", fa: "اضطراری" },
    { id: "b1_report", en: "I want to report a problem", fr: "Je veux signaler un probleme", am: "ችግር ማሳወቅ እፈልጋለሁ", ti: "ጸገም ክሕብር እደሊ", fa: "می خواهم یک مشکل را گزارش دهم" },
    { id: "b1_neighborhood", en: "Neighborhood", fr: "Quartier", am: "አካባቢ", ti: "ከባቢ", fa: "محله" },
    { id: "b1_skills", en: "I want to improve my skills", fr: "Je veux ameliorer mes competences", am: "ክህሎቴን ማሻሻል እፈልጋለሁ", ti: "ክእለተይ ከምዕብል እደሊ", fa: "می خواهم مهارت هایم را بهتر کنم" },
    { id: "b1_meeting", en: "Meeting", fr: "Reunion", am: "ስብሰባ", ti: "ኣኼባ", fa: "جلسه" },
    { id: "b1_ontime", en: "Please come on time", fr: "Venez a l'heure", am: "እባክዎ በሰዓቱ ይምጡ", ti: "በጃኹም ብሰዓቱ ንዑ", fa: "لطفا به وقت بیایید" }
  ],
  B2: [
    { id: "b2_bank", en: "I would like to open a bank account", fr: "Je voudrais ouvrir un compte bancaire", am: "የባንክ ሂሳብ መክፈት እፈልጋለሁ", ti: "ኣካውንት ባንክ ክኸፍት እደሊ", fa: "می خواهم حساب بانکی باز کنم" },
    { id: "b2_explain", en: "Could you explain the process?", fr: "Pouvez-vous expliquer le processus?", am: "ሂደቱን ማብራራት ይችላሉ?", ti: "እቲ ሂደት ክትገልጹለይ ትኽእሉ?", fa: "می توانید روند را توضیح دهید؟" },
    { id: "b2_legal", en: "I need legal advice", fr: "J'ai besoin de conseils juridiques", am: "የህግ ምክር እፈልጋለሁ", ti: "ሕጋዊ ምኽሪ የድልየኒ", fa: "من مشاوره حقوقی نیاز دارم" },
    { id: "b2_permit", en: "Residence permit renewal", fr: "Renouvellement du permis de sejour", am: "የመኖሪያ ፈቃድ ማደስ", ti: "ፍቓድ መንበሪ ምሕዳስ", fa: "تمدید اجازه اقامت" },
    { id: "b2_interview", en: "Job interview", fr: "Entretien d'embauche", am: "የስራ ቃለ መጠይቅ", ti: "ቃለ መሕትት ስራሕ", fa: "مصاحبه کاری" },
    { id: "b2_training", en: "Professional training", fr: "Formation professionnelle", am: "የሙያ ስልጠና", ti: "ሙያዊ ስልጠና", fa: "آموزش حرفه ای" },
    { id: "b2_equal", en: "Equal opportunity", fr: "Egalite des chances", am: "እኩል ዕድል", ti: "ማዕረ ዕድል", fa: "فرصت برابر" },
    { id: "b2_support_center", en: "Community support center", fr: "Centre de soutien communautaire", am: "የማህበረሰብ ድጋፍ ማዕከል", ti: "ማእከል ድጋፍ ማሕበረሰብ", fa: "مرکز حمایت اجتماعی" },
    { id: "b2_patience", en: "I appreciate your patience", fr: "J'apprecie votre patience", am: "ትዕግስትዎን እጅግ አደንቃለሁ", ti: "ትዕግስትኩም ኣመስግን", fa: "از شکیبایی شما سپاسگزارم" },
    { id: "b2_exchange", en: "Cultural exchange", fr: "Echange culturel", am: "የባህል ልውውጥ", ti: "ባህላዊ ልውውጥ", fa: "تبادل فرهنگی" },
    { id: "b2_long_term", en: "Long-term plan", fr: "Plan a long terme", am: "የረጅም ጊዜ እቅድ", ti: "ናይ ነዊሕ ግዜ መደብ", fa: "برنامه درازمدت" },
    { id: "b2_finance", en: "Financial planning", fr: "Planification financiere", am: "የገንዘብ እቅድ", ti: "ፋይናንሳዊ መደብ", fa: "برنامه ریزی مالی" },
    { id: "b2_digital", en: "Digital services", fr: "Services numeriques", am: "ዲጂታል አገልግሎቶች", ti: "ዲጂታል ኣገልግሎታት", fa: "خدمات دیجیتال" },
    { id: "b2_rights", en: "Customer rights", fr: "Droits des clients", am: "የደንበኛ መብቶች", ti: "መሰል ዓማዊል", fa: "حقوق مشتری" },
    { id: "b2_volunteer", en: "Volunteer program", fr: "Programme de benevolat", am: "የበጎ ፈቃድ ፕሮግራም", ti: "ፕሮግራም ተወፋይ", fa: "برنامه داوطلبی" },
    { id: "b2_support", en: "Thank you for your support", fr: "Merci pour votre soutien", am: "ለድጋፍዎ እናመሰግናለን", ti: "ንድጋፍኩም የቐንየለይ", fa: "از حمایت شما سپاسگزارم" }
  ]
};

const supplementConfigs = {
  A1: {
    subjects: [
      { en: "I", fr: "Je", de: "Ich", am: "እኔ", ti: "ኣነ", fa: "من" },
      { en: "You", fr: "Tu", de: "Du", am: "አንተ", ti: "ንስኻ", fa: "تو" },
      { en: "We", fr: "Nous", de: "Wir", am: "እኛ", ti: "ንሕና", fa: "ما" },
      { en: "They", fr: "Ils", de: "Sie", am: "እነሱ", ti: "ንሳቶም", fa: "آنها" }
    ],
    verbs: [
      { en: "need", fr: "avons besoin de", de: "brauchen", am: "እፈልጋለሁ", ti: "የድልየኒ", fa: "نیاز دارم" },
      { en: "have", fr: "ai", de: "habe", am: "አለኝ", ti: "ኣለኒ", fa: "دارم" },
      { en: "see", fr: "vois", de: "sehe", am: "አያለሁ", ti: "እርኢ", fa: "می بینم" },
      { en: "like", fr: "aime", de: "mag", am: "እወዳለሁ", ti: "እፈቱ", fa: "دوست دارم" }
    ],
    objects: [
      { en: "water", fr: "de l'eau", de: "Wasser", am: "ውሃ", ti: "ማይ", fa: "آب" },
      { en: "bread", fr: "du pain", de: "Brot", am: "ዳቦ", ti: "ባኒ", fa: "نان" },
      { en: "a book", fr: "un livre", de: "ein Buch", am: "መጽሐፍ", ti: "መጽሓፍ", fa: "کتاب" },
      { en: "the bus", fr: "le bus", de: "den Bus", am: "አውቶቡስ", ti: "ኣውቶቡስ", fa: "اتوبوس" }
    ]
  },
  A2: {
    subjects: [
      { en: "I", fr: "Je", de: "Ich", am: "እኔ", ti: "ኣነ", fa: "من" },
      { en: "We", fr: "Nous", de: "Wir", am: "እኛ", ti: "ንሕና", fa: "ما" },
      { en: "My family", fr: "Ma famille", de: "Meine Familie", am: "ቤተሰቤ", ti: "ስድራይ", fa: "خانواده من" },
      { en: "Our group", fr: "Notre groupe", de: "Unsere Gruppe", am: "ቡድናችን", ti: "ጉጅለና", fa: "گروه ما" }
    ],
    verbs: [
      { en: "visit", fr: "visite", de: "besuche", am: "እጎበኛለሁ", ti: "እበጽሕ", fa: "بازدید می کنم" },
      { en: "prepare", fr: "prepare", de: "bereite vor", am: "አዘጋጃለሁ", ti: "አዳልው", fa: "آماده می کنم" },
      { en: "buy", fr: "achete", de: "kaufe", am: "እገዛለሁ", ti: "እዕድግ", fa: "می خرم" },
      { en: "search for", fr: "cherche", de: "suche", am: "እፈልጋለሁ", ti: "እደሊ", fa: "جستجو می کنم" }
    ],
    objects: [
      { en: "the market", fr: "le marche", de: "den Markt", am: "ገበያ", ti: "ዕዳጋ", fa: "بازار" },
      { en: "the station", fr: "la gare", de: "den Bahnhof", am: "ጣቢያ", ti: "ጣብያ", fa: "ایستگاه" },
      { en: "the hospital", fr: "l'hopital", de: "das Krankenhaus", am: "ሆስፒታል", ti: "ሆስፒታል", fa: "شفاخانه" },
      { en: "the documents", fr: "les documents", de: "die Dokumente", am: "ሰነዶች", ti: "ሰነዳት", fa: "اسناد" }
    ]
  },
  B1: {
    subjects: [
      { en: "I", fr: "Je", de: "Ich", am: "እኔ", ti: "ኣነ", fa: "من" },
      { en: "Our team", fr: "Notre equipe", de: "Unser Team", am: "ቡድናችን", ti: "ጉጅለና", fa: "تیم ما" },
      { en: "My colleague", fr: "Mon collegue", de: "Mein Kollege", am: "ባልደረባዬ", ti: "መሳርሕተይ", fa: "همکار من" },
      { en: "The community", fr: "La communaute", de: "Die Gemeinschaft", am: "ማህበረሰቡ", ti: "ማሕበረሰብ", fa: "جامعه" }
    ],
    verbs: [
      { en: "discusses", fr: "discute", de: "bespricht", am: "ይወያያል", ti: "ይዛተ", fa: "بحث می کند" },
      { en: "organizes", fr: "organise", de: "organisiert", am: "ያዘጋጃል", ti: "የዳሉ", fa: "سازماندهی می کند" },
      { en: "improves", fr: "ameliore", de: "verbessert", am: "ያሻሽላል", ti: "የመሓይሽ", fa: "بهبود می دهد" },
      { en: "supports", fr: "soutient", de: "unterstuetzt", am: "ይደግፋል", ti: "ይድግፍ", fa: "حمایت می کند" }
    ],
    objects: [
      { en: "the project plan", fr: "le plan du projet", de: "den Projektplan", am: "የፕሮጀክት እቅድ", ti: "መደብ ፕሮጀክት", fa: "طرح پروژه" },
      { en: "the meeting", fr: "la reunion", de: "die Besprechung", am: "ስብሰባ", ti: "ኣኼባ", fa: "جلسه" },
      { en: "the application", fr: "la demande", de: "den Antrag", am: "ማመልከቻ", ti: "ምልክታ", fa: "درخواست" },
      { en: "the training program", fr: "le programme de formation", de: "das Trainingsprogramm", am: "የስልጠና ፕሮግራም", ti: "ፕሮግራም ስልጠና", fa: "برنامه آموزشی" }
    ]
  },
  B2: {
    subjects: [
      { en: "I", fr: "Je", de: "Ich", am: "እኔ", ti: "ኣነ", fa: "من" },
      { en: "Our organization", fr: "Notre organisation", de: "Unsere Organisation", am: "ድርጅታችን", ti: "ውድብና", fa: "سازمان ما" },
      { en: "The city office", fr: "Le bureau municipal", de: "Das Stadtbuero", am: "የከተማ ቢሮ", ti: "ቤት ጽሕፈት ከተማ", fa: "دفتر شهری" },
      { en: "The policy group", fr: "Le groupe politique", de: "Die Politikgruppe", am: "የፖሊሲ ቡድን", ti: "ጉጅለ ፖሊሲ", fa: "گروه پالیسی" }
    ],
    verbs: [
      { en: "evaluates", fr: "evalue", de: "bewertet", am: "ይገምግማል", ti: "ይገምግም", fa: "ارزیابی می کند" },
      { en: "coordinates", fr: "coordonne", de: "koordiniert", am: "ያስተባብራል", ti: "ይወሃህድ", fa: "هماهنگ می کند" },
      { en: "reviews", fr: "examine", de: "prueft", am: "ይመርምራል", ti: "ይምርምር", fa: "بازبینی می کند" },
      { en: "implements", fr: "met en oeuvre", de: "setzt um", am: "ይተግብራል", ti: "ይፍጽም", fa: "اجرا می کند" }
    ],
    objects: [
      { en: "the long-term strategy", fr: "la strategie a long terme", de: "die Langzeitstrategie", am: "የረጅም ጊዜ ስትራቴጂ", ti: "ስትራተጂ ነዊሕ ግዜ", fa: "استراتژی درازمدت" },
      { en: "the public service process", fr: "le processus de service public", de: "den oeffentlichen Dienstprozess", am: "የህዝብ አገልግሎት ሂደት", ti: "ሂደት ኣገልግሎት ህዝቢ", fa: "روند خدمات عمومی" },
      { en: "the financial plan", fr: "le plan financier", de: "den Finanzplan", am: "የገንዘብ እቅድ", ti: "መደብ ፋይናንስ", fa: "برنامه مالی" },
      { en: "the community program", fr: "le programme communautaire", de: "das Gemeinschaftsprogramm", am: "የማህበረሰብ ፕሮግራም", ti: "ፕሮግራም ማሕበረሰብ", fa: "برنامه اجتماعی" }
    ]
  }
};

function composeSentence(subject, verb, object, lang) {
  if (lang === "am" || lang === "ti" || lang === "fa") {
    return `${subject[lang]} ${object[lang]} ${verb[lang]}`;
  }

  return `${subject[lang]} ${verb[lang]} ${object[lang]}`;
}

function buildSupplementEntries(level) {
  const config = supplementConfigs[level];
  const entries = [];
  let counter = 1;

  for (const subject of config.subjects) {
    for (const verb of config.verbs) {
      for (const object of config.objects) {
        entries.push({
          id: `${level.toLowerCase()}_supp_${counter}`,
          en: composeSentence(subject, verb, object, "en"),
          fr: composeSentence(subject, verb, object, "fr"),
          de: composeSentence(subject, verb, object, "de"),
          am: composeSentence(subject, verb, object, "am"),
          ti: composeSentence(subject, verb, object, "ti"),
          fa: composeSentence(subject, verb, object, "fa")
        });
        counter += 1;
      }
    }
  }

  return entries;
}

function withMinimumEntries(level) {
  const baseEntries = [...(baseExpressionsByLevel[level] || [])];
  if (baseEntries.length >= MIN_ENTRIES_PER_LEVEL) {
    return baseEntries;
  }

  const supplementEntries = buildSupplementEntries(level);
  const needed = MIN_ENTRIES_PER_LEVEL - baseEntries.length;
  return [...baseEntries, ...supplementEntries.slice(0, needed)];
}

export const expressionsByLevel = {
  A1: withMinimumEntries("A1"),
  A2: withMinimumEntries("A2"),
  B1: withMinimumEntries("B1"),
  B2: withMinimumEntries("B2")
};

export const levelSectionTitles = {
  A1: ["Everyday Basics", "Polite Expressions", "People and Places", "Starter Sentences"],
  A2: ["Daily Communication", "Travel and City", "Health and Family", "Time and Routine"],
  B1: ["Work and Community", "Services and Documents", "Personal Growth", "Social Interaction"],
  B2: ["Civic and Professional", "Systems and Process", "Planning and Rights", "Advanced Communication"]
};
