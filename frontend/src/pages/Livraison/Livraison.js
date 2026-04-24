import React from 'react';
import './Livraison.css';

const Livraison = () => {
    return (
        <div className="info-page">
            <div className="info-wrap">
                <header className="info-header">
                    <span className="info-eyebrow">Logistique</span>
                    <h1 className="info-title">Livraison</h1>
                    <p className="info-intro">
                        Nos expeditions sont organisees avec YALIDINE pour assurer un transport fiable, trace et adapte aux
                        contraintes de livraison nationale.
                    </p>
                </header>

                <section className="info-card">
                    <h2>Transporteur YALIDINE</h2>
                    <ul className="info-list">
                        <li>Expedition via YALIDINE apres validation et preparation de la commande.</li>
                        <li>Delais estimes communiques selon la wilaya et la charge logistique.</li>
                        <li>Coordonnees exactes requises pour eviter les echecs de distribution.</li>
                        <li>Joignabilite telephone recommandee le jour de remise.</li>
                    </ul>
                    <div className="info-alert">
                        Important: pour les articles volumineux, le delai peut etre ajuste selon la disponibilite du circuit de transport.
                    </div>
                </section>

                <section className="info-card">
                    <h2>Delais indicatifs</h2>
                    <ul className="info-list">
                        <li>Preparation commande: 24h a 72h ouvrables.</li>
                        <li>Transit YALIDINE: variable selon destination et periode.</li>
                        <li>Periode de forte demande: extension possible des delais annonces.</li>
                    </ul>
                </section>

                <section className="info-card">
                    <h2>Frais de livraison</h2>
                    <p>
                        Les frais sont calcules au moment de la commande selon le poids, le volume, la zone de destination
                        et le mode de livraison disponible.
                    </p>
                </section>

                <section className="info-card">
                    <h2>Suivi et assistance</h2>
                    <p>
                        En cas de retard anormal, colis bloque ou information incoherente, contactez notre support avec le numero
                        de commande pour ouverture d&apos;un suivi prioritaire.
                    </p>
                    <p className="info-contact">
                        Support livraison: <a href="tel:+213557937423">0557937423</a>
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Livraison;
