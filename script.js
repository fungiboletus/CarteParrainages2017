// All the small candidats are in the same category
var categoriesCandidats = {
	"ALLIOT-MARIE Michèle": 0,
	"ARTHAUD Nathalie": 1,
	"ASSELINEAU François": 2,
	"BAROIN François": 0,
	"CAMUS Renaud": 0,
	"CHEMINADE Jacques": 0,
	"DE PREVOISIN Robert": 0,
	"DELAFON Olivier": 0,
	"DUPONT-AIGNAN Nicolas": 3,
	"FAUDOT Bastien": 0,
	"FESSARD DE FOUCAULT Bertrand": 0,
	"FILLON François": 4,
	"GORGES Jean-Pierre": 0,
	"GOUE Michaël": 0,
	"GUAINO Henri": 0,
	"GUYOT Stéphane": 0,
	"HAMON Benoît": 5,
	"JADOT Yannick": 0,
	"JARDIN Alexandre": 0,
	"JUPPE Alain": 0,
	"LARROUTUROU Pierre": 0,
	"LASSALLE Jean": 0,
	"LE PEN Marine": 6,
	"MACRON Emmanuel": 7,
	"MARCHANDISE Charlotte": 0,
	"MARTINEZ Jean-Claude": 0,
	"MELENCHON Jean-Luc": 8,
	"MIGUET Nicolas": 0,
	"MILLO Jean-Luc": 0,
	"MUMBACH Paul": 0,
	"NIKONOFF Jacques": 0,
	"POUTOU Philippe": 0,
	"REGIS Olivier": 0,
	"TAUZIN Didier": 0,
	"TEMARU Oscar": 0,
	"TONIUTTI Emmanuel": 0,
	"TRAMBOUZE Bernard": 0,
	"TROADEC Christian": 0,
	"VERGNE Michel": 0,
	"WAECHTER Antoine": 0,
	"YADE Rama": 0
};

// Candidats with enough parrainages and others
// 
var importantCandidats = [
	"ARTHAUD Nathalie",
	"ASSELINEAU François",
	"DUPONT-AIGNAN Nicolas",
	"FILLON François",
	"HAMON Benoît",
	"LE PEN Marine",
	"MACRON Emmanuel",

	"MELENCHON Jean-Luc",

	"CHEMINADE Jacques",
	"JUPPE Alain",
	"LASSALLE Jean",
	"POUTOU Philippe",
	"YADE Rama",

	"Autres"
];

// Main colours from the candidates websites
var colours = [
	// Others (gris AirFrance)
	'#666',
	// Nathalie Arthaud (Rouge évidemment)
	'#c41114',
	// Asselineau François (bleu vert)
	'#057c85',
	// Nicolas Dupont-Aignant (bleu clair pas trop saturé)
	'#54a0d4',
	// François Fillon le rebel (bleu marine)
	'#23408f',
	// Benoît Hamont (vert clair. Seconde couleur, le rouge étant populaire) test en rose
	'#eb1e4f',
	// Marine Le Pen (bleu marine comme Fillon :) )
	'#000042',
	// Emmanuel Macron (rose ou bleu clair, choix difficile => violet (mix bleu et rouge) après remarques utilisateurs)
	'#bd008c',
	// Jean-Luc Mélenchon (rouge pas trop agressif)
	'#c9462c'];
var pi2 = Math.PI * 2;

 var textCandidats = [
  ' ',
  'NA',
  'AF',
  'NDA',
  'FF',
  'BH',
  'MLP',
  'EM',
  'JLM'
 ];

