const gulp = require("gulp"),
  sass = require("gulp-sass")(require("sass")),
  sourceMaps = require("gulp-sourcemaps"),
  plumber = require("gulp-plumber"),
  // rename = require('gulp-rename'),
  csso = require("gulp-csso"),
  notify = require("gulp-notify"),
  del = require("del"),
  browserSync = require("browser-sync").create(),
  autoprefixer = require("gulp-autoprefixer");

const paths = {
  root: "./dist",
  styles: {
    src: "./src/styles/**/*.scss",
    main: "./src/styles/*.scss",
    dest: "./dist",
  },
  templates: {
    src: "./src/*.html",
    dest: "./dist",
  },
};

const templates = () => {
  return gulp
    .src(paths.templates.src)
    .pipe(gulp.dest(paths.templates.dest))
    .on("end", browserSync.reload);
};

const styles = () => {
  return (
    gulp
      .src(paths.styles.main)
      .pipe(sourceMaps.init())
      .pipe(plumber())
      .pipe(
        sass({
          includePaths: ["node_modules/"],
        })
      )
      .on(
        "error",
        notify.onError({
          title: "styles",
        })
      )
      .pipe(
        autoprefixer({
          borwsers: ["last 3 version"],
        })
      )
      .pipe(sourceMaps.write())
      // .pipe(rename('main.min.css'))
      .pipe(gulp.dest(paths.styles.dest))
      .pipe(browserSync.stream())
  );
};

const stylesProd = () => {
  return (
    gulp
      .src(paths.styles.main)
      .pipe(
        sass({
          includePaths: ["node_modules/"],
        })
      )
      .pipe(
        autoprefixer({
          borwsers: ["last 3 version"],
        })
      )
      .pipe(csso())
      // .pipe(rename('main.min.css'))
      .pipe(gulp.dest(paths.styles.dest))
  );
};

const clean = () => del(paths.root);

const watch = () => {
  gulp.watch(paths.templates.src, templates);
  gulp.watch(paths.styles.src, styles);
};

const serve = () => {
  browserSync.init({
    server: {
      baseDir: paths.root,
    },
    port: 8080,
    open: false,
  });
};
exports.templates = templates;
exports.styles = styles;
exports.stylesProd = stylesProd;
exports.clean = clean;
exports.watch = watch;
exports.serve = serve;

gulp.task(
  "default",
  gulp.series(
    clean,
    gulp.parallel(styles, templates),
    templates,
    gulp.parallel(watch, serve)
  )
);

gulp.task(
  "build",
  gulp.series(clean, gulp.parallel(stylesProd, templates), templates)
);
