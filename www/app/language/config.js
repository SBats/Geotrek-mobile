'use strict';

function languageConfig($translateProvider, constants) {

	$translateProvider.translations('fr', {

		// Treks list translation
		'treks_list.title': 'Gallerie des randonnées',

		// Detailed trek translations
		'detailed_trek.title' : 'Détails de la randonnée',
		'detailed_trek.trek' : 'Randonnée',
		'detailed_trek.infos' : 'Infos pratiques',
		'detailed_trek.linked' : 'Parcours liés',
		'detailed_trek.poi' : 'Points d\'intêret',
		'detailed_trek.transport' : 'Transports',
		'detailed_trek.road_access' : 'Accès routiers',
		'detailed_trek.website' : 'Site web'
	});

	$translateProvider.translations('en', {

		// Treks list translation
		'treks_list.title': 'Treks gallery',

		// Detailed trek translations
		'detailed_trek.title' : 'Trek details',
		'detailed_trek.trek' : 'Trek',
		'detailed_trek.infos' : 'Convenient infos',
		'detailed_trek.linked' : 'Linked treks',
		'detailed_trek.poi' : 'Points of interest',
		'detailed_trek.transport' : 'Transport network',
		'detailed_trek.road_access' : 'Road access',
		'detailed_trek.website' : 'Website'
	});
	$translateProvider.preferredLanguage(constants.DEFAULT_LANGUAGE);
}

module.exports = {
	languageConfig: languageConfig
};