L.Icon.MarkerCluster = L.Icon.extend({
    options: {
        iconSize: new L.Point(48, 48),
        className: 'prunecluster leaflet-markercluster-icon'
    },
    createIcon: function () {
        // based on L.Icon.Canvas from shramov/leaflet-plugins (BSD licence)
        var e = document.createElement('canvas');
        this._setIconStyles(e, 'icon');
        var s = this.options.iconSize;
		var w = s.x, h = s.y;
		if (L.Browser.retina) {
			w += w;
			h += h;
		}
		e.width = w;
		e.height = h;
		this.draw(e.getContext('2d'), w, h);
		return e;
    },
    createShadow: function () {
        return null;
    },
    draw: function(canvas, width, height) {
		var xa = 2, xb = 50, ya = 18, yb = 21;

		var r = ya + (this.population - xa) * ((yb - ya) / (xb - xa));

		var radiusMarker = Math.min(r, 21),
			radiusCenter = 11,
			center = width / 2;

		if (this.hideClusterInfos) {
			radiusMarker = 15;
		}

		if (L.Browser.retina) {
			canvas.scale(2, 2);
			center /= 2;
			canvas.lineWidth = 0.5;
		}

		canvas.strokeStyle = 'rgba(0,0,0,0.25)';

		var start = 0, stroke = true;
		for (var i = 0, l = colours.length; i < l; ++i) {

			//var size = Math.min(this.stats[i] / this.population,
			//	this.stats[i] / 100);

			var size = this.stats[i] / this.population;

			if (size > 0) {

				stroke = size != 1;

				canvas.beginPath();
				canvas.moveTo(center, center);
				canvas.fillStyle = colours[i];
				var from = start + 0.14,
					to = start + size * pi2;

				if (to < from || size == 1) {
					from = start;
				}
				canvas.arc(center, center, radiusMarker, from, to);

				start = start + size * pi2;
				canvas.lineTo(center, center);
				canvas.fill();
				if (stroke) {
					canvas.stroke();
				}
				canvas.closePath();
			}

		}

		if (!stroke) {
			canvas.beginPath();
			canvas.arc(center, center, radiusMarker, 0, Math.PI * 2);
			canvas.stroke();
			canvas.closePath();
		}

		if (!this.hideClusterInfos) {
			canvas.beginPath();
			canvas.fillStyle = 'white';
			canvas.moveTo(center, center);
			canvas.arc(center, center, radiusCenter, 0, Math.PI * 2);
			canvas.fill();
			canvas.closePath();


			canvas.fillStyle = '#454545';
			canvas.textAlign = 'center';
			canvas.textBaseline = 'middle';
			canvas.font = 'bold '+(this.population < 100 ? '12' : '11')+'px sans-serif';

			canvas.fillText(this.population, center, center, radiusCenter*2);
		}

		if (this.candidatText) {
			canvas.fillStyle = 'white';
			canvas.textAlign = 'center';
			canvas.textBaseline = 'middle';
			canvas.font = 'bold 11px sans-serif';
			canvas.fillText(this.candidatText, center, center, radiusMarker*2);
		}
    }
});

