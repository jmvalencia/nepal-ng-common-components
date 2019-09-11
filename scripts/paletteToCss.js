const fs = require('fs');
const sassExtract = require('sass-extract');
const sourceScss = 'node_modules/@al/design/styles/palette.scss';
const destScss = `${__dirname}/../projects/nepal-ng-common-components/src/styles/paletteClassNames.scss`;


/*
 * Starts here
 */
sassExtract.render({
  file: sourceScss 
})
.then(rendered => {
  const classes = processRendered(rendered);
  exportClasses(classes);
});

/*
 *
 */
const processRendered = rendered => {
  const vars = rendered.vars.global['$paletteMap'].value;
  const keys = Object.keys(vars);
  const aColors = keys.map(key => {
    const valueKeys = Object.keys(vars[key].value);
    const ret = valueKeys.map(valueKey => {
      const prefix = `${key}-${valueKey}`; 
      return `.${prefix} rect, path.${prefix}, rect.${prefix}, .${prefix} .highcharts-area, .${prefix} .highcharts-halo { fill: al-color(\$${key}, ${valueKey}); stroke: none; }`;
    });
    return ret;
  });
  return [].concat(...aColors).filter(item => !/contrast/.test(item));
};

/*
 *
 */
const exportClasses = classes => {
  fs.writeFile(destScss, classes.join('\n'), function(err) {
    console.log(`Error generating color class names: ${err}`);
  });
};
