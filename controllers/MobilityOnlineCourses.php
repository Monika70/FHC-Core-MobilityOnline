<?php
if (! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Manages Lehrveranstaltung synchronisation between fhcomplete and Mobility Online
 */
class MobilityOnlineCourses extends Auth_Controller
{
	/**
	 * Constructor
	 */
	public function __construct()
	{
		parent::__construct(
			array(
			'index' => 'inout/incoming:rw',
			'syncLvs' => 'inout/incoming:rw',
			'deleteLvs' => 'admin:rw',
			'getLvsJson' => 'inout/incoming:rw'
			)
		);

		$this->load->model('organisation/Studiensemester_model', 'StudiensemesterModel');
		$this->load->model('education/lehrveranstaltung_model', 'LehrveranstaltungModel');
		$this->load->library('extensions/FHC-Core-MobilityOnline/MobilityOnlineSyncLib');
		$this->load->library('extensions/FHC-Core-MobilityOnline/tomobilityonline/SyncToMobilityOnlineLib');
		$this->load->library('extensions/FHC-Core-MobilityOnline/tomobilityonline/SyncCoursesToMoLib');
	}

	/**
	 * Index Controller
	 * @return void
	 */
	public function index()
	{
		$this->load->library('WidgetLib');

		$this->StudiensemesterModel->addOrder('start', 'DESC');
		$studiensemesterdata = $this->StudiensemesterModel->load();

		if (isError($studiensemesterdata))
			show_error($studiensemesterdata->retval);

		$currsemdata = $this->StudiensemesterModel->getLastOrAktSemester(0);

		if (isError($currsemdata))
			show_error($currsemdata->retval);

		$lvdata = $this->LehrveranstaltungModel->getLvsWithIncomingPlaces($currsemdata->retval[0]->studiensemester_kurzbz);

		if (isError($lvdata))
			show_error($lvdata->retval);

		$this->load->view(
			'extensions/FHC-Core-MobilityOnline/mobilityOnlineCourses',
			array(
				'semester' => $studiensemesterdata->retval,
				'currsemester' => $currsemdata->retval,
				'lvs' => $lvdata->retval
			)
		);
	}

	/**
	 * Syncs Lehrveranstaltungen to MobilityOnline, i.e. adds Lvs from fhcomplete to Mobility Online
	 * and removes Lvs not present in fhcomplete anymore
	 */
	public function syncLvs()
	{
		$studiensemester = $this->input->post('studiensemester');

		$results = $this->synccoursestomolib->startCoursesSync($studiensemester);

		$this->outputJsonSuccess($results);
	}

	/**
	 * Deletes Lehrveranstaltungen of a given Semester From MobilityOnline
	 * @param $studiensemester
	 */
	public function deleteLvs($studiensemester)
	{
		$this->synccoursestomolib->startCoursesDeletion($studiensemester);
	}

	/**
	 * Gets Lehrveranstaltungen which need to be synced to MobilityOnline and outputs as Json
	 */
	public function getLvsJson()
	{
		$studiensemester = $this->input->get('studiensemester');

		$lvdata = $this->LehrveranstaltungModel->getLvsWithIncomingPlaces($studiensemester);

		if (isSuccess($lvdata))
			$this->outputJsonSuccess($lvdata->retval);
		else
			$this->outputJsonError("Error when getting courses");
	}
}
