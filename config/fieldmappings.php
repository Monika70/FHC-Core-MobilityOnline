<?php
/**
 * config file containing mapping of fieldnames from fhcomplete and mobility online
 * array structure:
 * ['fieldmappings']['mobilityonlineobject']['fhctable'] = array('fhcfieldname' => 'mobilityonlinefieldname')
 */

// mappings reused by objects
$personbasemapping =  array(
	'vorname' => 'firstName',
	'nachname' => 'lastName',
);

$bisiomappings = array(
	'von' => 'bew_dat_von',
	'bis' => 'bew_dat_bis',
	'nation_code' => 'lcd_id_gast',
	'mobilitaetsprogramm_code' => 'aust_prog_id'
);

$mailmapping = array('kontakt' => 'email');

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

$config['fieldmappings']['application']['akte'] = array(
	'inhalt' => 'file'
);

// bisio incoming
$config['fieldmappings']['application']['bisio'] = $bisiomappings;
$config['fieldmappings']['application']['bisio']['universitaet'] = 'inst_id_heim_name';

$adressemapping = array(
	'strasse' => 'street',
	'plz' => 'postCode',
	'ort' => 'city',
	'gemeinde' => 'additionalAddressInformation',
	//if data is returned as array, type is name of field where value is stored
	'nation' => array('name' => 'country', 'type' => 'description')
);

$config['fieldmappings']['address']['adresse'] = $adressemapping;
$config['fieldmappings']['curraddress']['studienadresse'] = $adressemapping;

$config['fieldmappings']['address']['kontakttel'] = array(
	'kontakt' => 'telNumber'
);

$config['fieldmappings']['application']['kontaktmail'] = $mailmapping;

$config['fieldmappings']['application']['kontaktnotfall'] = array(
	'kontakt' => 'bew_tel_nr_kontakt'
);

$config['fieldmappings']['application']['studiengang'] = array(
	'typ' => 'stud_niveau_id'
);

$config['fieldmappings']['application']['konto'] = array(
	'buchungstyp_kurzbz' => 'aust_prog_id',
	'betrag' => 'aust_prog_id',
	'buchungstext' => 'aust_prog_id',
	'studiengang_kz' => 'studr_id'
);

$config['fieldmappings']['incomingcourse']['lehrveranstaltung'] = array(
	'mobezeichnung' => 'hostCourseName',
);

$config['fieldmappings']['incomingcourse']['mostudiengang'] = array(
	'bezeichnung' => 'studyFieldDescription'
);

// person outgoing
$config['fieldmappings']['applicationout']['person'] = $personbasemapping;

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
	'zweck_code' => 'aktivitaet_art_id'
);
$config['fieldmappings']['applicationout']['bisio_aufenthaltfoerderung'] = array(
	'aufenthaltfoerderung_code' => 'int_freifeld3'
);

// mailkontakt outgoing
$config['fieldmappings']['applicationout']['kontaktmail'] = $mailmapping;

// Bankkonto outgoing
$config['fieldmappings']['bankdetails']['bankverbindung'] = array(
	'iban' => 'iban',
	'name' => 'bankName',
	'bic' => 'swiftCode'
);

// Zahlungen (Konto) outgoing
$config['fieldmappings']['payment']['konto']['betrag'] = 'paymentAmount';
$config['fieldmappings']['payment']['buchungsinfo'] = array(
	/*'mo_zahlung_id' => 'paymentId',*/
	'mo_referenz_nr' => 'referenceNumber',
	'mo_zahlungsgrund' => 'reasonOfPayment',
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
