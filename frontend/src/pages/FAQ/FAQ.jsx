import React from 'react';
import './FAQ.css';

const FAQ = () => {
    return (
        <div className="info-page">
            <div className="info-wrap">
                <header className="info-header">
                    <span className="info-eyebrow">Support</span>
                    <h1 className="info-title">FAQ</h1>
                    <p className="info-intro">
                        Reponses claires et solides sur la qualite, la livraison, les paiements et le service apres-vente.
                        Cette page est mise a jour regulierement pour rester utile avant et apres votre commande.
                    </p>
                </header>

                <section className="info-card">
                    <h2>Qualite produit</h2>

                    <article className="faq-item">
                        <h3>Vos produits sont-ils verifies avant expedition ?</h3>
                        <p>
                            Oui. Chaque commande passe un controle visuel et fonctionnel avant emballage: etat general,
                            finitions, accessoires annonces et conformite avec la fiche produit.
                        </p>
                    </article>

                    <article className="faq-item">
                        <h3>Comment evaluer la robustesse d&apos;un brasero ou accessoire ?</h3>
                        <p>
                            Nous indiquons les matieres, epaisseurs, dimensions utiles, conseils d&apos;usage et niveau d&apos;entretien.
                            En cas de doute, notre equipe vous oriente vers la reference la plus adaptee a votre frequence d&apos;utilisation.
                        </p>
                    </article>

                    <article className="faq-item">
                        <h3>Que faire si un article arrive endommage ?</h3>
                        <p>
                            Contactez-nous sous 48h avec photos du colis et du produit. Nous ouvrons un dossier prioritaire et
                            proposons un remplacement, un retour ou une solution adaptee selon le cas.
                        </p>
                    </article>
                </section>

                <section className="info-card">
                    <h2>Commande et paiement</h2>

                    <article className="faq-item">
                        <h3>Quels moyens de paiement acceptez-vous ?</h3>
                        <p>
                            Les moyens disponibles apparaissent au checkout selon la zone de livraison. Si une option n&apos;apparait pas,
                            cela signifie qu&apos;elle n&apos;est pas active pour votre destination.
                        </p>
                    </article>

                    <article className="faq-item">
                        <h3>Puis-je modifier ma commande apres validation ?</h3>
                        <p>
                            Oui, tant qu&apos;elle n&apos;est pas preparee. Contactez-nous rapidement avec le numero de commande pour verifier
                            ce qui peut etre ajuste (quantite, adresse, produit equivalent).
                        </p>
                    </article>
                </section>

                <section className="info-card">
                    <h2>Livraison et retour</h2>

                    <article className="faq-item">
                        <h3>Comment suivre ma livraison YALIDINE ?</h3>
                        <p>
                            Des que votre colis est pris en charge, le suivi est communique. Vous pouvez suivre l&apos;acheminement
                            jusqu&apos;a la remise finale via les informations transmises par notre service client.
                        </p>
                    </article>

                    <article className="faq-item">
                        <h3>Combien de temps pour un echange ou un remboursement ?</h3>
                        <p>
                            Une fois le retour recu et valide, le traitement est lance rapidement. Le delai exact depend du mode
                            de paiement et du transporteur.
                        </p>
                    </article>
                </section>

                <p className="info-contact">
                    Besoin d&apos;une reponse precise ? Contactez-nous via la page Contact ou par telephone au 0557937423.
                </p>
            </div>
        </div>
    );
};

export default FAQ;
