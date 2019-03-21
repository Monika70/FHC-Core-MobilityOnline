/**
 * javascript file for Mobility Online incoming courses sync and Lehreinheitassignment
 */
$(document).ready(function()
	{
		MobilityOnlineIncomingCourses.getIncomingCourses($("#studiensemester").val());

		// change displayed courses when Studiensemester selected
		$("#studiensemester").change(
			function()
			{
				var studiensemester = $(this).val();
				$("#syncoutput").text('-');
				MobilityOnlineIncomingCourses.getIncomingCourses(studiensemester);
			}
		);

		// make right MO courses box follow on scroll
		var mocourseswell = $("#mocourseswell"), originalY = mocourseswell.offset().top;

		var topMargin = 0;

		mocourseswell.css('position', 'relative');

		$(window).on('scroll', function(event) {
			var scrollTop = $(window).scrollTop();

			mocourseswell.stop(false, false).animate({
				top: scrollTop < originalY
					? 0
					: scrollTop - originalY + topMargin
			}, 100);
		});

	}
);

var MobilityOnlineIncomingCourses = {
	incomingCourses: null,// object for storing array with incomings and their courses
	/**
	 * Gets incomings from MobilityOnline and fhcomplete together with
	 * their courses assigned in MobilityOnline
	 * @param studiensemester
	 */
	getIncomingCourses: function(studiensemester)
	{
		FHC_AjaxClient.ajaxCallGet(
			FHC_JS_DATA_STORAGE_OBJECT.called_path+'/getIncomingCoursesJson',
			{"studiensemester": studiensemester},
			{
				successCallback: function(data, textStatus, jqXHR)
				{
					if (FHC_AjaxClient.hasData(data))
					{
						$("#incomingprestudents").empty();
						var incomingcourses = data.retval;
						MobilityOnlineIncomingCourses.incomingCourses = incomingcourses;
						MobilityOnlineIncomingCourses._printIncomingPrestudents(incomingcourses);
					}
					else
					{
						$("#fhcles").text("-");
						$("#incomingprestudents").html("<tr align='center'><td colspan='5'>No incomings with courses found!</td></tr>");
					}
				}
			}
		);
	},
	/**
	 * Updates Lehreinheitassignments, i.e. adds or deletes direct assignments to a lehreinheit
	 * @param lehreinheitassignments array, each entry contains uid, lehreinheit_id and bool indicating if directly assigned
	 */
	updateLehreinheitAssignment: function(lehreinheitassignments)
	{
		FHC_AjaxClient.ajaxCallPost(
			FHC_JS_DATA_STORAGE_OBJECT.called_path+'/updateLehreinheitAssignment',
			{"lehreinheitassignments": lehreinheitassignments},
			{
				successCallback: function (data, textStatus, jqXHR)
				{
					var messageel = $("#message");
					if (FHC_AjaxClient.isSuccess(data))
					{
						messageel.removeClass("text-danger");
						messageel.addClass("text-success");

						var checkboxes = $("#allfhcles .checkbox");
						var ledata = [];

						checkboxes.each(
							function()
							{
								var idstr = $(this).find(".lehreinheitinput").prop("id");
								var lehreinheit_id = idstr.substr(idstr.indexOf("_") + 1);
								var lehrveranstaltung_id = $(this).find(".lehrveranstaltunginput").val();
								var le = {};
								le[lehrveranstaltung_id] = lehreinheit_id;
								ledata.push(le);
							}
						);

						MobilityOnlineIncomingCourses.refreshCourseAssignments(ledata, lehreinheitassignments[0].uid)
					}
					else
					{
						messageel.removeClass("text-success");
						messageel.addClass("text-danger");
					}

					messageel.html(data.retval);

				}
			}
		)
	},
	/**
	 * Gets course assignments for a user, refreshes directlyAssigned fields in global assignments object
	 * Updates numbers in html views accordingly
	 * @param ledata array, contains lehreinheited for which data has to refreshed,
	 * each entry has form lvid:lehreinheitid
	 * @param uid user for which lehreinheitassignments should be refreshed
	 */
	refreshCourseAssignments: function(ledata, uid)
	{
		FHC_AjaxClient.ajaxCallPost(
			FHC_JS_DATA_STORAGE_OBJECT.called_path+'/getCourseAssignments',
			{
				"uid": uid,
				"ledata": ledata
			},
			{
				successCallback: function (data, textStatus, jqXHR)
				{
					if (FHC_AjaxClient.hasData(data))
					{
						for (var prestudent in MobilityOnlineIncomingCourses.incomingCourses)
						{
							var prestudentobj = MobilityOnlineIncomingCourses.incomingCourses[prestudent];
							if (prestudentobj.uid === uid)
							{
								for (var lvid in data.retval)
								{
									var leids = data.retval[lvid];
									MobilityOnlineIncomingCourses._setDirectlyAssigned(prestudentobj.lvs, lvid, leids);
									MobilityOnlineIncomingCourses._setDirectlyAssigned(prestudentobj.nonMoLvs, lvid, leids);
								}
								MobilityOnlineIncomingCourses._printMoCourses(prestudentobj);
								MobilityOnlineIncomingCourses._printFhcCourses(prestudentobj);
								break;
							}
						}
						MobilityOnlineIncomingCourses._printIncomingPrestudents(MobilityOnlineIncomingCourses.incomingCourses);
					}
				}
			}
		)

	},
	/**
	 * Prints initial prestudent table with list of synced prestudents
	 * @param incomingscourses
	 * @private
	 */
	_printIncomingPrestudents: function(incomingscourses)
	{
		$("#incomingprestudents").empty();

		var totalAssigned = 0, totalLvsInFhc = 0;

		for (var person in incomingscourses)
		{
			var prestudentobj = incomingscourses[person];
			var tablerowstring = "";

			tablerowstring += "<tr>" +
				"<td class='text-center'>" +
				"<button class='btn btn-default btn-sm' id='lezuw_"+prestudentobj.prestudent_id+"'>" +
				"<i class='fa fa-edit'></i>" +
				"</button>" +
				"</td>";
			tablerowstring += "<td>"+prestudentobj.nachname+", "+prestudentobj.vorname+"</td>" +
				"<td>"+prestudentobj.email+"</td>";

			var assignedCount = 0, notInMo = 0;
			var lvsInFhc = prestudentobj.lvs.length;

			for (var lv in prestudentobj.lvs)
			{
				var lvobj = prestudentobj.lvs[lv];

				for (var le in lvobj.lehreinheiten)
				{
					if (lvobj.lehreinheiten[le].directlyAssigned === true)
					{
						assignedCount++;
						break;
					}
				}
			}

			for (var nomolv in prestudentobj.nonMoLvs)
			{
				var nomolvobj = prestudentobj.nonMoLvs[nomolv];

				for (var le in nomolvobj.lehreinheiten)
				{
					if (nomolvobj.lehreinheiten[le].directlyAssigned === true)
					{
						notInMo++;
						break;
					}
				}
			}

			totalAssigned += assignedCount;
			totalLvsInFhc += lvsInFhc;

			tablerowstring += "<td class='text-center'>" +
				"<span>"+assignedCount+"/" +
				+lvsInFhc+"</span>";

			if (assignedCount < lvsInFhc)
			{
				tablerowstring += "&nbsp;<i class ='fa fa-times text-danger'></i>";
			}
			else
			{
				tablerowstring += "&nbsp;<i class ='fa fa-check text-success'></i>";
			}

			if (notInMo > 0)
				tablerowstring += "<br /><span class='text-danger'>"+notInMo+" not in MobilityOnline</span>";

			tablerowstring += "</td>";

			tablerowstring += "</tr>";

			$("#incomingprestudents").append(tablerowstring);

			$("#lezuw_"+prestudentobj.prestudent_id).click(
				prestudentobj,
				MobilityOnlineIncomingCourses._printLvs
			)
		}
		$("#totalCoursesAssigned").text(totalAssigned);
		$("#totalCoursesFhc").text(totalLvsInFhc);

		var headers = {headers: { 0: { sorter: false, filter: false}}};
		Tablesort.addTablesorter("incomingprestudentstbl", [[1, 0], [2, 0]], ["filter"], 2, headers);
	},
	/**
	 * Prints courses from in Mobility Online and courses in fhcomplete
	 * @param prestudentobj prestudent whose courses are displayed
	 * @private
	 */
	_printLvs: function(prestudentobj)
	{
		MobilityOnlineIncomingCourses._printMoCourses(prestudentobj.data);
		MobilityOnlineIncomingCourses._printFhcCourses(prestudentobj.data);
		MobilityOnlineIncomingCourses._toggleIncomingCoursesView();
	},
	_printMoCourses: function(moapplication)
	{
		var totalAssigned = 0;

		var prestudentdatahtml = "<tr><td class='prestudentfieldname'>First name</td><td>"+moapplication.vorname+"</td>" +
			"<td class='prestudentfieldname'>Last name</td><td class='prestudentfieldvalue'>"+moapplication.nachname+"</td></tr>" +
			"<tr><td class='prestudentfieldname'>E-Mail</td><td class='prestudentfieldvalue'>"+moapplication.email+"</td>" +
			"<td class='prestudentfieldname'>Phone number</td><td class='prestudentfieldvalue'>"+moapplication.phonenumber+"</td></tr>" +
			"<tr><td class='prestudentfieldname'>Study field</td><td class='prestudentfieldvalue'>"+moapplication.studiengang+"</td>" +
			"<td class='prestudentfieldname'>Stay</td><td class='prestudentfieldvalue'>"+MobilityOnlineIncomingCourses._formatDateGerman(moapplication.stayfrom) +
			" - " + MobilityOnlineIncomingCourses._formatDateGerman(moapplication.stayto) +
			"</td>" +
			"</tr>";

		$("#lvsprestudentdata").html(prestudentdatahtml);

		$("#molvs").empty();
		$("#molvstbl").trigger("destroy");

		for (var lv in moapplication.lvs)
		{
			var assignedCount = 0;
			var status = "";
			var lvobj = moapplication.lvs[lv];

			for (var le in lvobj.lehreinheiten)
			{
				if (lvobj.lehreinheiten[le].directlyAssigned === true)
					assignedCount++;
			}

			var tablerowstring = "<tr><td>"+lvobj.lehrveranstaltung.mobezeichnung+"</td>";

			var textclass = 'fa fa-check text-success';

			if (assignedCount <= 0)
				textclass = 'fa fa-times text-danger';

			if ($.isNumeric(lvobj.lehrveranstaltung.lehrveranstaltung_id))
				status = "<i class='"+textclass+"' id='courselestatus_"+lvobj.lehrveranstaltung.lehrveranstaltung_id+"'></i>" +
					" <span id='courseleamount_"+lvobj.lehrveranstaltung.lehrveranstaltung_id+"'>"+assignedCount+" unit"+(assignedCount === 1 ? "" : "s")+"</span>" +
					" assigned";
			else
			{
				status = "<i class='fa fa-times text-danger' id='courselestatus_"+lvobj.lehrveranstaltung.lehrveranstaltung_id+"'></i> not in FHC";
			}

			tablerowstring += "<td>"+ status +"</td>";
			tablerowstring += "</tr>";

			$("#molvs").append(tablerowstring);

			totalAssigned += assignedCount;
		}

		Tablesort.addTablesorter("molvstbl", [[0, 0], [1, 0]], ["filter"], 2);
	},
	_printFhcCourses: function(fhcprestudent)
	{
		var fhclvhtml = "";
		var numLvs = 0;
		var hasLes = false;

		fhclvhtml += "<div id='fhcles'>";

		for (var fhclv in fhcprestudent.lvs)
		{
			var fhclvobj = fhcprestudent.lvs[fhclv];
			if ($.isNumeric(fhclvobj.lehrveranstaltung.lehrveranstaltung_id))
			{
				numLvs++;
				fhclvhtml += MobilityOnlineIncomingCourses._getLehrveranstaltungHtml(fhclvobj);
				if (fhclvobj.lehreinheiten.length > 0)
					hasLes = true;
			}
		}
		fhclvhtml += "</div>";

		fhclvhtml += "<div id='fhconlyles'>";
		// Lvs which are not in Mobility Online, but in FH-Complete
		// (e.g. when course assignment gets deleted in MobilityOnline)
		if (fhcprestudent.nonMoLvs.length > 0)
		{
			fhclvhtml += "<hr><strong>In FH-Complete, but not in MobilityOnline:</strong><br /><br />";

			for (var nomolv in fhcprestudent.nonMoLvs)
			{
				var nonmolvobj = fhcprestudent.nonMoLvs[nomolv];
				if ($.isNumeric(nonmolvobj.lehrveranstaltung.lehrveranstaltung_id))
				{
					numLvs++;
					fhclvhtml += MobilityOnlineIncomingCourses._getLehrveranstaltungHtml(nonmolvobj);
					if (nonmolvobj.lehreinheiten.length > 0)
						hasLes = true;
				}
			}
		}
		fhclvhtml += "</div>";

		fhclvhtml += "<hr>";

		fhclvhtml += "<div class='row'>";
		fhclvhtml += "<div class='col-xs-6 text-left'>" +
			"<button class='btn btn-default' id='backtoincomings'>" +
			"<i class='fa fa-arrow-left'></i> Back to all incomings"+
			"</button>"+
			"</div>";

		if (numLvs > 0 && hasLes)
			fhclvhtml += "<div class='col-xs-6 text-right'>" +
				"<button class='btn btn-default' id='save'>" +
				"<i class='glyphicon glyphicon-floppy-disk'></i> Save"+
				"</button>"+
				"</div>";

		fhclvhtml += "</div>";

		$("#allfhcles").html(fhclvhtml);

		$("#backtoincomings").click(
				MobilityOnlineIncomingCourses._toggleIncomingCoursesView
		);

		$("#save").off("click");

		$("#save").click(
			function()
			{
				var uid = fhcprestudent.uid;
				var lehreinheitassignments = [];
				$(".lehreinheitinput").each(
					function()
					{
						var idstr = $(this).prop("id");
						var lehreinheit_id = idstr.substr(idstr.indexOf("_") + 1);
						lehreinheitassignments.push(
							{
								"uid": uid,
								"lehreinheit_id": lehreinheit_id,
								"assigned": $(this).prop("checked")
							}
						);
					}
				);

				MobilityOnlineIncomingCourses.updateLehreinheitAssignment(lehreinheitassignments);
			}
		);
	},
	_getLehrveranstaltungHtml: function(lehrveranstaltungobj)
	{
		var fhclvhtml = "<div class='panel panel-default'>";
		fhclvhtml += "<div class='panel-heading fhclvpanelheading'>";
		fhclvhtml += "" + lehrveranstaltungobj.lehrveranstaltung.fhcbezeichnung + "";
		fhclvhtml += "</div><div class='panel-body fhclvpanel'>";

		for (var le in lehrveranstaltungobj.lehreinheiten)
		{
			var lehreinheitobj = lehrveranstaltungobj.lehreinheiten[le];
			fhclvhtml += MobilityOnlineIncomingCourses._getLehreinheitHtml(lehrveranstaltungobj, lehreinheitobj);
		}
		fhclvhtml += "</div></div>";

		return fhclvhtml;
	},
	_getLehreinheitHtml: function(lehrveranstaltungobj, lehreinheitobj)
	{
		var fhcleshtml = '';
		var checked = lehreinheitobj.directlyAssigned === true ? "checked": '';
		fhcleshtml += "<div class='checkbox'><input type='checkbox' class='lehreinheitinput' id='lecheckbox_"+lehreinheitobj.lehreinheit_id+"' "+checked+">";
		fhcleshtml += "<input type='hidden' class='lehrveranstaltunginput' value="+lehrveranstaltungobj.lehrveranstaltung.lehrveranstaltung_id+">";
		fhcleshtml += lehreinheitobj.lehrform_kurzbz + " " + lehrveranstaltungobj.studiengang.kuerzel;

		for (var legr in lehreinheitobj.lehreinheitgruppen)
		{
			var legrobj = lehreinheitobj.lehreinheitgruppen[legr];
			if (legrobj.direktinskription === true)
				continue;

			if (legrobj.gruppe_kurzbz != null && typeof legrobj.gruppe_kurzbz == "string"
				&& legrobj.gruppe_kurzbz.length > 0)
			{
				fhcleshtml += " "+legrobj.gruppe_kurzbz;
			}
			else
			{
				fhcleshtml += " "+(legrobj.semester == null ? "" : legrobj.semester);
				fhcleshtml += (legrobj.verband == null ? "" : legrobj.verband);
				fhcleshtml += (legrobj.gruppe == null ? "" : legrobj.gruppe);
			}
		}

		for (var lektor in lehreinheitobj.lektoren)
		{
			var lektoruid = lehreinheitobj.lektoren[lektor];
			fhcleshtml += " "+(lektoruid == null ? '' : lektoruid);
		}

		fhcleshtml += " <span class='nowrap'>("+lehreinheitobj.anz_teilnehmer+ " participants)</span>";

		fhcleshtml += "</div>";

		return fhcleshtml;
	},
	/**
	 * Shows hidden html views, hides non-hidden
	 * @private
	 */
	_toggleIncomingCoursesView: function()
	{
		$("#message").empty();

		var toToggle = [
			$("#studiensemesterinput"),
			$("#incomingprestudentsrow"),
			$("#coursesassignment"),
			$("#lvsprestudent")
		];

		for (var element in toToggle)
		{
			var el = toToggle[element];

			if (el.hasClass("hidden"))
				el.removeClass("hidden");
			else
				el.addClass("hidden");
		}
	},
	/**
	 * Marks certain Lehreinheiten from a certain lv in a given Lv array
	 * as directlyAssigned
	 * @param lvs
	 * @param lvid
	 * @param leids
	 * @private
	 */
	_setDirectlyAssigned: function(lvs, lvid, leids)
	{
		for (var lv in lvs)
		{
			var lvobj = lvs[lv];
			var found = false;
			if ($.isNumeric(lvobj.lehrveranstaltung.lehrveranstaltung_id) &&
				parseInt(lvobj.lehrveranstaltung.lehrveranstaltung_id) === parseInt(lvid))
			{
				for (var le in lvobj.lehreinheiten)
				{
					var leobj = lvobj.lehreinheiten[le];
					leobj.directlyAssigned = false;
					for (var leidx in leids)
					{
						var leid = leids[leidx];
						if (parseInt(leobj.lehreinheit_id) === parseInt(leid))
						{
							leobj.directlyAssigned = true;
							found = true;
						}
					}
				}
				break;
			}
		}
	},
	/**
	 * Formats a date in format YYYY-mm-dd to dd.mm.YYYY
	 * @param date
	 * @returns {string}
	 */
	_formatDateGerman: function(date)
	{
		return date.substring(8, 10) + "." + date.substring(5, 7) + "." + date.substring(0, 4);
	}
};