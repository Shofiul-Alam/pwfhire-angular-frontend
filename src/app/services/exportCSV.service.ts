import {Injectable} from '@angular/core';

@Injectable()
export class ExportCSV {

    convertArrayOfObjectsToCSV(args) {
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;

	        data = args.data || null;
	        if (data == null || !data.length) {
	            return null;
	        }

	        columnDelimiter = args.columnDelimiter || ',';
	        lineDelimiter = args.lineDelimiter || '\n';

	        keys = Object.keys(data[0]);

	        result = '';
	        result += keys.join(columnDelimiter);
	        result += lineDelimiter;

	        data.forEach(function(item) {
	            ctr = 0;
	            keys.forEach(function(key) {
	                if (ctr > 0) result += columnDelimiter;

	                result += item[key];
	                ctr++;
	            });
	            result += lineDelimiter;
	        });

	        return result;
	    }

	downloadCSV(args, da) {
        var data = da, filename, link, title;

        var csv = this.convertArrayOfObjectsToCSV({
            data: data
        });
        if (csv == null) return;

        filename = args.filename || 'export.csv';
        title = args.title + '\r\n\n';
        var blob = new Blob([title+csv], {type: "text/csv;charset=utf-8;"});

		if (navigator.msSaveBlob)
		{ // IE 10+
			navigator.msSaveBlob(blob, filename)
		} else {
			link = document.createElement("a");

			if (link.download !== undefined){
				// feature detection, Browsers that support HTML5 download attribute
				var url = URL.createObjectURL(blob);
				link.setAttribute("href", url);
				link.setAttribute("download", filename);
				link.style = "visibility:hidden";
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
		}
    }
}/**
 * Created by User on 11/14/2017.
 */
