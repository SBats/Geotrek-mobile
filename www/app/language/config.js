'use strict';

function languageConfig($translateProvider, constants) {

	$translateProvider.translations('fr', {

		// Generic translations
		'Yes' : 'Oui',
		'No' : 'Non',

		// Layout translations
		'layout.disconnected' : 'Vous êtes actuellement hors-connexion. Les fonds de cartes et les images des randonnées non téléchargées ne pourront pas être affichés.',
		'layout.treks' : 'Randonnées',
		'layout.map' : 'Carte',
		'layout.favorites' : 'Mes randos',
		'layout.flat_pages' : 'Pages statiques',
		'layout.settings' : 'Paramètres',

		// Init translations
		'init.loading_translations' : 'Chargement des traductions',
		'init.loading_treks' : 'Chargement des randonnées',
		'init.loading_tiles' : 'Chargement des fonds de carte',
		'init.updating_treks' : 'Mise à jour des randonnées téléchargées',
		'init.done' : 'Fini, redirection en cours',

		// Treks list translation
		'treks_list.title': 'Gallerie des randonnées',
		'treks_list.filter': 'Filtrer',
		'treks_list.delete' : 'Supprimer',
		'treks_list.confirm_delete' : 'Etes vous sur de vouloir supprimer cette randonnée ?',
		'treks_list.deleting' : 'Suppression en cours',
		'treks_list.trek_deleted' : 'Randonnée supprimée',

		// Map translation
		'map.filter' : 'Filtrer',

		// Trek preview
		'trek_preview.title' : 'Prévisualisation de la randonnée',
		'trek_preview.info' : 'Pour avoir accès au reste des informations du trek ainsi qu\'à sa carte détaillé, il est nécessaire de le télécharger.',
		'trek_preview.download' : 'Télécharger',
		'trek_preview.downloading' : 'Téléchargement',
		'trek_preview.confirm_download' : 'Etes vous sur de vouloir télécharger cette randonnée ?',
		'trek_preview.downloaded' : 'Randonnée téléchargée',

		// Downloaded treks translation
		'favorites.title' : 'Mes randos',
		'favorites.results' : 'résultats',

		// Detailed trek translations
		'detailed_trek.title' : 'Détails de la randonnée',
		'detailed_trek.trek' : 'Randonnée',
		'detailed_trek.infos' : 'Infos pratiques',
		'detailed_trek.linked' : 'Parcours liés',
		'detailed_trek.poi' : 'Points d\'intêret',
		'detailed_trek.transport' : 'Transports',
		'detailed_trek.road_access' : 'Accès routiers',
		'detailed_trek.website' : 'Site web',
		'detailed_trek.parent' : 'Randonnée parente',
		'detailed_trek.children' : 'Randonnées enfantes',
		'detailed_trek.previous' : 'Randonnée précédente',
		'detailed_trek.next' : 'Randonnée suivante',

		// User settings translations
		'user_settings.title' : 'Paramètres',
		'user_settings.language' : 'Langues',
		'user_settings.interface_language' : 'Langue de l\'interface',
		'user_settings.treks_language' : 'Langue des treks',
		'user_settings.network' : 'Réseau',
		'user_settings.connection' : 'Connexion internet',
		'user_settings.sync_mode' : 'Mode de synchronisation',
		'user_settings.map' : 'Carte',
		'user_settings.alerts' : 'Alertes PdI (GPS Uniquement)',
		'user_settings.data' : 'Données',
		'user_settings.clean_data' : 'Nettoyer les données téléchargées',
		'user_settings.delete' : 'Supprimer',
		'user_settings.leave' : 'Quitter',
		'user_settings.leave_app' : 'Quitter l\'application',
		'user_settings.lang_changed' : 'Langue changée',
		'user_settings.change_lang' : 'Changement de langue',
		'user_settings.confirm_change_lang_interface' : 'Etes vous sur de vouloir changer la langue de l\'interface ?',
		'user_settings.confirm_change_lang_data' : 'Etes vous sur de vouloir changer la langue des données ?',
		'user_settings.delete_data' : 'Supprimer les données',
		'user_settings.confirm_delete_data' : 'Etes vous sur de vouloir supprimer les données téléchargées ?',
		'user_settings.deleting' : 'Supression',
		'user_settings.deleting_data' : 'Suppression en cours',
		'user_settings.data_deleted' : 'Données supprimées'
	});

	$translateProvider.translations('en', {

		// Generic translations
		'Yes' : 'Yes',
		'No' : 'No',

		// Layout translations
		'layout.disconnected' : 'Vous êtes actuellement hors-connexion. Les fonds de cartes et les images des randonnées non téléchargées ne pourront pas être affichés.',
		'layout.treks' : 'Treks',
		'layout.map' : 'Map',
		'layout.favorites' : 'My treks',
		'layout.flat_pages' : 'Flat pages',
		'layout.settings' : 'Settings',

		// Init translations
		'init.loading_translations' : 'Loading translations',
		'init.loading_treks' : 'Loading treks',
		'init.loading_tiles' : 'Loading tiles',
		'init.updating_treks' : 'Updating downloaded treks',
		'init.done' : 'Done, redirecting',

		// Treks list translation
		'treks_list.title' : 'Treks gallery',
		'treks_list.filter' : 'Filter',
		'treks_list.delete' : 'Delete',
		'treks_list.confirm_delete' : 'Are you sure you want to delete this trek ?',
		'treks_list.deleting' : 'Deleting',
		'treks_list.trek_deleted' : 'Trek deleted',

		// Map translation
		'map.filter' : 'Filter',

		// Trek preview
		'trek_preview.title' : 'Trek preview',
		'trek_preview.info' : 'To access the detailed data and the trek\'s map, you need to download it.',
		'trek_preview.download' : 'Download',
		'trek_preview.downloading' : 'Downloading',
		'trek_preview.confirm_download' : 'Are you sure you want to download this trek ?',
		'trek_preview.downloaded' : 'Trek downloaded',

		// Downloaded treks translation
		'favorites.title' : 'My treks',
		'favorites.results' : 'results',

		// Detailed trek translations
		'detailed_trek.title' : 'Trek details',
		'detailed_trek.trek' : 'Trek',
		'detailed_trek.infos' : 'Convenient infos',
		'detailed_trek.linked' : 'Linked treks',
		'detailed_trek.poi' : 'Points of interest',
		'detailed_trek.transport' : 'Transport network',
		'detailed_trek.road_access' : 'Road access',
		'detailed_trek.website' : 'Website',
		'detailed_trek.parent' : 'Parent trek',
		'detailed_trek.children' : 'Children trek',
		'detailed_trek.previous' : 'Previous trek',
		'detailed_trek.next' : 'Next trek',

		// User settings translations
		'user_settings.title' : 'Settings',
		'user_settings.language' : 'Language',
		'user_settings.interface_language' : 'Interface language',
		'user_settings.treks_language' : 'Treks language',
		'user_settings.network' : 'Network',
		'user_settings.connection' : 'Internet connection',
		'user_settings.sync_mode' : 'Synchronization mode',
		'user_settings.map' : 'Map',
		'user_settings.alerts' : 'PoI alerts (GPS Only)',
		'user_settings.data' : 'Data',
		'user_settings.clean_data' : 'Clean the downloaded data',
		'user_settings.delete' : 'Delete',
		'user_settings.leave' : 'Leave',
		'user_settings.leave_app' : 'Leave application',
		'user_settings.lang_changed' : 'Language changed',
		'user_settings.change_lang' : 'Change language',
		'user_settings.confirm_change_lang_interface' : 'Are you sure you want to change the interface language ?',
		'user_settings.confirm_change_lang_data' : 'Are you sure you want to change the datas language ?',
		'user_settings.delete_data' : 'Delete datas',
		'user_settings.confirm_delete_data' : 'Are you sure you want to delete the datas ?',
		'user_settings.deleting' : 'Deleting',
		'user_settings.deleting_data' : 'Deleting datas',
		'user_settings.data_deleted' : 'Datas deleted'
	});
	$translateProvider.preferredLanguage(constants.DEFAULT_LANGUAGE);
}

module.exports = {
	languageConfig: languageConfig
};