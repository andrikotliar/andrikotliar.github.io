const gulp = require('gulp');
const del = require('del');
const postcss = require('gulp-postcss');
const sync = require('browser-sync');
const terser = require('gulp-terser');
const nunjucksRender = require('gulp-nunjucks-render');
const htmlmin = require('gulp-htmlmin');

const manageEnvironment = (environment) => {
  environment.addFilter("json", (value) => {
    return JSON.parse(value);
  })
};

const template = () => {
    return gulp.src('./src/index.njk')
        .pipe(nunjucksRender({
          path: ['src/includes/'],
          manageEnv: manageEnvironment
        }))
        .pipe(gulp.dest('./'))
        .pipe(sync.stream())
}

exports.template = template;

const compressHTML = () => {
    return gulp.src('./index.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./'))
}

exports.compressHTML = compressHTML;

const styles = () => {
    return gulp.src('src/styles/styles.css')
        .pipe(postcss([
        	require('postcss-import'),
            require('autoprefixer'),
            require('postcss-csso'),
        ]))
        .pipe(gulp.dest('dist'))
        .pipe(sync.stream())
};

exports.styles = styles;

const scripts = () => {
    return gulp.src('src/scripts/*.js')
    	.pipe(terser())
        .pipe(gulp.dest('dist'))
        .pipe(sync.stream())
};

exports.scripts = scripts;

const copy = () => {
    return gulp.src([
            'src/fonts/**/*'
        ], {
            base: 'src'
        })
        .pipe(gulp.dest('dist'))
        .pipe(sync.stream({
            once: true
        }))
};

exports.copy = copy;

const server = () => {
    sync.init({
        ui: false,
        notify: false,
        server: {
            baseDir: './'
        }
    })
};

exports.server = server;

const watch = () => {
    gulp.watch(
        [
            './src/index.njk', 
            './src/includes/*.njk',
            './src/includes/data/*.json'
        ], gulp.series(template));
    gulp.watch('./src/styles/**/*.css', gulp.series(styles));
    gulp.watch('./src/scripts/**/*.js', gulp.series(scripts));
};

exports.watch = watch;

const clean = () => {
    return del(['dist']);
};

exports.clean = clean;

const start = gulp.series (
	gulp.parallel(
		clean
	),

	gulp.parallel(
		template,
		styles,
		scripts,
		copy
	),

    gulp.parallel(
        watch,
        server
    )
);

exports.start = start;

const build = gulp.series (
	clean,
    template,
    compressHTML,
	styles,
	scripts,
    copy
);

exports.build = build;