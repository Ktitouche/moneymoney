const SHIPPING_RATES_BY_WILAYA = {
    'Adrar': { domicile: 1050, point_relais: 850 },
    'Chlef': { domicile: 900, point_relais: 650 },
    'Laghouat': { domicile: 950, point_relais: 750 },
    'Oum El Bouaghi': { domicile: 900, point_relais: 650 },
    'Batna': { domicile: 900, point_relais: 650 },
    'Béjaïa': { domicile: 900, point_relais: 650 },
    'Biskra': { domicile: 950, point_relais: 750 },
    'Béchar': { domicile: 1050, point_relais: 850 },
    'Blida': { domicile: 700, point_relais: 550 },
    'Bouira': { domicile: 900, point_relais: 650 },
    'Tamanrasset': { domicile: 1600, point_relais: 1400 },
    'Tébessa': { domicile: 950, point_relais: 750 },
    'Tlemcen': { domicile: 900, point_relais: 650 },
    'Tiaret': { domicile: 900, point_relais: 650 },
    'Tizi Ouzou': { domicile: 900, point_relais: 650 },
    'Alger': { domicile: 590, point_relais: 450 },
    'Djelfa': { domicile: 950, point_relais: 750 },
    'Jijel': { domicile: 900, point_relais: 650 },
    'Sétif': { domicile: 900, point_relais: 650 },
    'Saïda': { domicile: 900, point_relais: 650 },
    'Skikda': { domicile: 900, point_relais: 650 },
    'Sidi Bel Abbès': { domicile: 900, point_relais: 650 },
    'Annaba': { domicile: 900, point_relais: 650 },
    'Guelma': { domicile: 900, point_relais: 650 },
    'Constantine': { domicile: 900, point_relais: 650 },
    'Médéa': { domicile: 900, point_relais: 650 },
    'Mostaganem': { domicile: 900, point_relais: 650 },
    'M\'Sila': { domicile: 900, point_relais: 650 },
    'Mascara': { domicile: 900, point_relais: 650 },
    'Ouargla': { domicile: 950, point_relais: 750 },
    'Oran': { domicile: 900, point_relais: 650 },
    'El Bayadh': { domicile: 1050, point_relais: 850 },
    'Illizi': { domicile: 1600, point_relais: 1400 },
    'Bordj Bou Arreridj': { domicile: 900, point_relais: 650 },
    'Boumerdès': { domicile: 700, point_relais: 550 },
    'El Tarf': { domicile: 900, point_relais: 650 },
    'Tindouf': { domicile: 1600, point_relais: 1400 },
    'Tissemsilt': { domicile: 900, point_relais: 650 },
    'El Oued': { domicile: 950, point_relais: 750 },
    'Khenchela': { domicile: 900, point_relais: 650 },
    'Souk Ahras': { domicile: 900, point_relais: 650 },
    'Tipaza': { domicile: 700, point_relais: 550 },
    'Mila': { domicile: 900, point_relais: 650 },
    'Aïn Defla': { domicile: 900, point_relais: 650 },
    'Naâma': { domicile: 1050, point_relais: 850 },
    'Aïn Témouchent': { domicile: 900, point_relais: 650 },
    'Ghardaïa': { domicile: 950, point_relais: 750 },
    'Relizane': { domicile: 900, point_relais: 650 },
    'Timimoun': { domicile: 1050, point_relais: 850 },
    'Bordj Badji Mokhtar': { domicile: 1050, point_relais: 850 },
    'Ouled Djellal': { domicile: 950, point_relais: 750 },
    'Béni Abbès': { domicile: 1050, point_relais: 850 },
    'In Salah': { domicile: 1600, point_relais: 1400 },
    'In Guezzam': { domicile: 1600, point_relais: 1400 },
    'Touggourt': { domicile: 950, point_relais: 750 },
    'Djanet': { domicile: 1600, point_relais: 1400 },
    'El M\'Ghair': { domicile: 950, point_relais: 750 },
    'El Menia': { domicile: 950, point_relais: 750 }
};

const getShippingFee = (wilaya, typeLivraison = 'domicile') => {
    const rate = SHIPPING_RATES_BY_WILAYA[String(wilaya || '').trim()];
    if (!rate) return 0;
    if (typeLivraison === 'point_relais') return rate.point_relais;
    return rate.domicile;
};

module.exports = {
    getShippingFee
};
