const { parallel, series, watch, src, dest } = require('gulp');
const { server, reload } = require('gulp-connect');
const { env, noop } = require('gulp-util');
const inject = require('gulp-inject');
const htmlmin = require('gulp-htmlmin');
const source = require('vinyl-source-stream');
const browserify = require('browserify');
const tsify = require('tsify');
const del = require('del');

function serve() {
    return server({
        root: './',
        livereload: true,
        port: 8000
    });
}

function startWatch() {
    watch('src/**/*.ts', ts);
    watch('src/index.html', html);
    watch('src/styles.css', styles);
}

function ts() {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/main.ts'],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(dest('dist'))
        .pipe(reload());
}

function styles() {
    return src('src/styles.css')
        .pipe(dest('dist'))
        .pipe(reload());
}

function html() {
    return src('src/index.html')
        .pipe(env.production ? inject(src('dist/bundle.js'), {
            startTag: '<!-- inject:js -->',
            transform: (filepath, file) => `<script>${file.contents.toString()}</script>`
        }) : noop())
        .pipe(env.production ? inject(src('dist/styles.css'), {
            startTag: '<!-- inject:css -->',
            transform: (filepath, file) => `<style>${file.contents.toString()}</style>`
        }) : noop())
        .pipe(env.production ? htmlmin({ collapseWhitespace: true, minifyCSS: true, minifyJS: true }) : noop())
        .pipe(dest('./'))
        .pipe(reload());
}

function clean() {
    return del(['dist', 'index.html']);
}

exports.clean = clean;
exports.build = env.production ?
                series(
                    clean,
                    parallel(ts, styles),
                    html
                ) :
                series(
                    clean,
                    parallel(ts, styles, html)
                );
exports.default = series(
    clean,
    parallel(ts, styles, html),
    parallel(serve, startWatch)
);
