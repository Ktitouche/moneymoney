import React from 'react';
import './Retours.css';

const Retours = () => {
    return (
        <div className="info-page">
            <div className="info-wrap">
                <header className="info-header">
                    <span className="info-eyebrow">Service client</span>
                    <h1 className="info-title">Retours</h1>
                    <p className="info-intro">
                        Nous traitons les demandes de retour avec transparence et rapidite, dans le respect des conditions
                        de vente et de l&apos;etat du produit.
                    </p>
                </header>

                <section className="info-card">
                    <h2>Conditions de retour</h2>
                    <ul className="info-list">
                        <li>Demande de retour a envoyer rapidement apres reception.</li>
                        <li>Produit non utilise, complet et en etat revendable.</li>
                        <li>Emballage d&apos;origine et accessoires preferablement conserves.</li>
                        <li>Preuve d&apos;achat ou numero de commande obligatoire.</li>
                    </ul>
                </section>

                <section className="info-card">
                    <h2>Produits non eligibles</h2>
                    <ul className="info-list">
                        <li>Articles personnalises ou commandes specifiques.</li>
                        <li>Produits utilises, modifies ou endommages apres livraison.</li>
                        <li>Retours incomplets sans composant essentiel.</li>
                    </ul>
                </section>

                <section className="info-card">
                    <h2>Processus</h2>
                    <ol className="info-list">
                        <li>Contactez le support avec votre numero de commande et le motif.</li>
                        <li>Recevez la procedure de retour et les instructions logistiques.</li>
                        <li>Expediez le colis selon les consignes communiquees.</li>
                        <li>Controle qualite a reception puis validation dossier.</li>
                    </ol>
                </section>

                <section className="info-card">
                    <h2>Remboursement ou echange</h2>
                    <p>
                        Apres validation du retour, nous proposons selon le cas un echange, un avoir ou un remboursement.
                        Le traitement peut varier selon le mode de paiement et le transport.
                    </p>
                    <p className="info-contact">
                        Assistance retours: <a href="tel:+213557937423">0557937423</a>
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Retours;
