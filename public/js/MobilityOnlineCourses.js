/**
 * javascript file for Mobility Online courses sync
 */
const FULL_URL = FHC_JS_DATA_STORAGE_OBJECT.app_root + FHC_JS_DATA_STORAGE_OBJECT.ci_router + "/"+FHC_JS_DATA_STORAGE_OBJECT.called_path;

$(document).ready(function()
	{
		MobilityOnlineCourses.getLvs($("#studiensemester").val());

		// change displayed lvs when Studiensemester selected
		$("#studiensemester").change(
			function()
			{
				var studiensemester = $(this).val();
				MobilityOnlineCourses.getLvs(studiensemester);
			}
		);

		//collapse/expand lvlist
		$("#lvhead").click(
			function()
			{
				if ($("#lvs").is(':visible'))
				{
					$("#lvs").hide();
					$("#arrowtoggle").html("<i class='fa fa-chevron-right'></i>");
				}
				else
				{
					$("#lvs").show();
					$("#arrowtoggle").html("<i class='fa fa-chevron-down'></i>");
				}
			}
		);

		//init sync
		$("#syncbtn").click(
			function()
			{
				MobilityOnlineCourses.syncLvs($("#studiensemester").val());
			}
		);
	}
);

var MobilityOnlineCourses = {
	getLvs: function(studiensemester)
	{
		FHC_AjaxClient.ajaxCallGet(
			FHC_JS_DATA_STORAGE_OBJECT.called_path+'/getLvsJson',
			{"studiensemester": studiensemester},
			{
				successCallback: function(data, textStatus, jqXHR)
				{
					if (FHC_AjaxClient.hasData(data))
					{
						var lvcount = data.retval.length;
						$("#lvcount").text(lvcount);
						$("#lvs").empty();
						for (var i in data.retval)
						{
							var lv = data.retval[i];
							$("#lvs").append("<p>" + lv.studiengang_kuerzel + " " + lv.orgform_kurzbz + " - "
								+ lv.bezeichnung + " " + lv.lehrform_kurzbz + " - " + lv.lehrveranstaltung_id + "</p>");
						}
					}
					else
					{
						alert('No courses found!');
					}
				}
			}
		);
	},
	syncLvs: function(studiensemester)
	{

		FHC_AjaxClient.showVeil();
		$(".fhc-ajaxclient-veil").append("<div class='veil-text'>Synchronising...</div>");
		$("#syncoutput").load(
			FULL_URL + '/syncLvs?studiensemester=' + encodeURIComponent(studiensemester),
			function(response, status, xhr)
			{
				FHC_AjaxClient.hideVeil();
				if (status == "error")
					$("#syncoutput").text("error occured while syncing!");
			}
		);

	}
};