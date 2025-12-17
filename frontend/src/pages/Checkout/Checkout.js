import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import './Checkout.css';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    rue: user?.adresse?.rue || '',
    wilaya: '',
    telephone: user?.telephone || '',
    typeLivraison: 'domicile',
    pointRelais: ''
  });
  const WILAYAS = [
    { code: '01', nom: 'Adrar', prixDomicile: 1050, prixRelais: 850 },
    { code: '02', nom: 'Chlef', prixDomicile: 900, prixRelais: 650 },
    { code: '03', nom: 'Laghouat', prixDomicile: 950, prixRelais: 750 },
    { code: '04', nom: 'Oum El Bouaghi', prixDomicile: 900, prixRelais: 650 },
    { code: '05', nom: 'Batna', prixDomicile: 900, prixRelais: 650 },
    { code: '06', nom: 'Béjaïa', prixDomicile: 900, prixRelais: 650 },
    { code: '07', nom: 'Biskra', prixDomicile: 950, prixRelais: 750 },
    { code: '08', nom: 'Béchar', prixDomicile: 1050, prixRelais: 850 },
    { code: '09', nom: 'Blida', prixDomicile: 700, prixRelais: 550 },
    { code: '10', nom: 'Bouira', prixDomicile: 900, prixRelais: 650 },
    { code: '11', nom: 'Tamanrasset', prixDomicile: 1600, prixRelais: 1400 },
    { code: '12', nom: 'Tébessa', prixDomicile: 950, prixRelais: 750 },
    { code: '13', nom: 'Tlemcen', prixDomicile: 900, prixRelais: 650 },
    { code: '14', nom: 'Tiaret', prixDomicile: 900, prixRelais: 650 },
    { code: '15', nom: 'Tizi Ouzou', prixDomicile: 900, prixRelais: 650 },
    { code: '16', nom: 'Alger', prixDomicile: 590, prixRelais: 450 },
    { code: '17', nom: 'Djelfa', prixDomicile: 950, prixRelais: 750 },
    { code: '18', nom: 'Jijel', prixDomicile: 900, prixRelais: 650 },
    { code: '19', nom: 'Sétif', prixDomicile: 900, prixRelais: 650 },
    { code: '20', nom: 'Saïda', prixDomicile: 900, prixRelais: 650 },
    { code: '21', nom: 'Skikda', prixDomicile: 900, prixRelais: 650 },
    { code: '22', nom: 'Sidi Bel Abbès', prixDomicile: 900, prixRelais: 650 },
    { code: '23', nom: 'Annaba', prixDomicile: 900, prixRelais: 650 },
    { code: '24', nom: 'Guelma', prixDomicile: 900, prixRelais: 650 },
    { code: '25', nom: 'Constantine', prixDomicile: 900, prixRelais: 650 },
    { code: '26', nom: 'Médéa', prixDomicile: 900, prixRelais: 650 },
    { code: '27', nom: 'Mostaganem', prixDomicile: 900, prixRelais: 650 },
    { code: '28', nom: 'M\'Sila', prixDomicile: 900, prixRelais: 650 },
    { code: '29', nom: 'Mascara', prixDomicile: 900, prixRelais: 650 },
    { code: '30', nom: 'Ouargla', prixDomicile: 950, prixRelais: 750 },
    { code: '31', nom: 'Oran', prixDomicile: 900, prixRelais: 650 },
    { code: '32', nom: 'El Bayadh', prixDomicile: 1050, prixRelais: 850 },
    { code: '33', nom: 'Illizi', prixDomicile: 1600, prixRelais: 1400 },
    { code: '34', nom: 'Bordj Bou Arreridj', prixDomicile: 900, prixRelais: 650 },
    { code: '35', nom: 'Boumerdès', prixDomicile: 700, prixRelais: 550 },
    { code: '36', nom: 'El Tarf', prixDomicile: 900, prixRelais: 650 },
    { code: '37', nom: 'Tindouf', prixDomicile: 1600, prixRelais: 1400 },
    { code: '38', nom: 'Tissemsilt', prixDomicile: 900, prixRelais: 650 },
    { code: '39', nom: 'El Oued', prixDomicile: 950, prixRelais: 750 },
    { code: '40', nom: 'Khenchela', prixDomicile: 900, prixRelais: 650 },
    { code: '41', nom: 'Souk Ahras', prixDomicile: 900, prixRelais: 650 },
    { code: '42', nom: 'Tipaza', prixDomicile: 700, prixRelais: 550 },
    { code: '43', nom: 'Mila', prixDomicile: 900, prixRelais: 650 },
    { code: '44', nom: 'Aïn Defla', prixDomicile: 900, prixRelais: 650 },
    { code: '45', nom: 'Naâma', prixDomicile: 1050, prixRelais: 850 },
    { code: '46', nom: 'Aïn Témouchent', prixDomicile: 900, prixRelais: 650 },
    { code: '47', nom: 'Ghardaïa', prixDomicile: 950, prixRelais: 750 },
    { code: '48', nom: 'Relizane', prixDomicile: 900, prixRelais: 650 },
    { code: '49', nom: 'Timimoun', prixDomicile: 1050, prixRelais: 850 },
    { code: '50', nom: 'Bordj Badji Mokhtar', prixDomicile: 1050, prixRelais: 850 },
    { code: '51', nom: 'Ouled Djellal', prixDomicile: 950, prixRelais: 750 },
    { code: '52', nom: 'Béni Abbès', prixDomicile: 1050, prixRelais: 850 },
    { code: '53', nom: 'In Salah', prixDomicile: 1600, prixRelais: 1400 },
    { code: '54', nom: 'In Guezzam', prixDomicile: 1600, prixRelais: 1400 },
    { code: '55', nom: 'Touggourt', prixDomicile: 950, prixRelais: 750 },
    { code: '56', nom: 'Djanet', prixDomicile: 1600, prixRelais: 1400 },
    { code: '57', nom: 'El M\'Ghair', prixDomicile: 950, prixRelais: 750 },
    { code: '58', nom: 'El Menia', prixDomicile: 950, prixRelais: 750 }
  ]
    ;

  const POINTS_RELAIS = {
    'Adrar': [
      'Adrar - Cité 32 Logements el hay El Gherbi à coté du lycée Khaled Ibn Walid',
      'Timimoun - Rue mohamed El Hashemi'
    ], 
    'Timimoun': [
      'Timimoun - Rue mohamed El Hashemi'],
    'Aïn Defla': [
      'Ain Defla - CITE KHYAT MOHAMMED L\'ARRET DE LA ZONE INDUSTRIELLE EN FACE LA POMPE A ESSENCE',
      'Khemis Meliana - Le côté ouest du quartier La cadette route nationale'
    ],
    'Aïn Témouchent': [
      'Ain temouchent - HAI ZITOUNE EN FACE LE STADE JUSTE A COTE DE NOUVELLE AGENCE',
      'Hammam Bouhdjar - Rue Belhocine Said'
    ],
    'Alger': [
      'Les Vergers - Cité Vergers Villa N°1 Bir Mourad Rais',
      'Cheraga - 37 Lotissement Ben hadadi Said',
      'Alger Centre - 116 Didouche Mourad, Sacré Cœur',
      'Draria - Cité Darbush 145, habitation 400, bâtiment 2',
      'Draria - Oued tarfa',
      'Birtouta - 06 rue Lmoudjahid Hamida Mouhamed à côté de la Supermarquet Saadi',
      'Ain Benian - 19 Route Al-Jamilah, division Kargon',
      'Reghaia - Coopérative immobilière El Anwar locaux 10A et 10B',
      'Zeralda - Local commercial Rez de chausser, Cité Yesswel Kouider N°01',
      'Bordj El Kiffane - Rue 1er Novembre 26 Cité mimouni n 04',
      'Hussein Dey - Rue tripoli El Magharia',
      'Bordj El Bahri - Projet 1000 LSP 47, lot 96, 97 et 98',
      'Cheraga - Micro Zone amara'
    ],
    'Annaba': [
      'Annaba - Boulevard Ernesto Che Guevara',
      'Bouni - Section 1 Groupe 63 Propriété 246 Rez de Chaussé',
      'Sidi brahim - Champs de mars numéro n°3'
    ],
    'Batna': [
      'Batna - Lotissement meddour en face lycée 500 Logements',
      'Barika - Boulevard Azil Abdul Rahman rue les frères Debache route de Batna',
      'Tazoult - Cité frères lombarkia - park a fourage route de tazoult (en face CHU)'
    ],
    'Béchar': [
      'Bechar - Cite Hai El Badr, Lot N°50, Secteur N°49, Local 01'
    ],
    'Béjaïa': [
      'Bejaia - 5 Rue des Frères Taguelmint El Qods en face de la Gare routière',
      'El Kseur - Rue Meziane Hmimi',
      'Akbou - Cité 16 logement EPLF'
    ],
    'Biskra': [
      'Biskra - Zone D\'équipement En Face La Maison Nissan',
      'Tolga - Rue El Amir Abdelkader à côté de la poste d\'Algérie',
      'Ouled Djelal - Rue Gasmi Ibrahim en Face école Mazen School'
    ],
    'Blida': [
      'Blida - La zone industruelle Ben Boulaid (devant Family Shop)',
      'Bab Dzair - 21 centre d\'artisans, rue d\'Alger',
      'Boufarik - 64 Rue Si Ben Youcef',
      'Bouarfa - Rue Principale, N°24'
    ],
    'Bordj Bou Arreridj': [
      'El Djebasse - cite 1er novembre 1954, 90 logements numéro 42',
      'Soualem - Arrondissement 130, Immeubles Qaraouch, BT N° 9, n°81'
    ],
    'Bouira': [
      'Bouira - Lotissement Amar Khoudja B0 (A Gauche Du Nouveau Rond Point D\'Aigle)',
      'Sour El Rozlane - N°03 cité Sayeh, Section 13',
      'Lakhdaria - RUE DE 5 JUILLET'
    ],
    'Boumerdès': [
      'Boumerdes - Coopérative 11 Décembre en face Boulangerie Rahma',
      'Bordj El Menail - RUE BOUIRA BOUALEM, SECTION 02 MAGASIN 02'
    ],
    'Chlef': [
      'Chlef - Rue Mokrani cité EST Propriété Groupe N°171 zone 59 Local N°08 RDC',
      'Ténès - Bt A2 RDC Local 28 Sortie Ouest Route de Mostaganem'
    ],
    'Constantine': [
      'Ali Mendjeli - Zone d\'Activité N°47 Nouvelle Ville',
      'Sidi Mabrouk - Cité Hamada, n470 lot 28',
      'Didouche mourad - El Riadh n°10',
      'Khroub - Cite Bouhali (En Face A Snober Land)',
      'Constantine - 70 Rue Belle Vue/les Combattants (ancienne ville)'
    ],
    'Djelfa': [
      'Djelfa - Cité Boutrivis 2865 Logements Class 116 Parcelle 645 Chemin Route Gare Routière',
      'Ain Ouessara - Cité Mohamed Boudiaf (rue en face la BNA, à coté de douche Rebhi)'
    ],
    'El Bayadh': [
      'Bayadh - Rue Mohamed Touil Centre Ville à coté Auberge Hanna'
    ],
    'El Tarf': [
      'El Taref - Rue N°44 Cité Les Vergers',
      'Ben M\'hidi - Rue Hamadi Ali, Local N°01'
    ],
    'El Oued': [
      'El Oued - Cité El Moudjahidine en pharmacie Daghoum',
      'Djamaa - Cité Essalam (à côté du clinique Douaa)',
      'El M\'Ghair - Lotissement 360 Logements nouvelle zone urbaine'
    ],
    'Guelma': [
      'Guelma - route Ain Larbi, local N°01',
      'Oued Zenati - Boulevard Cité ZEBSSA MAHMOUD N°02'
    ],
    'Ghardaïa': [
      'Ghardaia - Cité Djamel Bouhraoua (en face palais des expositions)',
      'El Guerrara - En Face La Direction Des Impôts (à Côté De La Station Ben Aissa)',
      'Metlili - Cité Emir Abdelkader'
    ],
    'El Menia': [
      'El Menia - Route Unité africaine centre ville'
    ],
    'Illizi': [
      'Illizi - Chemin Ain EL Kours Cité Salam',
      'Djanet - Tin Khatma'
    ],
    'Jijel': [
      'Jijel - Village Mustapha',
      'Taher - Immeuble Des Bailleurs, Section 58, Groupement De Propriete N°111, Quartier Zemouch'
    ],
    'Khenchela': [
      'Khenchela - Cité du 1er Novembre route des poids lourds en face Sonelgaz'
    ],
    'Laghouat': [
      'Laghouat - Cité 176 Logements CNEP, Oasis nord',
      'Aflou - Rue la révolution agricole en face l\'arrêt de bus hassiba'
    ],
    'Mascara': [
      'Mascara - Rue Hamdani Adda rue Khasibiya No. 9, magasin 1 et 2'
    ],
    'Médéa': [
      'Médea - Pole Urbain 80 Logements LSP'
    ],
    'Mila': [
      'Mila - Rue De Zerghia (A Coté Du Point De Vente Iris Et Gam Assurance)',
      'Chelghoum laid - Rue 01 Novembre, A Côté D\'Hôtel El Rhumel'
    ],
    'Mostaganem': [
      'Mostaganem - Salamandre Rond point de la douane',
      'Kharouba - Cité 144 logement'
    ],
    'M\'Sila': [
      'Msila - Salem Shopping Mall, centre commercial (en face la daïra)',
      'Boussaada - Cité 20 Août 636/N°05 A',
      'Barhoum - cité zighoud youcef, el magra'
    ],
    'Naâma': [
      'Naama - Cité Hmidat Belkhir Lot N°112'
    ],
    'Oran': [
      'Bir El Djir - Coopérative Immobilière Dar El Amel N°68',
      'Saint Hubert - Rue St Hubert en face Arrête Tramway Maraval',
      'Arzew - Rue Houari Boumedien',
      'Cité djamel - Rond Poind Cité Djamel en allant vers Hai Sabah',
      'Oran - 41 Hai el Menzeh Canastel en face du stade de foot'
    ],
    'Ouargla': [
      'Ouargla - Cité 13 Logement N°1 zaouia bouhafs',
      'Hassi Messaoud - Derrière la CNAS, à coté de la clinique Ibn Sina',
      'Touggourt - Cite Rimal 01 (A Cote De La Pharmacie Harkati Route Nationale N°03)'
    ],
    'Oum El Bouaghi': [
      'OEB - Cité el moustakbel (entre l\'hôtel sindebed et le siège de la wilaya)',
      'Ain Mlila - Route Messas (à coté superette Amiche)'
    ],
    'Relizane': [
      'Relizane - Boulevard 69 Zaghloul (en face la banque d\'Algérie)',
      'Oued Rhiou - Rue Belhadj Tami (en face du centre de formation paramédical)'
    ],
    'Saïda': [
      'Saida - cité Riadh (à coté de la mosquée Riadh)'
    ],
    'Sétif': [
      'Setif - Cité d\'al-Ma\'bouda, escalier 1 du batiment B section 203 groupe 77 parcelle 5',
      'Bougaa - Rue Mohamed Chinoune',
      'Ain Oulmane - cité 113, immeuble résidentiel 63, bâtiment 1 rez-de-chaussée, entrée 3',
      'Eulma - Lotissement 3 76 Logement Bt A9 Oued Essarek'
    ],
    'Sidi Bel Abbès': [
      'SBA - Rue Mascara, (à cote de l\'hotel Beni Talla)',
      'Benhamouda - monté Sogral avant la mosquée El Safaa'
    ],
    'Skikda': [
      'Skikda - Rue El Reboua El Djamila, partie N°01 rez-de-chaussée',
      'El Harouch - Cité 24 Logements Sociaux Covalent Sonatiba',
      'Azzaba - Enseigne Cité Za\'af Rabeh',
      'Collo - Boulevard Ruwaibah Taher'
    ],
    'Souk Ahras': [
      'Souk Ahras - Cité El Louz Lot 64 (les amandiers)'
    ],
    'Tamanrasset': [
      'Tamanrasset - Hai Gataa El Oued'
    ],
    'In Salah': [
      'Ain Salah - Centre ville (à coté de la poste et la maison de jeune)'
    ],
    'Tébessa': [
      'Tebessa - Boulevard Houari Boumediene (En Face De La Pharmacie Hazourli)',
      'Skanska - Boulevard Chedli Ben Jdid'
    ],
    'Tiaret': [
      'Tiaret - Rue police Amer, n 161',
      'Frenda - Cité Ruisseaux, Section 143, groupe Royale 106'
    ],
    'Tipaza': [
      'Rue du stade - 50+20 logements coopérative (derrière le laboratoire d\'hygiène)',
      'Tipaza - Cité 20+ 50 Logement Cooperative N°17 Local 1'
    ],
    'Tissemsilt': [
      'Tissemsilt - Rue Bouis Ali Num 33 B Section 067 Groupe De Propriete 048'
    ],
    'Tindouf': [
      'Tindouf - Cites Moussani (A Cote De La Radio)'
    ],
    'Tizi Ouzou': [
      'Bekkar - Cité Bekkar classe 78 Propriété Groupe 137 en face Placette',
      'Tizi Ghenif - Rue Fatoum Amar, Rez-De-Chaussee Btm 17, N° 02',
      'Draa ben khada - Touares 01',
      'Azazga - Boulevard Ahmed Zaidat Route Nationale N°12'
    ],
    'Tlemcen': [
      'Tlemcen - Rue Des Freres Bouafia N°3 (A Cote De La Banque Natexis)',
      'Chetouane - Zone indistruelle',
      'Mansourah - Boulevard Imama (en face la piscine olympique)',
      'Maghnia - Tafna N°4 Cité Perri Lala',
      'Hennaya - N°30 Rue la liberté'
    ]
  };

  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [phoneStatus, setPhoneStatus] = useState({
    message: 'Format attendu : 05 50 12 34 56',
    type: 'info'
  });

  const sanitizePhone = (phone) => phone.replace(/\D/g, '').slice(0, 10);

  const formatPhone = (digits) => {
    const parts = digits.match(/.{1,2}/g) || [];
    return parts.join(' ').trim();
  };

  const validatePhone = (phone) => {
    // Format algérien: 0X XX XX XX XX (X = 5, 6, 7)
    const phoneRegex = /^(0)(5|6|7)[0-9]{8}$/;
    return phoneRegex.test(sanitizePhone(phone));
  };

  const getFieldLabel = (el) => el?.dataset?.label || el?.name || 'Ce champ';

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/panier');
    }
    // Si utilisateur connecté, pré-remplir
    if (user) {
      setFormData((d) => ({
        ...d,
        nom: user.nom || '',
        prenom: user.prenom || '',
        telephone: formatPhone(sanitizePhone(user.telephone || ''))
      }));
    }
  }, [user, cart, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'telephone') {
      const digits = sanitizePhone(value);
      const formatted = formatPhone(digits);
      const isValid = validatePhone(digits);

      setFormData({ ...formData, telephone: formatted });

      if (digits.length === 0) {
        setPhoneError('');
        setPhoneStatus({ message: 'Format attendu : 05 50 12 34 56', type: 'info' });
      } else if (!isValid) {
        setPhoneError('Doit commencer par 05, 06 ou 07 et contenir 10 chiffres.');
        setPhoneStatus({ message: 'Exemple valide : 0550 12 34 56', type: 'error' });
      } else {
        setPhoneError('');
        setPhoneStatus({ message: 'Numéro valide ✅', type: 'success' });
      }
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation requise : scrolle/focus sans bulle native
    if (formRef.current && !formRef.current.checkValidity()) {
      const firstInvalid = formRef.current.querySelector(':invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid.focus({ preventScroll: true });
        const label = getFieldLabel(firstInvalid);
        toast.error(`${label} est requis.`);
      }
      return;
    }

    // Valider le téléphone avant soumission
    if (!validatePhone(formData.telephone)) {
      setPhoneError('Numéro de téléphone invalide. Format: 0550123456');
      toast.error('Veuillez vérifier votre numéro de téléphone');
      const phoneInput = formRef.current?.querySelector('input[name="telephone"]');
      if (phoneInput) {
        phoneInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        phoneInput.focus({ preventScroll: true });
      }
      return;
    }

    setLoading(true);

    try {
      const produitsPayload = cart.map(item => ({ produit: item._id, quantite: item.quantity }));

      const adresseLivraisonData = {
        nom: formData.nom,
        prenom: formData.prenom,
        rue: formData.typeLivraison === 'point_relais' ? formData.pointRelais : formData.rue,
        wilaya: formData.wilaya,
        telephone: sanitizePhone(formData.telephone)
      };

      let response;
      if (user) {
        // Commande standard
        response = await api.post('/orders', {
          produits: produitsPayload,
          adresseLivraison: adresseLivraisonData,
          typeLivraison: formData.typeLivraison,
          fraisLivraison: shipping
        });
      } else {
        // Commande invité
        response = await api.post('/orders/guest', {
          produits: produitsPayload,
          clientGuest: {
            nom: formData.nom,
            prenom: formData.prenom,
            email: '',
            telephone: sanitizePhone(formData.telephone)
          },
          adresseLivraison: adresseLivraisonData,
          typeLivraison: formData.typeLivraison,
          fraisLivraison: shipping
        });
      }

      toast.success('Commande passée avec succès !');
      clearCart();
      navigate(`/commande-confirmee/${response.data.commande._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la commande');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getCartTotal();

  // Calculate shipping based on delivery type and wilaya
  const getShippingCost = () => {
    const wilaya = WILAYAS.find(w => w.nom === formData.wilaya);
    if (!wilaya) return 0;

    if (formData.typeLivraison === 'point_relais') {
      return wilaya.prixRelais;
    } else {
      return wilaya.prixDomicile;
    }
  };

  const shipping = getShippingCost();
  const total = subtotal + shipping;

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">{user ? 'Finaliser la commande' : 'Commande invité (sans compte)'}</h1>

        <form ref={formRef} onSubmit={handleSubmit} className="checkout-form" noValidate>
          <div className="checkout-layout">
            <div className="checkout-main">
              {/* Adresse de livraison */}
              <section className="checkout-section">
                <h2>Adresse de livraison</h2>

                {/* Email supprimé pour commande invité */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nom *</label>
                    <input
                      type="text"
                      name="nom"
                      data-label="Le nom"
                      className="form-input"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Prénom *</label>
                    <input
                      type="text"
                      name="prenom"
                      data-label="Le prénom"
                      className="form-input"
                      value={formData.prenom}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Adresse *</label>
                  <input
                    type="text"
                    name="rue"
                    data-label="L'adresse"
                    className="form-input"
                    value={formData.rue}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Wilaya *</label>
                    <select name="wilaya" className="form-input" value={formData.wilaya} onChange={handleChange} required>
                      <option value="">Choisir…</option>
                      {WILAYAS.map((w) => (
                        <option key={w.code} value={w.nom}>{w.nom}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Téléphone *</label>
                    <input
                      type="tel"
                      name="telephone"
                      data-label="Le téléphone"
                      className="form-input"
                      value={formData.telephone}
                      onChange={handleChange}
                      placeholder="Ex: 0550123456"
                      required
                    />
                    <p className={`field-helper ${phoneStatus.type}`}>
                      {phoneError || phoneStatus.message}
                    </p>
                  </div>
                </div>
              </section>

              {/* Mode de livraison */}
              <section className="checkout-section">
                <h2>Type de livraison</h2>
                <div className="payment-options">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="typeLivraison"
                      value="domicile"
                      checked={formData.typeLivraison === 'domicile'}
                      onChange={handleChange}
                    />
                    <span>🏠 À domicile</span>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="typeLivraison"
                      value="point_relais"
                      checked={formData.typeLivraison === 'point_relais'}
                      onChange={handleChange}
                    />
                    <span>🏤 Point relais</span>
                  </label>
                </div>

                {/* Sélection du point relais si ce type est choisi */}
                {formData.typeLivraison === 'point_relais' && formData.wilaya && (
                  <div className="form-group" style={{ marginTop: '20px' }}>
                    <label className="form-label">Choisir un point relais *</label>
                    <select
                      name="pointRelais"
                      data-label="Le point relais"
                      className="form-input"
                      value={formData.pointRelais}
                      onChange={handleChange}
                      required={formData.typeLivraison === 'point_relais'}
                    >
                      <option value="">Sélectionner un point relais...</option>
                      {POINTS_RELAIS[formData.wilaya]?.map((point, index) => (
                        <option key={index} value={point}>{point}</option>
                      ))}
                    </select>
                    {!POINTS_RELAIS[formData.wilaya] && (
                      <p style={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>
                        Aucun point relais disponible dans cette wilaya
                      </p>
                    )}
                  </div>
                )}
              </section>
            </div>

            {/* Résumé de commande */}
            <aside className="checkout-sidebar">
              <div className="order-summary">
                <h2>Résumé de la commande</h2>

                <div className="order-items">
                  {cart.map((item) => {
                    const price = item.prixPromo || item.prix;
                    return (
                      <div key={item._id} className="order-item">
                        <div className="order-item-info">
                          <span className="order-item-name">{item.nom}</span>
                          <span className="order-item-qty">x {item.quantity}</span>
                        </div>
                        <span className="order-item-price">
                          {(price * item.quantity).toFixed(2)} DA
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="order-totals">
                  <div className="order-line">
                    <span>Sous-total:</span>
                    <span>{subtotal.toFixed(2)} DA</span>
                  </div>
                  <div className="order-line">
                    <span>Livraison:</span>
                    <span>{shipping.toFixed(2)} DA</span>
                  </div>
                  <div className="order-line total">
                    <span>Total:</span>
                    <span>{total.toFixed(2)} DA</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-full"
                  disabled={loading}
                >
                  {loading ? 'Traitement...' : user ? 'Confirmer la commande' : 'Commander en tant qu\'invité'}
                </button>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
