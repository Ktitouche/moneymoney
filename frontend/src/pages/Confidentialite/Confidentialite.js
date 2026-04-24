import React from 'react';
import './Confidentialite.css';

const Confidentialite = () => {
    return (
        <div className="info-page">
            <div className="info-wrap">
                <header className="info-header">
                    <span className="info-eyebrow">Donnees personnelles</span>
                    <h1 className="info-title">Politique de confidentialite</h1>
                    <p className="info-intro">
                        Cette politique explique comment nous collectons, utilisons et protegez vos donnees lorsque vous utilisez
                        notre site et nos services.
                    </p>
                </header>

                <section className="info-card">
                    <h2>1. Donnees collectees</h2>
                    <ul className="info-list">
                        <li>Informations de compte: nom, prenom, email, telephone.</li>
                        <li>Informations de commande: adresse, articles, historique d&apos;achat.</li>
                        <li>Donnees techniques: navigation, appareil, logs de securite.</li>
                    </ul>
                </section>

                <section className="info-card">
                    <h2>2. Finalites d&apos;utilisation</h2>
                    <ul className="info-list">
                        <li>Traiter et livrer les commandes.</li>
                        <li>Assurer le support client et la prevention des fraudes.</li>
                        <li>Ameliorer l&apos;experience utilisateur et la qualite du service.</li>
                    </ul>
                </section>

                <section className="info-card">
                    <h2>3. Partage des donnees</h2>
                    <p>
                        Les donnees strictement necessaires peuvent etre partagees avec nos partenaires techniques et logistiques,
                        dont le transporteur YALIDINE pour la livraison. Aucune vente de donnees personnelles n&apos;est realisee.
                    </p>
                </section>

                <section className="info-card">
                    <h2>4. Conservation et securite</h2>
                    <p>
                        Nous mettons en place des mesures techniques et organisationnelles de securite. Les donnees sont conservees
                        pendant la duree necessaire aux finalites de traitement et obligations legales applicables.
                    </p>
                </section>

                <section className="info-card">
                    <h2>5. Vos droits</h2>
                    <p>
                        Vous pouvez demander l&apos;acces, la rectification ou la suppression de vos donnees, sous reserve des
                        obligations legales de conservation.
                    </p>
                    <p className="info-contact">
                        Demande confidentialite: <a href="mailto:Decofeustudio18@gmail.com">Decofeustudio18@gmail.com</a>
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Confidentialite;
