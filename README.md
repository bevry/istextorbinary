<!-- TITLE/ -->

<h1>Is Text or Binary?</h1>

<!-- /TITLE -->


<!-- BADGES/ -->

<span class="badge-travisci"><a href="http://travis-ci.com/bevry/istextorbinary" title="Check this project's build status on TravisCI"><img src="https://img.shields.io/travis/com/bevry/istextorbinary/master.svg" alt="Travis CI Build Status" /></a></span>
<span class="badge-npmversion"><a href="https://npmjs.org/package/istextorbinary" title="View this project on NPM"><img src="https://img.shields.io/npm/v/istextorbinary.svg" alt="NPM version" /></a></span>
<span class="badge-npmdownloads"><a href="https://npmjs.org/package/istextorbinary" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/istextorbinary.svg" alt="NPM downloads" /></a></span>
<span class="badge-daviddm"><a href="https://david-dm.org/bevry/istextorbinary" title="View the status of this project's dependencies on DavidDM"><img src="https://img.shields.io/david/bevry/istextorbinary.svg" alt="Dependency Status" /></a></span>
<span class="badge-daviddmdev"><a href="https://david-dm.org/bevry/istextorbinary#info=devDependencies" title="View the status of this project's development dependencies on DavidDM"><img src="https://img.shields.io/david/dev/bevry/istextorbinary.svg" alt="Dev Dependency Status" /></a></span>
<br class="badge-separator" />
<span class="badge-githubsponsors"><a href="https://github.com/sponsors/balupton" title="Donate to this project using GitHub Sponsors"><img src="https://img.shields.io/badge/github-donate-yellow.svg" alt="GitHub Sponsors donate button" /></a></span>
<span class="badge-patreon"><a href="https://patreon.com/bevry" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
<span class="badge-flattr"><a href="https://flattr.com/profile/balupton" title="Donate to this project using Flattr"><img src="https://img.shields.io/badge/flattr-donate-yellow.svg" alt="Flattr donate button" /></a></span>
<span class="badge-liberapay"><a href="https://liberapay.com/bevry" title="Donate to this project using Liberapay"><img src="https://img.shields.io/badge/liberapay-donate-yellow.svg" alt="Liberapay donate button" /></a></span>
<span class="badge-buymeacoffee"><a href="https://buymeacoffee.com/balupton" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a></span>
<span class="badge-opencollective"><a href="https://opencollective.com/bevry" title="Donate to this project using Open Collective"><img src="https://img.shields.io/badge/open%20collective-donate-yellow.svg" alt="Open Collective donate button" /></a></span>
<span class="badge-crypto"><a href="https://bevry.me/crypto" title="Donate to this project using Cryptocurrency"><img src="https://img.shields.io/badge/crypto-donate-yellow.svg" alt="crypto donate button" /></a></span>
<span class="badge-paypal"><a href="https://bevry.me/paypal" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>
<span class="badge-wishlist"><a href="https://bevry.me/wishlist" title="Buy an item on our wishlist for us"><img src="https://img.shields.io/badge/wishlist-donate-yellow.svg" alt="Wishlist browse button" /></a></span>

<!-- /BADGES -->


<!-- DESCRIPTION/ -->

Determine if a filename and/or buffer is text or binary. Smarter detection than the other solutions.

<!-- /DESCRIPTION -->


Determination works like so:

