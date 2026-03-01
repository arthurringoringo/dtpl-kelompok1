export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer__inner container">
                <div className="footer__col">
                    <div className="footer__title">Jam Operasional</div>
                    <div className="footer__row">
                        <span>Senin</span>
                        <span>06.00 - 23.59 WIB</span>
                    </div>
                    <div className="footer__row">
                        <span>Selasa - Jumat</span>
                        <span>07.00 - 23.59 WIB</span>
                    </div>
                    <div className="footer__row">
                        <span>Sabtu, Minggu</span>
                        <span>05.00 - 23.59 WIB</span>
                    </div>
                </div>

                <div className="footer__col footer__col--center">
                    <div className="footer__brand">Desa Wisata Manud Jaya</div>
                    <div className="footer__desc">
                        Tempat yang cocok untuk menikmati suasana pedesaan di Yogyakarta.
                    </div>
                    <div className="footer__quote">“Sejuk dan Tentram”</div>
                </div>

                <div className="footer__col footer__col--right">
                    <div className="footer__title">Kontak</div>
                    <div className="footer__contact">
                        <div className="footer__contactItem">📞 0813 1234 5678</div>
                        <div className="footer__contactItem">📍 @desawisata_manudjaya</div>
                        <div className="footer__contactItem">✉️ manudjaya.desawisata@gmail.com</div>
                    </div>

                    <div className="map">
                        <div className="map">
                            <iframe
                                className="map__iframe"
                                title="Lokasi UI Salemba"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                src="https://www.google.com/maps?q=Universitas%20Indonesia%20Salemba&output=embed"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer__bottom container">
                <div className="footer__line" />
            </div>
        </footer>
    );
}