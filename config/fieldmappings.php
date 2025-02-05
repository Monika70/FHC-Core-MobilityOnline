<?php
/**
 * config file containing mapping of fieldnames from fhcomplete and mobility online
 * array structure:
 * ['fieldmappings']['mobilityonlineobject']['fhctable'] = array('fhcfieldname' => 'mobilityonlinefieldname')
 */

// mappings used by multiple objects
$personbasemapping =  array(
	'vorname' => 'firstName',
	'nachname' => 'lastName',
);

$bisiomappings = array(
	'von' => 'bew_dat_von',
	'bis' => 'bew_dat_bis',
	'nation_code' => 'lcd_id_gast',
	'herkunftsland_code' => 'lcd_id_heim',
	'mobilitaetsprogramm_code' => 'aust_prog_id'
);

$mailmapping = array('kontakt' => 'email');

$adressemapping = array(
	'strasse' => 'street',
	'plz' => 'postCode',
	'ort' => 'city',
	'gemeinde' => 'additionalAddressInformation',
	//if data is returned as array, type is name of field where value is stored
	'nation' => array('name' => 'country', 'type' => 'description')
);

$filemapping = array(
	'titel' => 'fileName',
	'mimetype' => 'file',
	'erstelltam' => 'createdOn'
);

// person incoming
$config['fieldmappings']['application']['person'] = $personbasemapping;
$config['fieldmappings']['application']['person']['staatsbuergerschaft'] = 'lcd_id_nat';
$config['fieldmappings']['application']['person']['geschlecht'] = 'bew_geschlecht';
$config['fieldmappings']['application']['person']['anrede'] = 'bew_geschlecht';
$config['fieldmappings']['application']['person']['gebdatum'] = 'bew_geb_datum';
$config['fieldmappings']['application']['person']['geburtsnation'] = 'bew_geb_ort';
$config['fieldmappings']['application']['person']['sprache'] = 'spr_id_komm';
$config['fieldmappings']['application']['person']['foto'] = 'file';
$config['fieldmappings']['application']['person']['anmerkung'] = 'bew_txt_gruende';

$config['fieldmappings']['application']['prestudent'] = array(
	'studiengang_kz' => 'studr_id',
	'zgvnation' => 'lcd_id_bereits',
	'zgvdatum' => 'varchar_freifeld1',
	'zgvmas_code' => 'int_freifeld1',
	'zgvmadatum' => 'varchar_freifeld2',
	'zgvmanation' => 'lcd_id_bereits_2'
);

$config['fieldmappings']['application']['prestudentstatus'] = array(
	'studiensemester_kurzbz' => 'sem_id'
);

// photo incoming
$config['fieldmappings']['photo']['lichtbild'] = $filemapping;
$config['fieldmappings']['photo']['lichtbild']['inhalt'] = 'file';

// bisio incoming
$config['fieldmappings']['application']['bisio'] = $bisiomappings;
$config['fieldmappings']['application']['bisio']['universitaet'] = 'inst_id_heim_name';

// address incoming
$config['fieldmappings']['address']['adresse'] = $adressemapping;
$config['fieldmappings']['curraddress']['studienadresse'] = $adressemapping;

$config['fieldmappings']['address']['kontakttel'] = array(
	'kontakt' => 'telNumber'
);

// contact incoming
$config['fieldmappings']['application']['kontaktmail'] = $mailmapping;

$config['fieldmappings']['application']['kontaktnotfall'] = array(
	'kontakt' => 'bew_tel_nr_kontakt'
);

$config['fieldmappings']['application']['studiengang'] = array(
	'typ' => 'stud_niveau_id'
);

// documents incoming/outgoing
$config['fieldmappings']['file']['akte'] = $filemapping;
$config['fieldmappings']['file']['akte']['file_content'] = 'file';
$config['fieldmappings']['file']['akte']['mo_file_id'] = 'fileID';
$config['fieldmappings']['file']['akte']['dokument_kurzbz'] = array('name' => 'uploadSetting', 'type' => 'number');
$config['fieldmappings']['file']['akte']['dokument_bezeichnung'] = array('name' => 'uploadSetting', 'type' => 'number');

