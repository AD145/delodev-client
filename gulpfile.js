'use strict';

const path = require('path');
const gulp = require('gulp');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const gulp_tcm = require('gulp-typed-css-modules');
const eslint = require('gulp-eslint');
const copy = require('gulp-copy');
const rimraf = require('gulp-rimraf');
const webpack = require('webpack');
const gulpWebpack = require('webpack-stream');

const wpDir = path.join(__dirname,'./build/webpack/');

const tsProject = ts.createProject('tsconfig.json');
sass.compiler = require('node-sass');

gulp.task('clean',() => {
	return gulp.src(['./lib','./dist','./temp'],{
			allowEmpty: true
		})
		.pipe(rimraf);
});

gulp.task('tsc', () => {
	return gulp.src(['src/**/*.ts','src/**/*.tsx'])
		.pipe(sourcemaps.init())
		.pipe(tsProject())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./lib'));
});

gulp.task('sass',() => {
	return gulp.src('src/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(gulp_tcm())
		.pipe(sourcemaps.write('./lib'))
		.pipe(gulp.dest('./lib'));
});

gulp.task('copy-static-assets',() => {
	return gulp.src(['src/**/*.vue','src/**/*.html','src/**/*.scss'])
		.pipe(copy('./lib',{
			prefix: 1
		}));
});

gulp.task('webpack',() => {
	return gulp.src('lib/index.js')
		.pipe(webpack(require('./build/webpack/webpack.config.dev')))
		.pipe(gulp.dest('dist'));
});

gulp.task('webpack-stream',() => {
	return gulp.src('lib/index.js')
		.pipe(gulpWebpack(require('./build/webpack/webpack.config.dev'),webpack))
		.pipe(gulp.dest('dist'));
});

gulp.task('build',gulp.series('clean','eslint','sass','tsc','copy-static-assets','webpack'));
