rtc
===

Firefox plugin to allow retweet with comment in twitter web page


* Firefox plugin page: https://addons.mozilla.org/es/developers/
* Page where plugin applies: https://twitter.com/
* Library to listen for add new elements in DOM elements: https://github.com/naugtur/insertionQuery

How it works:
 1 - Use "pagemod" module to add js files with plugin functionality when   https://twitter.com is loaded.

 2 - Add li item "Rt+C" equal to the other actions "Reply, Retweet"

 3 - Add click function to "Rt+C" item

 4 - Show new tweet modal calling "click" function on "new tweet" button

 5 - Modify "new tweet" modal view:
	  - Add tweet content to "retweet with comment" in text editor of "new tweet" modal view
	  - Change title

 6 - Restore "new tweet" modal view adding a click function over new tweet button:
      - Restore class and value (orignal saved)
      - Remove possible text in text editor of "new tweet" modal view