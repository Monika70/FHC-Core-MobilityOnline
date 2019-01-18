/**
 * javascript file for Mobility Online incoming sync
 */
const FULL_URL = FHC_JS_DATA_STORAGE_OBJECT.app_root + FHC_JS_DATA_STORAGE_OBJECT.ci_router + "/"+FHC_JS_DATA_STORAGE_OBJECT.called_path;

$(document).ready(function()
	{
		MobilityOnlineIncoming.getIncoming($("#studiensemester").val());

		// change displayed lvs when Studiensemester selected
		$("#studiensemester").change(
			function()
			{
				var studiensemester = $(this).val();
				$("#syncoutput").text('-');
				MobilityOnlineIncoming.getIncoming(studiensemester);
			}
		);

		//init sync
		$("#syncbtn").click(
			function()
			{
				var incomingelem = $("#incomings input[type=checkbox]:checked");
				var incomingids = [];
				incomingelem.each(
					function()
					{
						incomingids.push($(this).val());
					}
				);

				MobilityOnlineIncoming.syncIncomings(incomingids, $("#studiensemester").val());
			}
		);

		//select all incoming checkboxes link
		$("#selectallincomings").click(
			function()
			{
				var incomingelem = $("#incomings input[type=checkbox][name='incoming[]']");
				incomingelem.each(
					function()
					{
						$(this).prop('checked', true);
					}
				);
				MobilityOnlineIncoming._refreshIncomingNumber();
			}
		);

		//select incoming checkboxes which are not in fhcomplete db yet
		$("#selectnewincomings").click(
			function()
			{
				var incomingelem = $("#incomings tr");
				incomingelem.each(
					function()
					{
						var infhc = $(this).find(".infhc").text();

						if (infhc === '0')
							$(this).find("input[type=checkbox][name='incoming[]']").prop('checked', true);
						else
							$(this).find("input[type=checkbox][name='incoming[]']").prop('checked', false);
					}
				);
				MobilityOnlineIncoming._refreshIncomingNumber();
			}
		);
	}
);

var MobilityOnlineIncoming = {
	getIncoming: function(studiensemester)
	{
		FHC_AjaxClient.ajaxCallGet(
			FHC_JS_DATA_STORAGE_OBJECT.called_path+'/getIncomingJson',
			{"studiensemester": studiensemester},
			{
				successCallback: function(data, textStatus, jqXHR)
				{
					if (data !== null)
					{
						$("#incomings").empty();
						for (var incoming in data)
						{
							var person = data[incoming].person;
							var stgexists = $.isNumeric(data[incoming].prestudent.studiengang_kz);
							var chkbxstring, stgnotsettxt, stgnotsetclass, newicon;
							chkbxstring = stgnotsettxt = stgnotsetclass = "";

							if (stgexists)
							{
								chkbxstring = "<input type='checkbox' value='"+incoming+"' name='incoming[]'>";
							}
							else
							{
								stgnotsetclass = " class='inactive' data-toggle='tooltip' title='no Studiengang set in Mobility Online'";
							}

							if (data[incoming].infhc)
							{
								newicon = "<i class='fa fa-check'></i><span style='display:none' class='infhc'>1</span>";
							}
							else
							{
								newicon = "<i class='fa fa-times'></i><span style='display:none' class='infhc'>0</span>";
							}

							$("#incomings").append(
								"<tr"+stgnotsetclass+">" +
									"<td>"+chkbxstring+"</td>" +
									"<td>"+person.vorname+" "+person.nachname+"</td>" +
									"<td>"+data[incoming].kontaktmail.kontakt+"</td>" +
									"<td class='text-center'>"+newicon+"</td>" +
								"</tr>"
							);

							$("#incomings input[type=checkbox][name='incoming[]']").change(
								MobilityOnlineIncoming._refreshIncomingNumber
							);
							MobilityOnlineIncoming._refreshIncomingNumber();
						}
					}
					else
					{
						$("#syncoutput").text("No incomings found!");
					}
				}
			}
		);
	},
	syncIncomings: function(incomingids, studiensemester)
	{
		FHC_AjaxClient.showVeil();
		$(".fhc-ajaxclient-veil").append("<div class='veil-text'>Synchronising...</div>");
		$("#syncoutput").load(
			FULL_URL + '/syncIncomings',
			{
				"incomingids[]": incomingids,
				"studiensemester": studiensemester
			},
			function(response, status, xhr)
			{
				FHC_AjaxClient.hideVeil();
				if (status == "error")
					$("#syncoutput").text("error occured while syncing!");
				MobilityOnlineIncoming.getIncoming(studiensemester);
			}
		);
	},
	_refreshIncomingNumber: function()
	{
		var length = $("#incomings input[type=checkbox][name='incoming[]']:checked").length;

		$("#noincomings").text(length);
	}
};