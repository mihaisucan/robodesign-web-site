/*
 * © 2010 ROBO Design
 * http://www.robodesign.ro
 */

(function () {
  var actions = {};

  actions.search_buttonOver = function () {
	this.src = this.src.replace("search-button.png", "search-button-hover.png");
  };

  actions.search_buttonOut = function () {
	this.src = this.src.replace("search-button-hover.png", "search-button.png");
  };

  actions.textinc = function (ev) {
    ev.preventDefault();

    options.textsize += options.textsize_step;
    if (options.textsize > options.textsize_max) {
      options.textsize = options.textsize_max;
    }

	actions.textsize_update();
  };

  actions.textdec = function (ev) {
    ev.preventDefault();

    options.textsize -= options.textsize_step;
    if (options.textsize < options.textsize_min) {
      options.textsize = options.textsize_min;
    }

	actions.textsize_update();
  };

  actions.textreset = function (ev) {
    ev.preventDefault();
    options.textsize = options.textsize_default;
    actions.textsize_update();
  };

  actions.textsize_update = function () {
	var height = elems.content.height();
	var scrollY = window.pageYOffset;

	elems.content.css("font-size", options.textsize + "em");

	if (scrollY == window.pageYOffset) {
	  window.scrollBy(0, elems.content.height() - height);
	}

    $.cookie(cookies.textsize, options.textsize,
			 {expire: cookies.days, path: "/"});
  };

  actions.invertcolors = function (ev) {
	ev.preventDefault();

    if (options.invertcolors == 'n') {
      actions.loadInvertStyle();
      options.invertcolors = 'y';
    } else {
      actions.unloadInvertStyle();
      options.invertcolors = 'n';
    }

    $.cookie(cookies.invertcolors, options.invertcolors,
			 {expire: cookies.days, path: "/"});
  };

  actions.loadInvertStyle = function () {
    $('<link href="/assets/styles/invert.css" rel="stylesheet" type="text/css" id="invertStylesheet">').appendTo("head");
  };

  actions.unloadInvertStyle = function () {
    var link = $("#invertStylesheet");
    if (link) {
      link.remove();
    }
  };

  actions.menusOver = function () {
	  var ul = $(this).children("ul");
	  if (ul.size() != 1) {
		  return;
	  }

	  var removed_new_ul = false;
	  if (elems.submenu_new_ul) {
		  elems.submenu_new_ul.remove();
		  removed_new_ul = true;
		  if (elems.submenu_timeout) {
			  clearTimeout(elems.submenu_timeout);
			  elems.submenu_timeout = null;
		  }
	  }

	  ul = ul.clone();

	  elems.submenu_new_ul = ul;

	  if (removed_new_ul) {
		  ul.appendTo(elems.submenus.children().first());
	  } else if (elems.submenu_old_ul) {
		  ul.hide();
		  ul.appendTo(elems.submenus.children().first());

		  elems.submenu_old_ul.fadeOut(function () {
			if (!elems.submenu_new_ul) {
				return;
			}

			elems.submenu_new_ul.fadeIn();
		  });
	  } else {
	    ul.appendTo(elems.submenus.children().first());
		elems.submenus.fadeIn();
	  }
  };

  actions.menusOut = function () {
	  if (!elems.submenu_new_ul) {
		  return;
	  }

	elems.submenu_timeout = setTimeout(function () {
		if (elems.submenu_hovered || !elems.submenu_new_ul) {
		  return;
		}

		var fader = elems.submenu_new_ul;
		if (!elems.submenu_old_ul) {
			fader = elems.submenus;
		}
		fader.fadeOut(function () {
		  if (!elems.submenu_new_ul) {
		    return;
		  }
	 	  elems.submenu_new_ul.remove();
		  elems.submenu_new_ul = null;
		  if (elems.submenu_old_ul) {
		    elems.submenu_old_ul.fadeIn();
		  }
	    });
    }, 500);
  };

  actions.submenusOver = function () {
	  elems.submenu_hovered = true;
  };

  actions.submenusOut = function () {
	  elems.submenu_hovered = false;

	  actions.menusOut();
  };

  actions.pagebarOver = function () {
          // aici vroiam să fac scrollable meniurile (pagebars), nu am terminat.
	  var ul = $(this).children("ul");
	  if (ul.size() != 1) {
		  return;
	  }

	  var height = ul.height();
	  var winheight = $(window).height();
	  var scrollY = window.pageYOffset;
	  var offset = ul.offset();
	  var bottomoffset = offset.top + height - scrollY;
	  if (bottomoffset < winheight) {
		  return;
	  }

	  var newheight = height - (bottomoffset-winheight);
	  ul.css("height", newheight);

	  //var scroller = new scroller(ul);
  };

  actions.pagebarOut = function () {
  };

  var elems = {};

  elems.content = null; // see DOMContentLoaded
  elems.footer = null; /// see DOMContentLoaded
  elems.accessibility = $('<div id="accessibility">');
  elems.para = $('<p><a href="#">Accessibility</a></p>');
  elems.options = $("<ul>");
  elems.textinc = $('<li><a href="#">Increase text size</a></li>');
  elems.textdec = $('<li><a href="#">Decrease text size</a></li>');
  elems.textreset = $('<li><a href="#">Reset text size</a></li>');
  elems.invertcolors = $('<li><a href="#">Invert colors</a></li>');

  var options = {};

  options.invertcolors = 'y';
  options.textsize_default = 1;
  options.textsize = options.textsize_default;
  options.textsize_max = 2.55;
  options.textsize_min = 0.65;
  options.textsize_step = 0.1;

  var cookies = {};
  cookies.textsize = 'marius_textsize';
  cookies.invertcolors = 'marius_invertcolors';
  cookies.days = 180;

  elems.textinc.children("a").click(actions.textinc);
  elems.textdec.children("a").click(actions.textdec);
  elems.textreset.children("a").click(actions.textreset);
  elems.invertcolors.children("a").click(actions.invertcolors);

  // accessibility paragraph
  elems.para.children("a").click(function (ev) {
    ev.preventDefault();
  });

  elems.options.append(elems.textdec);
  elems.options.append(elems.textinc);
  elems.options.append(elems.textreset);
  elems.options.append(elems.invertcolors);
  elems.accessibility.append(elems.para);
  elems.accessibility.append(elems.options);

  options.invertcolors = $.cookie(cookies.invertcolors) || options.invertcolors;
  if (options.invertcolors == 'y') {
    actions.loadInvertStyle();
  } else {
    options.invertcolors = 'n';
  }

  $(document).ready(function () {
    elems.content = $("#content");
    elems.footer = $("#site-options");
	elems.search_button = $("#search-form input[type=image]");
	elems.menus = $("#menu-align > ul");
	elems.submenus = $("#submenu-bar");
	elems.pagebar = $("#page-bar > div > ul");
	elems.submenu_hovered = false;
	if (elems.submenus.size() == 1) {
		elems.submenu_old_ul = elems.submenus.find("div > ul");
	} else {
		elems.submenu_old_ul = null;
		elems.submenus = $('<div id="submenu-bar"><div></div></div>');
		elems.submenus.hide();
		elems.submenus.appendTo("#menu-bar");
	}

	elems.accessibility.prependTo(elems.footer);

    options.textsize = parseFloat($.cookie(cookies.textsize)) || options.textsize;
    if (options.textsize != options.textsize_default) {
      elems.content.css("font-size", options.textsize + "em");
    }

	elems.menus.children("li").hover(actions.menusOver, actions.menusOut);
	elems.submenus.hover(actions.submenusOver, actions.submenusOut);

	elems.pagebar.children("li").hover(actions.pagebarOver, actions.pagebarOut);

	elems.search_button.hover(actions.search_buttonOver, actions.search_buttonOut);
  });

})();
