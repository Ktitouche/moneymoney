const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
    {
        heroText: {
            type: String,
            trim: true,
            default: 'Decouvrez nos produits de qualite a prix imbattables',
            maxlength: 500,
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
