(function ($) {
  const unicode_charAt = function (string, index) {
    const first = string.charCodeAt(index);
    let second;
    if (first >= 0xD800 && first <= 0xDBFF && string.length > index + 1) {
      second = string.charCodeAt(index + 1);
      if (second >= 0xDC00 && second <= 0xDFFF) {
        return string.substring(index, index + 2);
      }
    }
    return string[index];
  };

  const unicode_slice = function (string, start, end) {
    let accumulator = '';
    let character;
    let stringIndex = 0;
    let unicodeIndex = 0;
    const length = string.length;

    while (stringIndex < length) {
      character = unicode_charAt(string, stringIndex);
      if (unicodeIndex >= start && unicodeIndex < end) {
        accumulator += character;
      }
      stringIndex += character.length;
      unicodeIndex += 1;
    }
    return accumulator;
  };

  $.fn.initial = function (options) {
    // Defining Colors
    const colors = ['#006ba6', '#0496ff', '#ffbc42',
                    '#d81159', '#8f2d56', '#0081af',
                    '#e67e22', '#00abe7', '#2dc7ff',
                    '#ead2ac', '#eaba6b', '#987284',
                    '#75b9be', '#d0d6b5', '#f9b5ac',
                    '#ee7674', '#f2545b', '#a93f55',
                    '#19323c', '#f3f7f0', '#8c5e58',
                    '#af3800', '#fe621d', '#fd5200',
                    '#00cfc1', '#00ffe7'];
    let finalColor;

    return this.each(function () {
      const e = $(this);
      let settings = $.extend({
        // Default settings
        name: 'Name',
        color: null,
        seed: 0,
        charCount: 1,
        textColor: '#ffffff',
        height: 100,
        width: 100,
        fontSize: 60,
        fontWeight: 400,
        fontFamily: 'HelveticaNeue-Light,Helvetica Neue Light,Helvetica Neue,Helvetica, Arial,Lucida Grande, sans-serif',
        radius: 0,
      }, options);

      // overriding from data attributes
      settings = $.extend(settings, e.data());

      // making the text object
      const c = unicode_slice(settings.name, 0, settings.charCount).toUpperCase();
      const cobj = $('<text text-anchor="middle"></text>').attr({
        y: '50%',
        x: '50%',
        dy: '0.35em',
        'pointer-events': 'auto',
        fill: settings.textColor,
        'font-family': settings.fontFamily,
      }).html(c).css({
        'font-weight': settings.fontWeight,
        'font-size': `${settings.fontSize}px`,
      });

      if (settings.color == null) {
        const colorIndex = Math.floor((c.charCodeAt(0) + settings.seed) % colors.length);
        finalColor = colors[colorIndex];
      } else {
        finalColor = settings.color;
      }

      const svg = $('<svg></svg>').attr({
        xmlns: 'http://www.w3.org/2000/svg',
        'pointer-events': 'none',
        width: settings.width,
        height: settings.height,
      }).css({
        'background-color': finalColor,
        width: `${settings.width}px`,
        height: `${settings.height}px`,
        'border-radius': `${settings.radius}px`,
        '-moz-border-radius': `${settings.radius}px`,
      });

      svg.append(cobj);
      // svg.append(group);
      const svgHtml = window.btoa(unescape(encodeURIComponent($('<div>').append(svg.clone()).html())));

      e.attr('src', `data:image/svg+xml;base64,${svgHtml}`);
    });
  };
}(jQuery));