1. Extension Check: If filename is available, check if any of its extensions (from right to left) are an [text extension](https://github.com/bevry/textextensions) or a [binary extension](https://github.com/bevry/binaryextensions), this is near instant.
2. Contents Check: If no filename was provided, or the extension check was indeterminate, then check the contents of the buffer.

The extension check will check each of the filename's extensions, from right to left. This is done as certain applications utilise multiple extensions for transformations, such as `app.x.y` may tell a compiler to transform from `x` format to `y` format, in this case perhaps `x` is not a recognized extension but `y` is, in which case we can make use of that to provide superior accuracy and convenience compared to just checking the rightmost extension.

The contents check (with the default options) will check 24 bytes at the start, middle, and end of the buffer. History has shown that checking all three locations is mandatory for accuracy, and that anything less is not accurate. This technique offers superior performance while still offering superior accuracy. Alternatives generally just do 1000 bytes at the start, which is slower, and inaccurate.

One cannot just do the contents check alone because UTF16 characters are indistinguishable from binary which would return an inaccurate result, hence why the combination is necessary for accuracy, with performance for known extensions a side-effect.

As such, this library's combination of extension check (if filename is provided), then contents check (if buffer is provided), offers superior performance and accuracy to alternatives.

Ever since 2012, this module's superior accuracy and performance has been essential to the operation of [DocPad](https://docpad.org) and its other dependents.

## Usage

[Complete API Documentation.](http://master.istextorbinary.bevry.surge.sh/docs/globals.html)

```typescript
import { isText, isBinary, getEncoding } from 'istextorbinary'
```

or

```javascript
const { isText, isBinary, getEncoding } = require('istextorbinary')
```

then

```javascript
isText(aFilename) // returns true if a text file otherwise false, checks only filename
isText(null, aBuffer) // returns true if a text file otherwise false, checks only buffer
isText(aFilename, aBuffer) // returns true if a text file otherwise false, checks filename then buffer
isText(null, null) // returns null

isBinary(aFilename) // returns true if a binary file otherwise false, checks only filename
isBinary(null, aBuffer) // returns true if a binary file otherwise false, checks only buffer
isBinary(aFilename, aBuffer) // returns true if a binary file otherwise false, checks filename then buffer
isBinary(null, null) // returns null

getEncoding(aBuffer) // returns 'binary' if it contained non-utf8 characters, otherwise returns 'utf8'
```

<!-- INSTALL/ -->

<h2>Install</h2>

<a href="https://npmjs.com" title="npm is a package manager for javascript"><h3>npm</h3></a>
<ul>
<li>Install: <code>npm install --save istextorbinary</code></li>
<li>Import: <code>import * as pkg from ('istextorbinary')</code></li>
<li>Require: <code>const pkg = require('istextorbinary')</code></li>
</ul>

<a href="https://deno.land" title="Deno is a secure runtime for JavaScript and TypeScript, it is an alternative for Node.js"><h3>Deno</h3></a>

``` typescript
import * as pkg from 'https://unpkg.com/istextorbinary@^5.12.0/edition-deno/index.ts'
```

<a href="https://www.skypack.dev" title="Skypack is a JavaScript Delivery Network for modern web apps"><h3>Skypack</h3></a>

``` html
<script type="module">
    import * as pkg from '//cdn.skypack.dev/istextorbinary@^5.12.0'
</script>
```

<a href="https://unpkg.com" title="unpkg is a fast, global content delivery network for everything on npm"><h3>unpkg</h3></a>

``` html
<script type="module">
    import * as pkg from '//unpkg.com/istextorbinary@^5.12.0'
</script>
```

<a href="https://jspm.io" title="Native ES Modules CDN"><h3>jspm</h3></a>

``` html
<script type="module">
    import * as pkg from '//dev.jspm.io/istextorbinary@5.12.0'
</script>
```

<h3><a href="https://editions.bevry.me" title="Editions are the best way to produce and consume packages you care about.">Editions</a></h3>

<p>This package is published with the following editions:</p>

<ul><li><code>istextorbinary</code> aliases <code>istextorbinary/index.cjs</code> which uses the <a href="https://github.com/bevry/editions" title="You can use the Editions Autoloader to autoload the appropriate edition for your consumers environment">Editions Autoloader</a> to automatically select the correct edition for the consumer's environment</li>
<li><code>istextorbinary/source/index.ts</code> is <a href="https://www.typescriptlang.org/" title="TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. ">TypeScript</a> source code with <a href="https://babeljs.io/docs/learn-es2015/#modules" title="ECMAScript Modules">Import</a> for modules</li>
<li><code>istextorbinary/edition-browsers/index.js</code> is <a href="https://www.typescriptlang.org/" title="TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. ">TypeScript</a> compiled against <a href="https://en.wikipedia.org/wiki/ECMAScript#10th_Edition_-_ECMAScript_2019" title="ECMAScript ES2019">ES2019</a> for web browsers with <a href="https://babeljs.io/docs/learn-es2015/#modules" title="ECMAScript Modules">Import</a> for modules</li>
<li><code>istextorbinary/edition-esnext/index.js</code> is <a href="https://www.typescriptlang.org/" title="TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. ">TypeScript</a> compiled against <a href="https://en.wikipedia.org/wiki/ECMAScript#ES.Next" title="ECMAScript Next">ESNext</a> for <a href="https://nodejs.org" title="Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine">Node.js</a> 14 || 15 with <a href="https://nodejs.org/dist/latest-v5.x/docs/api/modules.html" title="Node/CJS Modules">Require</a> for modules</li>
<li><code>istextorbinary/edition-es2019/index.js</code> is <a href="https://www.typescriptlang.org/" title="TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. ">TypeScript</a> compiled against <a href="https://en.wikipedia.org/wiki/ECMAScript#10th_Edition_-_ECMAScript_2019" title="ECMAScript ES2019">ES2019</a> for <a href="https://nodejs.org" title="Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine">Node.js</a> 10 || 12 || 14 || 15 with <a href="https://nodejs.org/dist/latest-v5.x/docs/api/modules.html" title="Node/CJS Modules">Require</a> for modules</li>
<li><code>istextorbinary/edition-es2019-esm/index.js</code> is <a href="https://www.typescriptlang.org/" title="TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. ">TypeScript</a> compiled against <a href="https://en.wikipedia.org/wiki/ECMAScript#10th_Edition_-_ECMAScript_2019" title="ECMAScript ES2019">ES2019</a> for <a href="https://nodejs.org" title="Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine">Node.js</a> 12 || 14 || 15 with <a href="https://babeljs.io/docs/learn-es2015/#modules" title="ECMAScript Modules">Import</a> for modules</li>
<li><code>istextorbinary/edition-deno/index.ts</code> is <a href="https://www.typescriptlang.org/" title="TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. ">TypeScript</a> source code made to be compatible with <a href="https://deno.land" title="Deno is a secure runtime for JavaScript and TypeScript, it is an alternative to Node.js">Deno</a></li></ul>

<!-- /INSTALL -->


<!-- HISTORY/ -->

<h2>History</h2>

<a href="https://github.com/bevry/istextorbinary/blob/master/HISTORY.md#files">Discover the release history by heading on over to the <code>HISTORY.md</code> file.</a>

<!-- /HISTORY -->


<!-- CONTRIBUTE/ -->

<h2>Contribute</h2>

<a href="https://github.com/bevry/istextorbinary/blob/master/CONTRIBUTING.md#files">Discover how you can contribute by heading on over to the <code>CONTRIBUTING.md</code> file.</a>

<!-- /CONTRIBUTE -->


<!-- BACKERS/ -->

<h2>Backers</h2>

<h3>Maintainers</h3>

These amazing people are maintaining this project:

<ul><li><a href="https://balupton.com">Benjamin Lupton</a> — <a href="https://github.com/bevry/istextorbinary/commits?author=balupton" title="View the GitHub contributions of Benjamin Lupton on repository bevry/istextorbinary">view contributions</a></li>
<li><a href="https://github.com/mikeumus">Michael Mooring</a> — <a href="https://github.com/bevry/istextorbinary/commits?author=mikeumus" title="View the GitHub contributions of Michael Mooring on repository bevry/istextorbinary">view contributions</a></li>
<li><a href="https://github.com/robloach">Rob Loach</a> — <a href="https://github.com/bevry/istextorbinary/commits?author=robloach" title="View the GitHub contributions of Rob Loach on repository bevry/istextorbinary">view contributions</a></li></ul>

<h3>Sponsors</h3>

No sponsors yet! Will you be the first?

<span class="badge-githubsponsors"><a href="https://github.com/sponsors/balupton" title="Donate to this project using GitHub Sponsors"><img src="https://img.shields.io/badge/github-donate-yellow.svg" alt="GitHub Sponsors donate button" /></a></span>
<span class="badge-patreon"><a href="https://patreon.com/bevry" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
<span class="badge-flattr"><a href="https://flattr.com/profile/balupton" title="Donate to this project using Flattr"><img src="https://img.shields.io/badge/flattr-donate-yellow.svg" alt="Flattr donate button" /></a></span>
<span class="badge-liberapay"><a href="https://liberapay.com/bevry" title="Donate to this project using Liberapay"><img src="https://img.shields.io/badge/liberapay-donate-yellow.svg" alt="Liberapay donate button" /></a></span>
<span class="badge-buymeacoffee"><a href="https://buymeacoffee.com/balupton" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a></span>
<span class="badge-opencollective"><a href="https://opencollective.com/bevry" title="Donate to this project using Open Collective"><img src="https://img.shields.io/badge/open%20collective-donate-yellow.svg" alt="Open Collective donate button" /></a></span>
<span class="badge-crypto"><a href="https://bevry.me/crypto" title="Donate to this project using Cryptocurrency"><img src="https://img.shields.io/badge/crypto-donate-yellow.svg" alt="crypto donate button" /></a></span>
<span class="badge-paypal"><a href="https://bevry.me/paypal" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>
<span class="badge-wishlist"><a href="https://bevry.me/wishlist" title="Buy an item on our wishlist for us"><img src="https://img.shields.io/badge/wishlist-donate-yellow.svg" alt="Wishlist browse button" /></a></span>

<h3>Contributors</h3>

These amazing people have contributed code to this project:

<ul><li><a href="https://balupton.com">Benjamin Lupton</a> — <a href="https://github.com/bevry/istextorbinary/commits?author=balupton" title="View the GitHub contributions of Benjamin Lupton on repository bevry/istextorbinary">view contributions</a></li>
<li><a href="https://github.com/sibnerian">Ian Sibner</a> — <a href="https://github.com/bevry/istextorbinary/commits?author=sibnerian" title="View the GitHub contributions of Ian Sibner on repository bevry/istextorbinary">view contributions</a></li>
<li><a href="https://github.com/mikeumus">Michael Mooring</a> — <a href="https://github.com/bevry/istextorbinary/commits?author=mikeumus" title="View the GitHub contributions of Michael Mooring on repository bevry/istextorbinary">view contributions</a></li>
<li><a href="https://github.com/robloach">Rob Loach</a> — <a href="https://github.com/bevry/istextorbinary/commits?author=robloach" title="View the GitHub contributions of Rob Loach on repository bevry/istextorbinary">view contributions</a></li>
<li><a href="https://github.com/AlbinoDrought">Sean</a> — <a href="https://github.com/bevry/istextorbinary/commits?author=AlbinoDrought" title="View the GitHub contributions of Sean on repository bevry/istextorbinary">view contributions</a></li>
<li><a href="https://github.com/shinnn">shinnn</a> — <a href="https://github.com/bevry/istextorbinary/commits?author=shinnn" title="View the GitHub contributions of shinnn on repository bevry/istextorbinary">view contributions</a></li></ul>

<a href="https://github.com/bevry/istextorbinary/blob/master/CONTRIBUTING.md#files">Discover how you can contribute by heading on over to the <code>CONTRIBUTING.md</code> file.</a>

<!-- /BACKERS -->


<!-- LICENSE/ -->

<h2>License</h2>

Unless stated otherwise all works are:

<ul><li>Copyright &copy; 2012+ <a href="http://bevry.me">Bevry Pty Ltd</a></li>
<li>Copyright &copy; 2011 <a href="https://balupton.com">Benjamin Lupton</a></li></ul>

and licensed under:

<ul><li><a href="http://spdx.org/licenses/MIT.html">MIT License</a></li></ul>

<!-- /LICENSE -->
