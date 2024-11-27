/* version 0.1

	made by Kodiqi
	
*/

function wt_get_site() {
        console.log("Checking...");
        console.log(location.ancestorOrigins[0]);
        console.log("Checking again...");
        console.log(document.referrer);
		gml_Script_gmcallback_site_details(-1, -1, location.ancestorOrigins[0], document.referrer);
    }