$(document).ready(function() {
	var loadingText = document.createElement("div");
	loadingText.id = "loadingText";
	loadingText.appendChild(document.createTextNode("Chargement des données"));
	document.body.appendChild(loadingText);

	var suggestions = document.getElementById("suggestions");
	suggestions.style.display='none';

	var defaultView = L.latLng(46.603354, 1.888335);
	var defaultZoom = 2;

    var map = L.map("map", {
        attributionControl: false,
        zoomControl: true
    }).setView(defaultView, defaultZoom);

    //L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    L.tileLayer('https://{s}.tiles.mapbox.com/v3/apultier.2e8rr2gy/{z}/{x}/{y}.png', {
        detectRetina: true,
        //maxNativeZoom: 10
    }).addTo(map);

    L.control.attribution({
    	prefix: '<a href="https://twitter.com/yellowiscool"> Antoine Pultier</a> | '+
    	'<a href="http://mapbox.com/">MapBox</a> | '+
    	'<a href="https://github.com/SINTEF-9012/PruneCluster">PruneCluster</a> | ' +
    	'© <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors | '+
    	'Données du <a href="https://presidentielle2017.conseil-constitutionnel.fr/">Conseil Constitutionnel</a>'
    }).addTo(map);

    var leafletView = new PruneClusterForLeaflet();

    leafletView.BuildLeafletClusterIcon = function(cluster) {
        var e = new L.Icon.MarkerCluster();
        e.stats = cluster.stats;
        e.population = cluster.population;
        return e;
    };


    var iconsCandidats = [];
    for (var i = 0; i < colours.length; ++i) {
        var e = new L.Icon.MarkerCluster();
        e.stats = [0,0,0,0,0,0,0,0];
        e.population = 1
        e.hideClusterInfos = true;
        e.candidatText = textCandidats[i];
        e.stats[i] = 1;
        iconsCandidats.push(e);
    }

    var popupOptions = {
		offset: L.point(0, -8)
	};

    var markers = [];
    var nameList = [];
    var parrainages = {};

    $.getJSON('./data.json', function(data) {
        //[data[0]].forEach(function(candidat) {
        data.forEach(function(candidat) {
        	var candidatName = candidat["Candidat-e parrainé-e"];
        	var candidatCategory = categoriesCandidats[candidatName] || 0;

        	nameList.push(candidatName);

        	candidat.Parrainages.forEach(function(parrainage) {
        		//console.log(parrainage, parrainage.location);
        		var location = parrainage.location;

        		// A few parrainages don't have locations
        		// Example : Français de l'étranger.
        		if (!location) return;

        		var name = parrainage["Nom"] + " " + parrainage["Prénom"];
        		nameList.push(name);

        		parrainages[name] = parrainage;

        		var htmlPopup = "<h2 class=\"nom\">" + parrainage["Civilité"] + " " + parrainage["Prénom"] + " "+ parrainage.Nom + "</h2>" +
        			"<span class=\"mandat\">" + parrainage.Mandat + "</span>"+
        			"<p>A parrainé: <strong>"+candidatName+"</strong></p>";

        		if (parrainage.Circonscription || parrainage["Département"]) {
        			htmlPopup += "<p>";
        		}

        		if (parrainage.Circonscription) {
        			htmlPopup += "Circonscription: <strong>"+parrainage.Circonscription + "</strong>";
        		}

        		if (parrainage["Département"]) {
        			if (parrainage.Circonscription) {
        				htmlPopup += "<br>";
        			}
        			htmlPopup += "Département: <strong>"+parrainage["Département"] + "</strong>";
        		}

        		if (parrainage.Circonscription || parrainage["Département"]) {
        			htmlPopup += "</p>";
        		}

        		htmlPopup += "<p>Date de publication: <strong>"+parrainage["Date de publication"] + "</strong></p>";

        		var marker = new PruneCluster.Marker(
        			location.lat,
        			location.lon,
        			{
						popup: htmlPopup,
						popupOptions: popupOptions,
						icon: iconsCandidats[candidatCategory],
						candidat: candidatName,
						name: name,
        			}
        		);

        		marker.category = candidatCategory;
        		markers.push(marker);
        		leafletView.RegisterMarker(marker);
        	});
        });

	    map.addLayer(leafletView);

		function filterMap(name) {
			map.closePopup();
			if (name === 'Autres') {
				var bounds = new L.LatLngBounds();
				// We only display the markers related to the candidate
				for (var i = 0, l = markers.length; i < l; ++i) {
					var isForCandidate = categoriesCandidats[markers[i].data.candidat] === 0;
					markers[i].filtered = !isForCandidate;
					if (isForCandidate) {
						bounds.extend(new L.LatLng(markers[i].position.lat, markers[i].position.lng))
					}
				}
				leafletView.ProcessView();
				//map.setView(defaultView, defaultZoom);
				map.fitBounds(bounds, {
					padding: [100, 100]
				});
			}
			// If it's a candidate
			else if (categoriesCandidats.hasOwnProperty(name)) {
				var bounds = new L.LatLngBounds();
				// We only display the markers related to the candidate
				for (var i = 0, l = markers.length; i < l; ++i) {
					var isForCandidate = markers[i].data.candidat === name;
					markers[i].filtered = !isForCandidate;
					if (isForCandidate) {
						bounds.extend(new L.LatLng(markers[i].position.lat, markers[i].position.lng))
					}
				}
				leafletView.ProcessView();
				//map.setView(defaultView, defaultZoom);
				console.log(bounds);
				map.fitBounds(bounds, {
					padding: [100, 100]
				});
			} else {
				var candidateFound = false;
				// If it's just a parrainage, we display everything and zoom to the parainage area
				// and we open a popup
				for (var i = 0, l = markers.length; i < l; ++i) {
					markers[i].filtered = false;
					if (markers[i].data.name === name) {
						var parrainage = parrainages[markers[i].data.name];
						if (!parrainage) {
							alert(name + " a parrainé-e "+markers[i].data.candidat);
							continue;
						}
						candidateFound = true;

						map.fitBounds([
							[
								parrainage.location.mapView.TopLeft.Latitude,
								parrainage.location.mapView.TopLeft.Longitude
							],
							[
								parrainage.location.mapView.BottomRight.Latitude,
								parrainage.location.mapView.BottomRight.Longitude
							]
						]);

						map.openPopup(markers[i].data.popup, [
							parrainage.location.lat,
							parrainage.location.lon
						], popupOptions);
						//console.log()
					}
				}
				if (!candidateFound) {
					map.setView(defaultView, defaultZoom);
				}
				leafletView.ProcessView();
			}



		};

	    var optionsFuse = {
			shouldSort: true,
			threshold: 0.4,
			location: 0,
			distance: 6,
			maxPatternLength: 10,
			minMatchCharLength: 1,
			keys: [
				"name",
			]
		};
		var fuse = new Fuse(nameList.map(function(name) { return {name: name};}), optionsFuse);

	    var searchInput = document.getElementById('search-input');
	    var autocompleteSearch = new Awesomplete(searchInput, {
	    	list: [],
	    	filter: function(text, input) {
	    		return true
	    	},
	    	sort: false,
	    	item: function(text, input) {
	    		var html = Awesomplete.ITEM(text, input);
	    		if (categoriesCandidats.hasOwnProperty(text)) {
	    			html.className = "candidat";
	    			html.style.color = 'white';
	    			html.style.background = colours[categoriesCandidats[text]];
	    		}
	    		return html;
	    	}
	    	/*data: function(suggestionText, userinput) {
	    		return 
	    	}*/
	    });

	    var firstResult = null;
	    searchInput.addEventListener("input", function() {
			var list = fuse.search(searchInput.value);
			var newList = [];
			for (var i = 0; i < list.length && i < 10; ++i) {
				var name = list[i].name;
				if (categoriesCandidats.hasOwnProperty(name)) {
					newList.unshift(name);
				} else {
					newList.push(name);
				}
			}
			firstResult = newList[0];
			autocompleteSearch.list = newList;
		});

		searchInput.addEventListener('keyup', function (e) {
		    if (e.keyCode == 13) {
		    	//searchInput.blur();
		    	if (!parrainages.hasOwnProperty(searchInput.value) && firstResult) {
			    	searchInput.value = firstResult;
			    	filterMap(searchInput.value);
		    	}
		    }
		});

		searchInput.addEventListener("awesomplete-selectcomplete", function() {
			filterMap(searchInput.value);
		});

		importantCandidats.forEach(function(candidat) {
			var candidatButton = document.createElement("a");
			candidatButton.appendChild(document.createTextNode(candidat));
			candidatButton.setAttribute("href", "#");
			if (candidat === 'Autres') {
				candidatButton.style.background = colours[0];
			} else {
				candidatButton.style.background = colours[categoriesCandidats[candidat]];
			}
			candidatButton.addEventListener("click", function(e) {
				e.preventDefault();
				searchInput.value = candidat;
				filterMap(candidat);
			});
			suggestions.appendChild(candidatButton);
			suggestions.appendChild(document.createTextNode(" "));
		});

		document.getElementById("clear").addEventListener("click", function(e) {
			e.preventDefault();
			searchInput.value = '';
			searchInput.focus();
			filterMap();
		});

		suggestions.style.display='block';
		$(loadingText).remove();
    });
});