// konto incoming for default Buchung
$config['fieldmappings']['application']['konto'] = array(
	'buchungstyp_kurzbz' => 'aust_prog_id',
	'betrag' => 'aust_prog_id',
	'buchungstext' => 'aust_prog_id',
	'studiengang_kz' => 'studr_id'
);

// stati in application cycle, for displaying last status
// in chronological order!!
$config['fieldmappings']['application']['status_info'] = array(
	'beworben' => 'is_mail_best_bew',
	'registriert' => 'is_registriert',
	'bestaetigt' => 'is_mail_best_reg',
	'erfasst' => 'is_pers_daten_erf',
	'abgeschlossen' => 'is_abgeschlossen'
);

$config['fieldmappings']['incomingcourse']['lehrveranstaltung'] = array(
	'mobezeichnung' => 'hostCourseName',
);

$config['fieldmappings']['incomingcourse']['mostudiengang'] = array(
	'bezeichnung' => 'studyFieldDescription'
);

// person outgoing
$config['fieldmappings']['applicationout']['person'] = $personbasemapping;
$config['fieldmappings']['applicationout']['person']['mo_person_id'] = 'p_id';

// prestudent outgoing
$config['fieldmappings']['applicationout']['prestudent'] = array(
	'studiensemester_kurzbz' => 'sem_id',
	'studiengang_kz' => 'studr_id'
);

// bisio outgoing
$config['fieldmappings']['applicationout']['bisio'] = $bisiomappings;
$config['fieldmappings']['applicationout']['bisio']['student_uid'] = 'bew_ber_matr_nr';
$config['fieldmappings']['applicationout']['bisio']['universitaet'] = 'inst_id_gast';
$config['fieldmappings']['applicationout']['bisio']['ects_erworben'] = 'bew_anz_ects2';
$config['fieldmappings']['applicationout']['bisio']['ects_angerechnet'] = 'bew_anz_ects';

$config['fieldmappings']['applicationout']['bisio_zweck'] = array(
	'zweck_code' => 'aust_prog_id'
);

$config['fieldmappings']['applicationout']['bisio_aufenthaltfoerderung'] = array(
	'aufenthaltfoerderung_code' => 'int_freifeld3'
);

// information about bisio which is not saved directly in fhcomplete
$config['fieldmappings']['applicationout']['bisio_info'] = array(
	'ist_praktikum' => 'is_praktikum',
	'ist_masterarbeit' => 'bit_freifeld26',
	'ist_beihilfe' => 'is_beihilfe',
	'ist_double_degree' => 'bit_freifeld24'
);

// mailkontakt outgoing
$config['fieldmappings']['applicationout']['kontaktmail'] = $mailmapping;

// Institution adresse outgoing
$config['fieldmappings']['instaddress']['institution_adresse'] = $adressemapping;

// Bankkonto outgoing
$config['fieldmappings']['bankdetails']['bankverbindung'] = array(
	'iban' => 'iban',
	'name' => 'bankName',
	'bic' => 'swiftCode'
);

// Zahlungen (Konto) outgoing
$config['fieldmappings']['payment']['konto'] = array(
	'betrag' => 'paymentAmount',
	'buchungsdatum' => 'voucherDate'
);

$config['fieldmappings']['payment']['buchungsinfo'] = array(
	/*'mo_zahlung_id' => 'paymentId',*/
	'mo_referenz_nr' => 'referenceNumber',
	'mo_zahlungsgrund' => 'reasonOfPayment',
	'angewiesen' => 'paymentAuthorised'
);

// Mappings for sync from FHC to MO
$config['fieldmappings']['course'] = array(
	'lv_bezeichnung' => 'courseName',
	'studienjahr_kurzbz' => array('name' => 'academicYear', 'type' => 'description'),
	'studiensemester_kurzbz' => 'semester',
	'semester' => 'semesterNr',
	'studiengang_kuerzel' => array('name' => 'studyField', 'type' => 'number'),
	'lehrform_kurzbz' => array('name' => 'courseType', 'type' => 'number', 'default' => 'LV'),
	'locale' => array('name' => 'language', 'type' => 'number'),
	'sws' => 'numberOfLessons',
	'ects' => 'ectsCredits',
	'incoming' => 'freePlaces',
	'typ' => array('name' => 'studyLevels', 'type' => 'number')
);
