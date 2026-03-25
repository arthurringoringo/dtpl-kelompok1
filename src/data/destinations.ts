export type DestinationItem = {
  id: number;
  name: string;
  date: string;
  descriptions: string;
  destination_type: string;
  start_time: string;
  end_time: string;
  image_url: string;
  latitude: string;
  longitude: string;
  price: string;
  ticket_type: string;
  category: {
    id: number;
    name: string;
    image_url: string | null;
  };
};

export const destinations: DestinationItem[] = [
  // ================= KERAJINAN =================
  {
    id: 1,
    name: "Workshop Kerajinan Bambu",
    date: "2026-06-10",
    descriptions:
      "Belajar membuat kerajinan dari bambu bersama pengrajin lokal. Peserta akan dikenalkan pada jenis bambu yang biasa digunakan untuk berbagai produk kerajinan. Setiap peserta bisa mencoba proses pemotongan, perakitan, dan finishing secara langsung. Suasana workshop dibuat santai agar cocok untuk pemula maupun pecinta seni kerajinan. Hasil karya yang sudah selesai dapat dibawa pulang sebagai kenang-kenangan.",
    destination_type: "single",
    start_time: "09:00",
    end_time: "12:00",
    image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    latitude: "-7.7956",
    longitude: "110.3695",
    price: "120000",
    ticket_type: "price_per_ticket",
    category: { id: 1, name: "Kerajinan", image_url: null },
  },
  {
    id: 2,
    name: "Membatik Tradisional",
    date: "2026-06-12",
    descriptions:
      "Pengalaman membatik langsung dengan teknik tradisional. Peserta akan mempelajari dasar pola batik, penggunaan canting, dan proses pewarnaan kain. Kegiatan ini dipandu oleh pengrajin berpengalaman yang siap membantu di setiap tahap. Selain praktik, peserta juga akan mendapatkan penjelasan singkat mengenai filosofi motif batik lokal. Kain hasil membatik dapat dibawa pulang sebagai hasil karya pribadi.",
    destination_type: "single",
    start_time: "10:00",
    end_time: "13:00",
    image_url: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
    latitude: "-7.801",
    longitude: "110.364",
    price: "150000",
    ticket_type: "price_per_ticket",
    category: { id: 1, name: "Kerajinan", image_url: null },
  },

  // ================= KULINER =================
  {
    id: 3,
    name: "Wisata Kuliner Desa",
    date: "2026-06-15",
    descriptions:
      "Menikmati makanan khas desa langsung dari UMKM lokal. Peserta akan diajak mencicipi berbagai hidangan tradisional yang dibuat dari bahan segar setempat. Kegiatan ini juga memberi kesempatan untuk mengenal cerita di balik resep dan proses masaknya. Setiap titik kuliner menghadirkan cita rasa khas yang berbeda dan autentik. Cocok untuk pencinta wisata rasa yang ingin merasakan suasana desa yang hangat.",
    destination_type: "single",
    start_time: "11:00",
    end_time: "14:00",
    image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    latitude: "-7.8",
    longitude: "110.37",
    price: "100000",
    ticket_type: "price_per_ticket",
    category: { id: 2, name: "Kulineran", image_url: null },
  },
  {
    id: 4,
    name: "Cooking Class Tradisional",
    date: "2026-06-16",
    descriptions:
      "Belajar memasak makanan khas desa bersama warga. Peserta akan dipandu mulai dari persiapan bahan, pengolahan bumbu, hingga penyajian akhir. Menu yang dimasak merupakan sajian tradisional yang sering dihidangkan dalam acara keluarga desa. Selain memasak, peserta juga dapat mendengar tips sederhana agar rasa masakan tetap autentik. Setelah kelas selesai, hasil masakan dapat dinikmati bersama dalam suasana yang akrab.",
    destination_type: "single",
    start_time: "09:00",
    end_time: "12:00",
    image_url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f",
    latitude: "-7.79",
    longitude: "110.36",
    price: "180000",
    ticket_type: "price_per_ticket",
    category: { id: 2, name: "Kulineran", image_url: null },
  },

  // ================= KELILING DESA =================
  {
    id: 5,
    name: "Tour Sepeda Desa",
    date: "2026-06-18",
    descriptions:
      "Keliling desa dengan sepeda menikmati alam pedesaan. Rute perjalanan dirancang melewati jalan-jalan kecil, area persawahan, dan pemukiman warga yang asri. Peserta dapat menikmati udara segar sambil melihat aktivitas masyarakat setempat dari dekat. Kegiatan ini cocok untuk yang ingin berwisata santai namun tetap aktif bergerak. Guide lokal akan menemani perjalanan dan menjelaskan titik-titik menarik sepanjang rute.",
    destination_type: "single",
    start_time: "07:00",
    end_time: "10:00",
    image_url: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e",
    latitude: "-7.81",
    longitude: "110.38",
    price: "90000",
    ticket_type: "price_per_ticket",
    category: { id: 3, name: "Keliling Desa", image_url: null },
  },
  {
    id: 6,
    name: "Jelajah Sawah",
    date: "2026-06-19",
    descriptions:
      "Menjelajahi area persawahan bersama guide lokal. Peserta akan diajak menyusuri jalur sawah sambil menikmati pemandangan hijau yang menenangkan. Selama perjalanan, guide akan menjelaskan proses pertanian dan kehidupan petani di desa tersebut. Kegiatan ini memberikan pengalaman dekat dengan alam dan suasana pedesaan yang autentik. Sangat cocok bagi pengunjung yang ingin healing sambil belajar hal baru.",
    destination_type: "single",
    start_time: "08:00",
    end_time: "11:00",
    image_url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    latitude: "-7.82",
    longitude: "110.37",
    price: "80000",
    ticket_type: "price_per_ticket",
    category: { id: 3, name: "Keliling Desa", image_url: null },
  },

  // ================= KESENIAN =================
  {
    id: 7,
    name: "Pertunjukan Tari Tradisional",
    date: "2026-06-20",
    descriptions:
      "Menikmati seni tari khas daerah. Pertunjukan dibawakan oleh penari lokal dengan kostum tradisional yang memukau dan penuh warna. Setiap tarian memiliki cerita dan makna budaya yang akan dijelaskan secara singkat kepada penonton. Suasana panggung dibuat hangat agar pengunjung dapat merasakan kedekatan dengan seni pertunjukan desa. Kegiatan ini cocok untuk wisatawan yang ingin menikmati hiburan sekaligus mengenal budaya daerah.",
    destination_type: "single",
    start_time: "19:00",
    end_time: "21:00",
    image_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
    latitude: "-7.8",
    longitude: "110.35",
    price: "130000",
    ticket_type: "price_per_ticket",
    category: { id: 4, name: "Kesenian", image_url: null },
  },
  {
    id: 8,
    name: "Workshop Musik Tradisional",
    date: "2026-06-21",
    descriptions:
      "Belajar alat musik tradisional. Peserta akan diperkenalkan pada berbagai instrumen khas daerah beserta cara memainkannya. Instruktur lokal akan memandu latihan dasar secara bertahap agar mudah diikuti oleh pemula. Selain praktik, peserta juga akan mengenal fungsi musik tradisional dalam upacara dan pertunjukan budaya. Di akhir sesi, peserta dapat mencoba bermain bersama dalam formasi sederhana yang seru.",
    destination_type: "single",
    start_time: "15:00",
    end_time: "18:00",
    image_url: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc",
    latitude: "-7.79",
    longitude: "110.36",
    price: "140000",
    ticket_type: "price_per_ticket",
    category: { id: 4, name: "Kesenian", image_url: null },
  },

  // ================= ATRAKSI =================
  {
    id: 9,
    name: "Air Terjun Hidden Gem",
    date: "2026-06-22",
    descriptions:
      "Eksplorasi air terjun tersembunyi. Perjalanan menuju lokasi menghadirkan pengalaman trekking ringan dengan pemandangan alam yang masih asri. Sesampainya di lokasi, peserta dapat menikmati udara sejuk, suara air yang menenangkan, dan suasana yang jauh dari keramaian. Spot ini sangat cocok untuk foto-foto maupun sekadar melepas penat dari rutinitas. Guide akan memastikan perjalanan tetap aman dan nyaman untuk seluruh peserta.",
    destination_type: "single",
    start_time: "08:00",
    end_time: "12:00",
    image_url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    latitude: "-7.83",
    longitude: "110.39",
    price: "160000",
    ticket_type: "price_per_ticket",
    category: { id: 5, name: "Atraksi", image_url: null },
  },
  {
    id: 10,
    name: "Sunrise View Point",
    date: "2026-06-23",
    descriptions:
      "Menikmati sunrise dari puncak bukit. Peserta akan berangkat pagi untuk mendapatkan momen matahari terbit yang indah dari titik pandang terbaik. Dari lokasi ini, pengunjung bisa melihat panorama desa, perbukitan, dan kabut tipis yang menambah suasana magis. Tempat ini cocok untuk pencinta fotografi maupun pengunjung yang ingin menikmati pagi dengan tenang. Guide akan membantu mengatur waktu perjalanan agar peserta tidak melewatkan golden moment saat matahari terbit.",
    destination_type: "single",
    start_time: "05:00",
    end_time: "07:00",
    image_url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
    latitude: "-7.84",
    longitude: "110.40",
    price: "110000",
    ticket_type: "price_per_ticket",
    category: { id: 5, name: "Atraksi", image_url: null },
  },

  // ================= OUTBOUND =================
  {
    id: 11,
    name: "Outbound Team Building",
    date: "2026-06-24",
    descriptions:
      "Kegiatan seru untuk tim building. Peserta akan mengikuti berbagai permainan kelompok yang dirancang untuk meningkatkan kerja sama, komunikasi, dan kekompakan tim. Aktivitas dilakukan di area terbuka dengan suasana yang menyenangkan dan penuh semangat. Program ini cocok untuk komunitas, kantor, maupun rombongan keluarga besar. Fasilitator akan memandu setiap sesi agar kegiatan tetap aman, tertib, dan seru sampai selesai.",
    destination_type: "group",
    start_time: "09:00",
    end_time: "15:00",
    image_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac",
    latitude: "-7.85",
    longitude: "110.41",
    price: "200000",
    ticket_type: "price_per_ticket",
    category: { id: 6, name: "Outbond", image_url: null },
  },
  {
    id: 12,
    name: "Flying Fox Adventure",
    date: "2026-06-25",
    descriptions:
      "Uji adrenalin dengan flying fox. Peserta akan merasakan sensasi meluncur dari ketinggian sambil menikmati pemandangan alam sekitar. Sebelum memulai, tim instruktur akan memberikan briefing keselamatan dan membantu pemasangan perlengkapan dengan benar. Aktivitas ini cocok untuk pengunjung yang suka tantangan tetapi tetap ingin menikmati wisata yang aman. Pengalaman ini akan menjadi salah satu momen paling seru selama berkunjung ke desa wisata.",
    destination_type: "single",
    start_time: "10:00",
    end_time: "14:00",
    image_url: "https://images.unsplash.com/photo-1500534623283-312aade485b7",
    latitude: "-7.86",
    longitude: "110.42",
    price: "170000",
    ticket_type: "price_per_ticket",
    category: { id: 6, name: "Outbond", image_url: null },
  },
];