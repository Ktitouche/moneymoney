import React from 'react';
import './CGV.css';

const CGV = () => {
    return (
        <div className="info-page">
            <div className="info-wrap">
                <header className="info-header">
                    <span className="info-eyebrow">Juridique</span>
                    <h1 className="info-title">Conditions generales de vente (CGV)</h1>
                    <p className="info-intro">
                        Ces conditions encadrent les commandes passees sur notre boutique. Elles definissent les droits et
                        obligations du client et du vendeur.
                    </p>
                </header>

                <section className="info-card">
                    <h2>1. Objet</h2>
                    <p>
                        Les presentes CGV regissent la vente des produits proposes sur le site, de la commande a la livraison,
                        incluant le service apres-vente.
                    </p>
                </section>

                <section className="info-card">
                    <h2>2. Produits et disponibilite</h2>
                    <p>
                        Les descriptions sont presentees avec le plus grand soin. Les disponibilites sont indiquees a titre
                        informatif et peuvent evoluer selon le stock reel.
                    </p>
                </section>

                <section className="info-card">
                    <h2>3. Prix</h2>
                    <p>
                        Les prix affiches sont ceux valables au moment de la commande. Des frais de livraison peuvent s&apos;ajouter
                        selon la destination et le type de colis.
                    </p>
                </section>

                <section className="info-card">
                    <h2>4. Validation de commande</h2>
                    <p>
                        Toute commande validee implique l&apos;acceptation pleine et entiere des presentes CGV. Nous nous reservons
                        le droit d&apos;annuler une commande en cas d&apos;information inexacte ou de suspicion d&apos;usage frauduleux.
                    </p>
                </section>

                <section className="info-card">
                    <h2>5. Livraison</h2>
                    <p>
                        Les expeditions sont assurees via les transporteurs partenaires, dont YALIDINE. Les delais annonces sont
                        indicatifs et peuvent varier en fonction des conditions logistiques.
                    </p>
                </section>

                <section className="info-card">
                    <h2>6. Retours et reclamations</h2>
                    <p>
                        Les demandes de retour sont traitees selon la politique en vigueur publiee sur la page Retours.
                        Toute reclamation doit etre formulee avec les elements necessaires a son instruction.
                    </p>
                </section>

                <section className="info-card">
                    <h2>7. Limitation de responsabilite</h2>
                    <p>
                        Notre responsabilite ne saurait etre engagee pour un dommage indirect ou un retard imputable au
                        transporteur, a un cas de force majeure ou a une mauvaise utilisation du produit.
                    </p>
                </section>

                <section className="info-card">
                    <h2>8. Contact</h2>
                    <p>
                        Pour toute question juridique ou commerciale, contactez-nous via la page Contact ou par telephone.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default CGV;
