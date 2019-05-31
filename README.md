This exhibition has passed. Content on this site is no longer maintained. Hence the reason this repository is archived.

# Faulkner Exhibition

[![license][license-image]][license-url] [![Build Status][travis-image]][travis-url]
> Faulkner exhibit marketing page

## Credits

* Anthony Jones - UX Design and Development @iamtonybagels
* Holly Robertson - Content
* Jeff Hill - Illustrations

Open Source Projects

* Stefan Kovac, Flex Layout Attribute
* Nick Williams - Headroom JS
* Davide Calignano - Medium Lightbox

## Prerequisites

To install this project, you'll need the following things installed on your machine.

* [Jekyll](http://jekyllrb.com/) - `$ gem install jekyll`
* [NodeJS](http://nodejs.org) - use the [installer](https://nodejs.org/en/download/)
* NPM - `$ npm install npm -g`
* Update Bundler - `$ bundle update`

## Local Installation

1. Clone this repo, or download it into a directory of your choice.
2. Inside the directory, run `npm install`.
3. Then run `bundle update`.

## Usage

**Development mode**

To build your site run the following command

```shell
$ gulp
```

This will give you file watching, browser synchronisation, auto-rebuild, CSS injecting etc.

```shell
$ gulp serve
```

**Deploy to Development - https://uvalib.github.io/faulkner/**

You can easily deploy your site build to GitHub pages with the command
```shell
$ gulp deploy-to-test
```
**Deploy to Production - http://faulkner2017.lib.virginia.edu/**

You can easily deploy your site build to UVA Libraries production server with the command
```shell
$ git push origin master
```

## Tests
You can run accessibility test set to WCAG Level AA
```shell
$ gulp accessibility
```

If you want to run the HTML tests on your local machine please install `gem install html-proofer`. And then run the tests using
```shell
$ htmlproofer ./_site
```

[license-image]: https://img.shields.io/badge/license-ISC-blue.svg
[license-url]: https://github.com/uvalib/faulkner/blob/master/LICENSE
[travis-image]: https://travis-ci.org/uvalib/faulkner.svg?branch=master
[travis-url]: https://travis-ci.org/uvalib/faulkner

## Content Writers
1. Edit the files in the [master branch](https://github.com/uvalib/faulkner/tree/master)
2. Build will automatically begin
3. View your changes in production at http://faulkner2017.lib.virginia.edu/
